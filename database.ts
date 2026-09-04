/**
 * Postgres data layer (Supabase).
 *
 * This module deliberately keeps the exact signatures the SQLite version had —
 * dbRun / dbGet / dbAll / dbExec, taking `?`-style SQL — so the 75 call sites in
 * server.ts did not have to change when the database did. Three translations
 * make that possible, and each one exists because of a specific way Postgres
 * differs from SQLite:
 *
 *   1. Placeholders.  SQLite takes `?`; Postgres takes `$1, $2`. Converted here,
 *      skipping anything inside a string literal so a `?` in text survives.
 *
 *   2. Identifier case.  Postgres folds unquoted identifiers to lower case, so
 *      `passwordHash` is stored as `passwordhash` and comes back that way. The
 *      queries still match (both sides fold), but `row.doctorId` would silently
 *      be undefined everywhere. Result rows are mapped back to camelCase below.
 *
 *   3. Bigint.  `SELECT COUNT(*)` returns int8, which node-postgres hands back
 *      as a *string* to avoid precision loss. The seed checks compare with
 *      `=== 0`, which a string never satisfies — so int8 is parsed as a number.
 */
import pg from "pg";
import {
  hospitals as seedHospitals,
  doctors as seedDoctors,
  medicineProducts as seedMedicines
} from "./seedData";

// int8 (OID 20) as a JS number rather than a string. Safe here: these are row
// counts and small integers, nowhere near 2^53.
pg.types.setTypeParser(20, (v) => parseInt(v, 10));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "[FATAL] DATABASE_URL is not set. Copy the connection string from " +
    "Supabase → Project Settings → Database → Connection string → URI, and put " +
    "it in .env.local. Refusing to start without a database."
  );
  process.exit(1);
}

export const pool = new pg.Pool({
  connectionString,
  // Supabase terminates TLS with a certificate this client has no local root
  // for; the connection is still encrypted.
  ssl: { rejectUnauthorized: false },
  max: Number(process.env.PG_POOL_MAX) || 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000
});

pool.on("error", (err) => {
  // A pooled connection dropped while idle. Log rather than crash: the pool
  // replaces it on the next checkout.
  console.error("[Postgres] Idle client error:", err.message);
});

/**
 * Every camelCase column in the schema, keyed by the lower-cased name Postgres
 * actually returns. Anything absent is already lower case and passes through.
 */
const COLUMN_CASE: Record<string, string> = {
  // users
  bloodgroup: "bloodGroup", policyno: "policyNo", createdat: "createdAt",
  updatedat: "updatedAt", doctorid: "doctorId",
  // hospitals
  totalbeds: "totalBeds", availablebeds: "availableBeds", icubeds: "icuBeds",
  icuavailable: "icuAvailable", emergencyoccupancy: "emergencyOccupancy",
  hasambulancesupport: "hasAmbulanceSupport",
  ambulancesupportcount: "ambulanceSupportCount", isgovernment: "isGovernment",
  hastelemedicine: "hasTelemedicine", hasopdbooking: "hasOpdBooking",
  doctorsavailablecount: "doctorsAvailableCount",
  // doctors
  patientsserved: "patientsServed", queuecount: "queueCount",
  hospitalname: "hospitalName", waittimemin: "waitTimeMin", imageurl: "imageUrl",
  // appointments
  patientid: "patientId", patientname: "patientName", doctorname: "doctorName",
  prescriptionjson: "prescriptionJson",
  // queue_tokens
  tokennumber: "tokenNumber", estimatedwaittimemin: "estimatedWaitTimeMin",
  checkpointtime: "checkpointTime",
  // medical_records
  diagnosesummary: "diagnoseSummary", attachmentname: "attachmentName",
  // medicines
  requiresprescription: "requiresPrescription", dosageform: "dosageForm",
  pillscolor: "pillsColor", pillsshape: "pillsShape",
  pillsmarkings: "pillsMarkings",
  // medicine_orders
  itemsjson: "itemsJson", totalamount: "totalAmount",
  prescriptionattached: "prescriptionAttached",
  prescriptionname: "prescriptionName", deliveryaddress: "deliveryAddress",
  // emergency_alerts
  patientphone: "patientPhone", assignedambulanceref: "assignedAmbulanceRef",
  // chat_messages
  appointmentid: "appointmentId"
};

function restoreCase<T>(row: any): T {
  if (!row) return row;
  const out: any = {};
  for (const key of Object.keys(row)) {
    out[COLUMN_CASE[key] ?? key] = row[key];
  }
  return out as T;
}

/**
 * Rewrite `?` placeholders as `$1, $2, …`.
 *
 * Quote-aware on purpose: a literal question mark inside a string — 'Fever?' or
 * a prompt fragment — must not be renumbered into a placeholder, which would
 * shift every parameter after it and bind the wrong values.
 */
function toPositional(sql: string): string {
  let out = "";
  let n = 0;
  let quote: string | null = null;

  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];

    if (quote) {
      out += c;
      // '' and "" are escaped quotes inside a literal, not the end of one.
      if (c === quote) {
        if (sql[i + 1] === quote) { out += sql[++i]; } else { quote = null; }
      }
      continue;
    }

    if (c === "'" || c === '"') { quote = c; out += c; continue; }
    if (c === "?") { out += "$" + ++n; continue; }
    out += c;
  }
  return out;
}

export async function dbRun(
  sql: string,
  params: any[] = []
): Promise<{ lastID: number; changes: number }> {
  const res = await pool.query(toPositional(sql), params);
  // lastID has no Postgres equivalent and nothing in this codebase reads it —
  // every table uses an application-generated text id. Kept at 0 so the return
  // shape still matches what the SQLite version promised.
  return { lastID: 0, changes: res.rowCount ?? 0 };
}

export async function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const res = await pool.query(toPositional(sql), params);
  return res.rows.length ? restoreCase<T>(res.rows[0]) : null;
}

export async function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const res = await pool.query(toPositional(sql), params);
  return res.rows.map((r) => restoreCase<T>(r));
}

/** Multi-statement / DDL execution. No placeholder translation. */
export async function dbExec(sql: string): Promise<void> {
  await pool.query(sql);
}

/**
 * Verify the schema is present, then seed reference data.
 *
 * The DDL itself lives in supabase/schema.sql and is applied once through the
 * Supabase SQL editor — it creates triggers and row-level-security policies that
 * need to be reviewed, not silently re-run by an application boot.
 *
 * Only the three reference tables are seeded. The old SQLite seed also inserted
 * sample appointments, queue tokens and medical records, which is no longer
 * possible: those rows carry a patientId that must reference a real Supabase
 * auth account, and none exists on a fresh project. Seed them from a signed-in
 * session instead.
 */
export async function initializeDatabase() {
  console.log("[Postgres] Verifying schema...");

  const present = await dbGet<{ count: number }>(
    `SELECT COUNT(*) AS count FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('users','hospitals','doctors','medicines',
                           'appointments','queue_tokens','medical_records',
                           'medicine_orders','emergency_alerts','chat_messages')`
  );

  if (!present || present.count < 10) {
    throw new Error(
      `Schema incomplete — found ${present?.count ?? 0} of 10 tables. ` +
      "Run supabase/schema.sql in the Supabase SQL editor before starting."
    );
  }
  console.log("[Postgres] Schema verified. Checking for seed data...");

  const hospCount = await dbGet<{ count: number }>("SELECT COUNT(*) AS count FROM hospitals");
  if (hospCount && hospCount.count === 0) {
    console.log("[Postgres Seeding] Seeding hospitals...");
    for (const h of seedHospitals) {
      await dbRun(
        `INSERT INTO hospitals (
           id, name, address, totalBeds, availableBeds, icuBeds, icuAvailable,
           emergencyOccupancy, lat, lng, phone, rating, specialties, categories,
           hasAmbulanceSupport, ambulanceSupportCount, isGovernment, hasTelemedicine,
           hasOpdBooking, email, doctorsAvailableCount
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO NOTHING`,
        [
          h.id, h.name, h.address, h.totalBeds, h.availableBeds, h.icuBeds, h.icuAvailable,
          h.emergencyOccupancy, h.lat, h.lng, h.phone, h.rating,
          JSON.stringify(h.specialties), JSON.stringify(h.categories),
          h.hasAmbulanceSupport ? 1 : 0, h.ambulanceSupportCount, h.isGovernment ? 1 : 0,
          h.hasTelemedicine ? 1 : 0, h.hasOpdBooking ? 1 : 0, h.email, h.doctorsAvailableCount
        ]
      );
    }
    console.log(`[Postgres Seeding] Seeded ${seedHospitals.length} hospitals.`);
  }

  const docCount = await dbGet<{ count: number }>("SELECT COUNT(*) AS count FROM doctors");
  if (docCount && docCount.count === 0) {
    console.log("[Postgres Seeding] Seeding doctors...");
    for (const d of seedDoctors) {
      await dbRun(
        `INSERT INTO doctors (
           id, name, specialty, rating, experience, patientsServed, online,
           queueCount, hospitalName, waitTimeMin, imageUrl
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO NOTHING`,
        [
          d.id, d.name, d.specialty, d.rating, d.experience, d.patientsServed,
          d.online ? 1 : 0, d.queueCount, d.hospitalName, d.waitTimeMin, d.imageUrl
        ]
      );
    }
    console.log(`[Postgres Seeding] Seeded ${seedDoctors.length} doctors.`);
  }

  const medCount = await dbGet<{ count: number }>("SELECT COUNT(*) AS count FROM medicines");
  if (medCount && medCount.count === 0) {
    console.log("[Postgres Seeding] Seeding medicines...");
    for (const m of seedMedicines) {
      await dbRun(
        `INSERT INTO medicines (
           id, name, category, price, stock, description, requiresPrescription,
           dosageForm, imageUrl, pillsColor, pillsShape, pillsMarkings
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO NOTHING`,
        [
          m.id, m.name, m.category, m.price, m.stock, m.description,
          m.requiresPrescription ? 1 : 0, m.dosageForm, m.imageUrl,
          m.pillsColor, m.pillsShape, m.pillsMarkings
        ]
      );
    }
    console.log(`[Postgres Seeding] Seeded ${seedMedicines.length} medicines.`);
  }

  console.log("[Postgres] Database initialization completed successfully.");
}
