/**
 * Local end-to-end smoke test — plain Postgres, no Docker, no cloud project.
 *
 *   npx tsx scripts/local-smoke.ts
 *
 * Verifies the parts of the Supabase migration that are ours to get wrong:
 * the pg driver's placeholder translation and camelCase mapping, the schema and
 * its provisioning trigger, token verification, and the role and ownership
 * rules on the live routes.
 *
 * It does NOT test Supabase Auth — sign-up, password policy, email confirmation
 * and refresh are Supabase's own code, and reaching them needs a real project.
 * Accounts are created by inserting into auth.users (see local-test-shim.sql)
 * so the trigger provisions the profile exactly as it would in production, and
 * tokens are minted with the same HS256 secret the server verifies against,
 * which is the identical code path a Supabase-issued token takes.
 *
 * Requires DATABASE_URL and SUPABASE_JWT_SECRET. Point DATABASE_URL at a
 * scratch database — this creates and deletes accounts.
 */
import "../env";
import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import pg from "pg";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const PORT = Number(process.env.SMOKE_PORT) || 3811;
const BASE = `http://127.0.0.1:${PORT}`;
const { DATABASE_URL, SUPABASE_JWT_SECRET } = process.env;

if (!DATABASE_URL || !SUPABASE_JWT_SECRET) {
  console.error(
    "[smoke] Needs DATABASE_URL and SUPABASE_JWT_SECRET in .env.local.\n" +
    "        For a local Postgres, DATABASE_URL looks like:\n" +
    "          postgresql://postgres:<password>@127.0.0.1:5432/swasthai_local\n" +
    "        SUPABASE_JWT_SECRET can be any string of 32+ characters locally."
  );
  process.exit(1);
}

const isLocal = /(?:@|\/\/)(?:127\.0\.0\.1|localhost)[:/]/.test(DATABASE_URL);
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

const EMAILS = {
  alice: "smoke.alice@test.invalid",
  bob: "smoke.bob@test.invalid",
  admin: "smoke.admin@test.invalid",
  doctor: "smoke.doctor@test.invalid"
};

let server: ChildProcessWithoutNullStreams;
let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail = "") {
  if (ok) { passed++; console.log(`  PASS  ${label}`); }
  else { failed++; console.log(`  FAIL  ${label}${detail ? "  — " + detail : ""}`); }
}

async function api(method: string, route: string, token?: string, body?: unknown) {
  const res = await fetch(`${BASE}${route}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  let payload: any = null;
  try { payload = await res.json(); } catch { /* empty body is fine */ }
  return { status: res.status, body: payload };
}

/** A token shaped like Supabase's: the uid lives in `sub`. */
function mintToken(uid: string, email: string): string {
  return jwt.sign(
    { sub: uid, email, aud: "authenticated", role: "authenticated" },
    SUPABASE_JWT_SECRET!,
    { expiresIn: "1h" }
  );
}

async function makeUser(email: string, name: string, role: string) {
  const id = crypto.randomUUID();
  // The trigger on auth.users creates the profile — nothing here inserts it.
  await pool.query(
    "INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES ($1, $2, $3)",
    [id, email, JSON.stringify({ name })]
  );
  if (role !== "PATIENT") {
    await pool.query("UPDATE users SET role = $1 WHERE uid = $2", [role, id]);
  }
  return { uid: id, email, token: mintToken(id, email) };
}

async function purge() {
  await pool.query("DELETE FROM auth.users WHERE email = ANY($1)", [Object.values(EMAILS)]);
}

async function waitForReady(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const health = await fetch(`${BASE}/api/health`);
      if (health.ok) {
        const docs = await fetch(`${BASE}/api/doctors`);
        if (docs.ok) {
          const list = (await docs.json()) as Array<{ id: string }>;
          if (list.some((d) => d.id === "doc-1")) return;
        }
      }
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not become ready on ${BASE}`);
}

function stopServer() {
  if (!server?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    try { process.kill(-server.pid, "SIGKILL"); } catch { server.kill("SIGKILL"); }
  }
}

async function main() {
  console.log(`[smoke] database : ${DATABASE_URL!.replace(/:[^:@]+@/, ":****@")}`);
  console.log(`[smoke] server   : ${BASE}\n`);

  await purge();

  server = spawn("npx", ["tsx", "server.ts"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: "development",
      API_ONLY: "true",
      DEMO_MODE: "false"
    },
    shell: process.platform === "win32",
    detached: process.platform !== "win32"
  });
  server.stdout.on("data", () => {});
  server.stderr.on("data", () => {});
  process.on("exit", stopServer);

  await waitForReady();
  console.log("--- driver & schema ---");

  // camelCase mapping: the single most likely thing to be silently broken.
  const doctors = await api("GET", "/api/doctors");
  const d0 = doctors.body?.[0];
  check("GET /api/doctors returns rows", Array.isArray(doctors.body) && doctors.body.length > 0);
  check("camelCase preserved (doctor.hospitalName)", d0 && "hospitalName" in d0,
    d0 ? `keys: ${Object.keys(d0).slice(0, 8).join(",")}` : "no rows");
  check("camelCase preserved (doctor.waitTimeMin)", d0 && "waitTimeMin" in d0);

  const hospitals = await api("GET", "/api/hospitals");
  const h0 = hospitals.body?.[0];
  check("camelCase preserved (hospital.availableBeds)", h0 && "availableBeds" in h0);
  check("seed count is 52 hospitals", hospitals.body?.length === 52,
    `got ${hospitals.body?.length}`);

  console.log("\n--- provisioning trigger ---");
  const alice = await makeUser(EMAILS.alice, "Alice Smoke", "PATIENT");
  const profile = await pool.query("SELECT role, name FROM users WHERE uid = $1", [alice.uid]);
  check("trigger created the profile row", profile.rowCount === 1);
  check("trigger forced role PATIENT", profile.rows[0]?.role === "PATIENT",
    `got ${profile.rows[0]?.role}`);

  const bob = await makeUser(EMAILS.bob, "Bob Smoke", "PATIENT");
  const admin = await makeUser(EMAILS.admin, "Admin Smoke", "ADMIN");
  const doctor = await makeUser(EMAILS.doctor, "Doctor Smoke", "DOCTOR");

  console.log("\n--- token verification ---");
  check("no token -> 401", (await api("GET", "/api/records")).status === 401);
  check("garbage token -> 401", (await api("GET", "/api/records", "not.a.token")).status === 401);
  const forged = jwt.sign({ sub: alice.uid }, "attacker-secret-still-32-chars-long!!");
  check("token signed with wrong secret -> 401",
    (await api("GET", "/api/records", forged)).status === 401);
  check("valid token -> 200", (await api("GET", "/api/records", alice.token)).status === 200);

  console.log("\n--- profile: SA-01 regression ---");
  const put = await api("PUT", `/api/users/${alice.uid}`, alice.token, { name: "Alice Renamed" });
  check("PUT own profile -> 200", put.status === 200, `got ${put.status}`);
  check("PUT response has no passwordHash",
    !JSON.stringify(put.body ?? {}).includes("passwordHash"));
  const got = await api("GET", `/api/users/${alice.uid}`, alice.token);
  check("GET response has no passwordHash",
    !JSON.stringify(got.body ?? {}).includes("passwordHash"));
  check("profile update persisted", got.body?.name === "Alice Renamed", `got ${got.body?.name}`);

  console.log("\n--- authorization ---");
  check("cross-user profile read -> 403",
    (await api("GET", `/api/users/${bob.uid}`, alice.token)).status === 403);
  check("patient cannot escalate own role -> 403",
    (await api("PUT", `/api/users/${alice.uid}`, alice.token, { role: "ADMIN" })).status === 403);
  const roleAfter = await pool.query("SELECT role FROM users WHERE uid = $1", [alice.uid]);
  check("role unchanged after refused escalation", roleAfter.rows[0]?.role === "PATIENT");
  check("admin may read another profile -> 200",
    (await api("GET", `/api/users/${bob.uid}`, admin.token)).status === 200);
  check("patient cannot read dispatch stream -> 403",
    (await api("GET", "/api/emergency/alerts", alice.token)).status === 403);
  check("patient cannot write bed census -> 403",
    (await api("PUT", "/api/hospitals/hosp-1/beds", alice.token, { availableBeds: 5 })).status === 403);
  check("admin may read dispatch stream -> 200",
    (await api("GET", "/api/emergency/alerts", admin.token)).status === 200);

  console.log("\n--- writes & isolation ---");
  const booked = await api("POST", "/api/appointments", bob.token, {
    doctorId: "doc-1", patientName: "Bob Smoke", symptoms: "smoke test"
  });
  check("patient books an appointment -> 200", booked.status === 200, `got ${booked.status}`);
  const bobAppts = await api("GET", "/api/appointments", bob.token);
  check("booking is visible to its owner", (bobAppts.body?.length ?? 0) > 0);
  const aliceAppts = await api("GET", "/api/appointments", alice.token);
  check("another patient sees none of it", (aliceAppts.body?.length ?? 0) === 0,
    `got ${aliceAppts.body?.length}`);

  await api("POST", "/api/records", bob.token, {
    title: "Bob private", doctorName: "Dr X", diagnoseSummary: "confidential"
  });
  const aliceRecords = await api("GET", "/api/records", alice.token);
  check("records are patient-scoped",
    !JSON.stringify(aliceRecords.body ?? []).includes("Bob private"));

  const unlinked = await api("GET", "/api/records", doctor.token);
  check("unlinked doctor sees zero records", (unlinked.body?.length ?? 0) === 0,
    `got ${unlinked.body?.length}`);
  await pool.query("UPDATE users SET doctorId = 'doc-1' WHERE uid = $1", [doctor.uid]);
  const linked = await api("GET", "/api/records", doctor.token);
  check("linked doctor sees their patient's record", (linked.body?.length ?? 0) > 0,
    `got ${linked.body?.length}`);

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exitCode = 1;
}

main()
  .catch((err) => {
    console.error("\n[smoke] failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    stopServer();
    try { await purge(); } catch { /* server may hold the rows briefly */ }
    await pool.end();
  });
