/**
 * One-off migration: SQLite (city_healer.db) -> Supabase Postgres.
 *
 *   npx tsx scripts/migrate-sqlite-to-supabase.ts --db city_healer.db
 *   npx tsx scripts/migrate-sqlite-to-supabase.ts --db city_healer.db --commit
 *
 * Dry run is the DEFAULT. Nothing is written until --commit is passed, because
 * the target is a live database and the failure mode of getting this wrong is
 * duplicated or half-linked clinical records.
 *
 * ---------------------------------------------------------------------------
 * What this can and cannot carry over
 * ---------------------------------------------------------------------------
 *
 * Reference data (hospitals, doctors, medicines) moves cleanly: the ids are
 * application-generated strings and mean the same thing in both databases.
 * In practice the server already seeds these from seedData.ts on first boot, so
 * this part usually finds nothing to do.
 *
 * Accounts cannot move as they are. Supabase Auth owns credentials now, and a
 * uid changes from an application string ("user-1788...") to the auth account's
 * uuid. So for each old row this creates a Supabase account with the same email
 * and records old-uid -> new-uuid, which every clinical row is then rewritten
 * through.
 *
 * PASSWORDS DO NOT MOVE. Each migrated account gets a random unguessable
 * password that nobody is told, so the only way in is a password reset. Pass
 * --invite to send those emails, or leave it off and tell people yourself.
 * Importing the old bcrypt hashes is technically possible but deliberately not
 * done here: it is version-dependent, silently produces unloggable-in accounts
 * when it goes wrong, and a password reset is a better outcome for a health
 * record than a subtly broken credential.
 *
 * Clinical rows whose patient no longer resolves are SKIPPED and listed, never
 * guessed at or attached to some other account.
 */
import "../env";
import path from "path";
import sqlite3 from "sqlite3";
import pg from "pg";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Arguments and configuration
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) { out[key] = true; } else { out[key] = next; i++; }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const COMMIT = args.commit === true;
const INVITE = args.invite === true;
const SQLITE_PATH = path.resolve(
  process.cwd(),
  typeof args.db === "string" ? args.db : "city_healer.db"
);

const { DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!DATABASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "[migrate] Needs DATABASE_URL, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
    "          SUPABASE_SERVICE_ROLE_KEY is required to create accounts. It bypasses row\n" +
    "          level security — keep it server-side and never in a VITE_ variable."
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ---------------------------------------------------------------------------
// SQLite reader
// ---------------------------------------------------------------------------

const sqlite = new sqlite3.Database(SQLITE_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(`[migrate] Cannot open ${SQLITE_PATH}: ${err.message}`);
    process.exit(1);
  }
});

const readAll = <T = any>(sql: string): Promise<T[]> =>
  new Promise((resolve, reject) =>
    sqlite.all(sql, [], (err, rows) => (err ? reject(err) : resolve((rows as T[]) ?? [])))
  );

const tableExists = async (name: string): Promise<boolean> => {
  const rows = await readAll<{ n: number }>(
    `SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name='${name}'`
  );
  return (rows[0]?.n ?? 0) > 0;
};

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const report: Array<{ table: string; read: number; written: number; skipped: number; note?: string }> = [];
const skipped: string[] = [];

function say(msg: string) { console.log(msg); }

/**
 * Insert one row, ignoring anything already present.
 *
 * ON CONFLICT DO NOTHING makes the whole migration re-runnable: an interrupted
 * run can simply be repeated without producing duplicates.
 */
async function insert(table: string, row: Record<string, any>): Promise<boolean> {
  const cols = Object.keys(row);
  const params = cols.map((_, i) => `$${i + 1}`).join(", ");
  const res = await pool.query(
    `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${params}) ON CONFLICT DO NOTHING`,
    cols.map((c) => row[c])
  );
  return (res.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Migration steps
// ---------------------------------------------------------------------------

async function migrateReference(table: string, columns: string[]) {
  if (!(await tableExists(table))) {
    report.push({ table, read: 0, written: 0, skipped: 0, note: "absent in source" });
    return;
  }
  const rows = await readAll(`SELECT * FROM ${table}`);
  let written = 0;

  for (const row of rows) {
    const payload: Record<string, any> = {};
    for (const c of columns) payload[c] = row[c];
    if (COMMIT && (await insert(table, payload))) written++;
  }
  report.push({
    table,
    read: rows.length,
    written: COMMIT ? written : 0,
    skipped: 0,
    note: COMMIT ? undefined : "dry run"
  });
}

/**
 * Create a Supabase account per legacy user row and return old-uid -> new-uuid.
 *
 * An email that already has an account is reused rather than duplicated, so a
 * partially completed run can be finished by running the script again.
 */
async function migrateUsers(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!(await tableExists("users"))) {
    report.push({ table: "users", read: 0, written: 0, skipped: 0, note: "absent in source" });
    return map;
  }

  const rows = await readAll<any>("SELECT * FROM users");
  let written = 0;
  let reused = 0;

  // One listing, rather than a lookup per row.
  const existing = new Map<string, string>();
  if (rows.length) {
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw new Error(`could not list existing accounts: ${error.message}`);
    for (const u of data.users) if (u.email) existing.set(u.email.toLowerCase(), u.id);
  }

  for (const row of rows) {
    const email = String(row.email ?? "").toLowerCase().trim();
    if (!email) { skipped.push(`users: row ${row.uid} has no email`); continue; }

    const already = existing.get(email);
    if (already) { map.set(row.uid, already); reused++; continue; }

    if (!COMMIT) { map.set(row.uid, `dry-run-${row.uid}`); continue; }

    const created = await admin.auth.admin.createUser({
      email,
      // Deliberately unguessable and never printed. The account is reachable
      // only through a password reset.
      password: crypto.randomBytes(24).toString("base64url"),
      email_confirm: true,
      user_metadata: { name: row.name ?? "", phone: row.phone ?? "" }
    });
    if (created.error || !created.data.user) {
      skipped.push(`users: ${email} — ${created.error?.message ?? "unknown error"}`);
      continue;
    }

    const newUid = created.data.user.id;
    map.set(row.uid, newUid);
    written++;

    // The on_auth_user_created trigger has already created the profile with role
    // PATIENT. Restore the rest of the legacy profile, role included — this runs
    // as the database owner, which is the administrative path for role changes.
    await pool.query(
      `UPDATE users SET name = $1, phone = $2, role = $3, age = $4, gender = $5,
                        bloodGroup = $6, policyNo = $7, createdAt = $8,
                        updatedAt = $9, doctorId = $10
        WHERE uid = $11`,
      [
        row.name, row.phone, row.role ?? "PATIENT", row.age, row.gender,
        row.bloodGroup, row.policyNo, row.createdAt, row.updatedAt,
        row.doctorId ?? null, newUid
      ]
    );

    if (INVITE) {
      // Outward-facing: this emails a real person. Off unless asked for.
      const { error } = await admin.auth.resetPasswordForEmail(email);
      if (error) skipped.push(`invite: ${email} — ${error.message}`);
    }
  }

  report.push({
    table: "users",
    read: rows.length,
    written: COMMIT ? written : 0,
    skipped: rows.length - written - reused,
    note: reused ? `${reused} already existed` : (COMMIT ? undefined : "dry run")
  });
  return map;
}

/** Migrate a table that carries a patientId, remapping it onto the new uuid. */
async function migrateOwned(table: string, columns: string[], ownerCol = "patientId") {
  if (!(await tableExists(table))) {
    report.push({ table, read: 0, written: 0, skipped: 0, note: "absent in source" });
    return;
  }
  const rows = await readAll<any>(`SELECT * FROM ${table}`);
  let written = 0;
  let dropped = 0;

  for (const row of rows) {
    const oldOwner = row[ownerCol];
    const newOwner = oldOwner ? uidMap.get(oldOwner) : null;

    // A row whose patient did not migrate is left behind on purpose. Attaching
    // an orphaned medical record to the wrong account is far worse than losing
    // a sample row, so these are listed and skipped rather than guessed at.
    if (oldOwner && !newOwner) {
      dropped++;
      skipped.push(`${table}: ${row.id} — patient ${oldOwner} did not migrate`);
      continue;
    }

    const payload: Record<string, any> = {};
    for (const c of columns) payload[c] = c === ownerCol ? newOwner : row[c];
    if (COMMIT && (await insert(table, payload))) written++;
  }

  report.push({
    table,
    read: rows.length,
    written: COMMIT ? written : 0,
    skipped: dropped,
    note: COMMIT ? undefined : "dry run"
  });
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

let uidMap = new Map<string, string>();

async function main() {
  say(`[migrate] source : ${SQLITE_PATH}`);
  say(`[migrate] target : ${DATABASE_URL!.replace(/:[^:@]+@/, ":****@")}`);
  say(`[migrate] mode   : ${COMMIT ? "COMMIT — writing" : "DRY RUN — nothing will be written"}`);
  if (COMMIT && INVITE) say("[migrate] invite : password-reset emails WILL be sent to migrated users");
  say("");

  // Confirm the target schema is actually there before touching anything.
  const check = await pool.query(
    `SELECT COUNT(*)::int AS n FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'`
  );
  if (check.rows[0].n !== 1) {
    throw new Error("target has no public.users — run supabase/schema.sql first");
  }

  await migrateReference("hospitals", [
    "id", "name", "address", "totalBeds", "availableBeds", "icuBeds", "icuAvailable",
    "emergencyOccupancy", "lat", "lng", "phone", "rating", "specialties", "categories",
    "hasAmbulanceSupport", "ambulanceSupportCount", "isGovernment", "hasTelemedicine",
    "hasOpdBooking", "email", "doctorsAvailableCount"
  ]);
  await migrateReference("doctors", [
    "id", "name", "specialty", "rating", "experience", "patientsServed", "online",
    "queueCount", "hospitalName", "waitTimeMin", "imageUrl"
  ]);
  await migrateReference("medicines", [
    "id", "name", "category", "price", "stock", "description", "requiresPrescription",
    "dosageForm", "imageUrl", "pillsColor", "pillsShape", "pillsMarkings"
  ]);

  uidMap = await migrateUsers();

  // Appointments before chat_messages: chat rows reference an appointment.
  await migrateOwned("appointments", [
    "id", "patientId", "patientName", "doctorId", "doctorName", "specialty",
    "date", "time", "status", "symptoms", "type", "prescriptionJson"
  ]);
  await migrateOwned("queue_tokens", [
    "id", "tokenNumber", "patientId", "patientName", "doctorId", "doctorName",
    "estimatedWaitTimeMin", "status", "checkpointTime"
  ]);
  await migrateOwned("medical_records", [
    "id", "patientId", "date", "title", "doctorName", "diagnoseSummary", "attachmentName"
  ]);
  await migrateOwned("medicine_orders", [
    "id", "patientId", "patientName", "itemsJson", "totalAmount", "status",
    "prescriptionAttached", "prescriptionName", "deliveryAddress", "createdAt"
  ]);
  await migrateOwned("emergency_alerts", [
    "id", "patientId", "patientName", "patientPhone", "lat", "lng", "address",
    "type", "status", "timestamp", "assignedAmbulanceRef", "hospitalName"
  ]);

  // chat_messages has no patient column; it is scoped through its appointment.
  if (await tableExists("chat_messages")) {
    const rows = await readAll<any>("SELECT * FROM chat_messages");
    let written = 0, dropped = 0;
    for (const row of rows) {
      const parent = await pool.query("SELECT 1 FROM appointments WHERE id = $1", [row.appointmentId]);
      if (parent.rowCount !== 1) {
        dropped++;
        skipped.push(`chat_messages: ${row.id} — appointment ${row.appointmentId} not present`);
        continue;
      }
      if (COMMIT && (await insert("chat_messages", {
        id: row.id, appointmentId: row.appointmentId, sender: row.sender,
        text: row.text, timestamp: row.timestamp
      }))) written++;
    }
    report.push({ table: "chat_messages", read: rows.length, written, skipped: dropped });
  }

  // ---- summary ----
  say("");
  say("  table              read  written  skipped");
  say("  ---------------------------------------------------");
  for (const r of report) {
    say(
      "  " + r.table.padEnd(18) +
      String(r.read).padStart(4) +
      String(r.written).padStart(9) +
      String(r.skipped).padStart(9) +
      (r.note ? `   (${r.note})` : "")
    );
  }

  if (skipped.length) {
    say("");
    say(`  ${skipped.length} row(s) skipped:`);
    for (const s of skipped.slice(0, 40)) say(`    - ${s}`);
    if (skipped.length > 40) say(`    ... and ${skipped.length - 40} more`);
  }

  if (!COMMIT) {
    say("");
    say("  Dry run — nothing was written. Re-run with --commit to apply.");
  } else if (uidMap.size && !INVITE) {
    say("");
    say("  Migrated accounts have no usable password. Tell those users to use");
    say("  \"forgot password\", or re-run with --invite to email the reset links.");
  }
}

main()
  .catch((err) => {
    console.error("[migrate] failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await pool.end();
  });
