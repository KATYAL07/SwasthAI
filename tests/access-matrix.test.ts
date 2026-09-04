/**
 * Access-matrix regression suite.
 *
 * Encodes the authorization guarantees established in the security pass so a future
 * change cannot silently reopen them. For every guarded route it asserts:
 *   anonymous -> 401, wrong role -> 403, correct role -> 200
 * plus cross-patient isolation and doctor-relationship scoping.
 *
 * Runs against a server this file starts itself, on its own port. Accounts are
 * created through Supabase Auth and the tokens are genuine Supabase-issued ones,
 * so the real verification path is exercised rather than a hand-minted stand-in.
 *
 * It needs its OWN Supabase project. The suite creates and deletes real accounts
 * with service_role privileges, and there is no throwaway database file to
 * delete any more, so nothing stops it operating on live data except pointing it
 * somewhere else. It refuses to start unless every TEST_ variable is set:
 *
 *   TEST_DATABASE_URL              Postgres URI for the test project
 *   TEST_SUPABASE_URL              test project URL
 *   TEST_SUPABASE_ANON_KEY         test project anon key
 *   TEST_SUPABASE_SERVICE_ROLE_KEY test project service_role key
 *   TEST_SUPABASE_JWT_SECRET       test project JWT secret
 *
 *   npm test
 */
import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const PORT = Number(process.env.TEST_PORT) || 3799;
const BASE = `http://127.0.0.1:${PORT}`;

/**
 * The suite used to run against a throwaway SQLite file it deleted afterwards.
 * There is no such thing now — it creates and destroys real accounts in a real
 * Postgres database, so it needs its OWN Supabase project.
 *
 * TEST_DATABASE_URL deliberately does NOT fall back to DATABASE_URL. Falling
 * back would mean a bare `npm test` quietly ran the destructive setup against
 * whatever database happened to be configured, which for most developers is the
 * one with their actual data in it.
 */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
const TEST_SUPABASE_URL = process.env.TEST_SUPABASE_URL;
const TEST_SERVICE_ROLE_KEY = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY;
const TEST_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY;
const TEST_JWT_SECRET = process.env.TEST_SUPABASE_JWT_SECRET;

const missing = Object.entries({
  TEST_DATABASE_URL,
  TEST_SUPABASE_URL,
  TEST_SUPABASE_SERVICE_ROLE_KEY: TEST_SERVICE_ROLE_KEY,
  TEST_SUPABASE_ANON_KEY: TEST_ANON_KEY,
  TEST_SUPABASE_JWT_SECRET: TEST_JWT_SECRET
}).filter(([, v]) => !v).map(([k]) => k);

if (missing.length) {
  console.error(
    "[access-matrix] Cannot run. Missing: " + missing.join(", ") + " | " +
    "This suite creates and deletes real accounts, so point it at a Supabase " +
    "project kept for testing - never the one holding real data."
  );
  process.exit(1);
}

// service_role bypasses row-level security and can create confirmed accounts.
// Test-harness only; it must never reach the browser bundle.
const admin = createClient(TEST_SUPABASE_URL!, TEST_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const anon = createClient(TEST_SUPABASE_URL!, TEST_ANON_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const pool = new pg.Pool({
  connectionString: TEST_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/** Accounts this run created, torn down in after(). */
const createdUids: string[] = [];

let server: ChildProcessWithoutNullStreams;

interface Actor { uid: string; token: string; headers: Record<string, string>; }

const actors: Record<string, Actor> = {};
let linkedDoctorId = "";

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

/**
 * The server starts listening BEFORE it finishes seeding, so /api/health alone is not a
 * readiness signal: booking against doc-1 can 404 while the doctors table is still empty.
 * Wait for the seed data the suite depends on, not just for the socket.
 */
async function waitForHealth(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let healthy = false;
  while (Date.now() < deadline) {
    try {
      if (!healthy) {
        const res = await fetch(`${BASE}/api/health`);
        healthy = res.ok;
      }
      if (healthy) {
        const seeded = await fetch(`${BASE}/api/doctors`);
        if (seeded.ok) {
          const doctors = (await seeded.json()) as Array<{ id: string }>;
          if (doctors.some((d) => d.id === "doc-1")) return;
        }
      }
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Test server did not become ready (healthy + seeded) on ${BASE}`);
}

/** The fixed addresses this suite owns. `.invalid` is reserved by RFC 2606 and
 *  can never be a real mailbox, so nothing outside the suite can occupy them. */
const TEST_EMAILS = [
  "alice@test.invalid",
  "bob@test.invalid",
  "admin@test.invalid",
  "hospital@test.invalid",
  "dr.linked@test.invalid",
  "dr.unlinked@test.invalid"
];

/**
 * Remove every account this suite owns.
 *
 * Deliberately matches on the exact address list rather than a pattern like
 * "%@test.invalid" or "delete everything": a wildcard here runs with
 * service_role privileges against whatever database it was pointed at, and the
 * cost of that being the wrong one is unbounded.
 */
async function purgeTestAccounts(): Promise<void> {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`could not list users for cleanup: ${error.message}`);

  for (const user of data.users) {
    if (user.email && TEST_EMAILS.includes(user.email)) {
      await admin.auth.admin.deleteUser(user.id);
    }
  }
  createdUids.length = 0;
}

/** Write the doctor link straight into the test database, as the CLI would. */
async function linkDoctorInTestDb(uid: string, doctorId: string): Promise<void> {
  const res = await pool.query("UPDATE users SET doctorId = $1 WHERE uid = $2", [doctorId, uid]);
  if (res.rowCount !== 1) {
    throw new Error(`link-doctor affected ${res.rowCount} rows`);
  }
}

/**
 * Create a test account and return a usable session.
 *
 * There is no /api/auth/register to call any more, so this goes through the
 * three steps that replaced it:
 *
 *   1. Supabase Auth creates the account. email_confirm skips the verification
 *      mail — the suite has no inbox, and an unconfirmed account cannot sign in.
 *   2. The on_auth_user_created trigger creates the profile row. Nothing here
 *      inserts it: letting the trigger do it is what proves provisioning works.
 *   3. The role is set by direct UPDATE, because a client cannot choose its own
 *      role any more. That is the escalation guard the API enforces, so the
 *      suite has to go around it exactly as a real administrator would.
 *
 * The token is a genuine Supabase-issued one obtained by signing in, not a
 * hand-minted JWT, so these tests exercise the real verification path.
 */
async function register(email: string, name: string, role: string): Promise<Actor> {
  const password = "TestPassw0rd!x";

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });
  assert.ok(created.data.user, `createUser failed for ${email}: ${created.error?.message}`);
  const uid = created.data.user!.id;
  createdUids.push(uid);

  // The trigger fires inside the account's own transaction, but the REST call
  // can return a moment before it is visible. Give it a brief window.
  for (let i = 0; i < 25; i++) {
    const row = await pool.query("SELECT 1 FROM users WHERE uid = $1", [uid]);
    if (row.rowCount === 1) break;
    if (i === 24) throw new Error(`profile row was never created for ${email}`);
    await new Promise((r) => setTimeout(r, 200));
  }

  if (role !== "PATIENT") {
    const res = await pool.query("UPDATE users SET role = $1 WHERE uid = $2", [role, uid]);
    assert.equal(res.rowCount, 1, `could not set role ${role} for ${email}`);
  }

  const signedIn = await anon.auth.signInWithPassword({ email, password });
  assert.ok(signedIn.data.session, `sign-in failed for ${email}: ${signedIn.error?.message}`);
  const token = signedIn.data.session!.access_token;

  return { uid, token, headers: { Authorization: `Bearer ${token}` } };
}

before(async () => {
  // Clear any accounts a previous interrupted run left behind. Emails are fixed,
  // so a leftover row would collide on the unique constraint in createUser.
  await purgeTestAccounts();

  server = spawn("npx", ["tsx", "server.ts"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(PORT),
      DATABASE_URL: TEST_DATABASE_URL,
      SUPABASE_JWT_SECRET: TEST_JWT_SECRET,
      DEMO_MODE: "false",
      NODE_ENV: "development",
      API_ONLY: "true",
      DISABLE_HMR: "true"
    },
    shell: process.platform === "win32",
    // On POSIX the child is `npx` and the real `tsx server.ts` is a grandchild.
    // Its own process group lets stopServer() signal the whole tree at once.
    detached: process.platform !== "win32"
  });
  server.stdout.on("data", () => {});
  server.stderr.on("data", () => {});

  await waitForHealth();

  actors.alice = await register("alice@test.invalid", "Alice Patient", "PATIENT");
  actors.bob = await register("bob@test.invalid", "Bob Patient", "PATIENT");
  actors.admin = await register("admin@test.invalid", "Admin Tester", "ADMIN");
  actors.hospital = await register("hospital@test.invalid", "Hospital Desk", "HOSPITAL");
  actors.drLinked = await register("dr.linked@test.invalid", "Dr Linked", "DOCTOR");
  actors.drUnlinked = await register("dr.unlinked@test.invalid", "Dr Unlinked", "DOCTOR");

  // Bob books with doc-1, creating the clinical relationship the scoping depends on.
  const booked = await api("POST", "/api/appointments", actors.bob.token, {
    doctorId: "doc-1", patientName: "Bob Patient", symptoms: "test symptom"
  });
  assert.equal(booked.status, 200);
  linkedDoctorId = "doc-1";

  // Provision Dr Linked against doc-1 (normally the link-doctor CLI).
  // Open the TEST database explicitly. Importing ../database here would resolve
  // DB_PATH from this process's env, which is unset, and write to the real DB.
  await linkDoctorInTestDb(actors.drLinked.uid, linkedDoctorId);

  // Each patient uploads a private record.
  await api("POST", "/api/records", actors.bob.token, {
    title: "BOB PRIVATE record", doctorName: "Dr X", diagnoseSummary: "bob confidential"
  });
  await api("POST", "/api/records", actors.alice.token, {
    title: "ALICE PRIVATE record", doctorName: "Dr Y", diagnoseSummary: "alice confidential"
  });
});

/**
 * The real `tsx server.ts` is always a grandchild — of cmd.exe on win32, of npx
 * elsewhere — so signalling the direct child leaves it alive. That orphan kept the
 * test port and the SQLite file open, which hung the runner and made the NEXT run
 * fail in before() with EPERM on rmSync. Kill the whole tree on both platforms:
 * taskkill /t on win32, and the process group (negative pid) on POSIX, which is
 * why the child is spawned detached there.
 */
function stopServer(): void {
  if (!server?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {
      server.kill("SIGKILL"); // group already gone
    }
  }
}

after(async () => {
  stopServer();
  // Deleting the auth account cascades to the profile and everything keyed to
  // it — appointments, records, queue tokens, orders — so the clinical rows this
  // run created go with it. Deleting a database file used to do that job.
  await purgeTestAccounts();
  await pool.end();
});

// A failure between spawn and after() would otherwise leak the server too.
process.on("exit", stopServer);

// ---------------------------------------------------------------------------

describe("anonymous callers are rejected on every guarded route", () => {
  const guarded: Array<[string, string, unknown?]> = [
    ["GET", "/api/records"],
    ["POST", "/api/records", { title: "x", diagnoseSummary: "x" }],
    ["GET", "/api/appointments"],
    ["POST", "/api/appointments", { doctorId: "doc-1" }],
    ["GET", "/api/queue"],
    ["POST", "/api/queue/take", { doctorId: "doc-1" }],
    ["GET", "/api/medicines/orders"],
    ["POST", "/api/medicines/order", { items: [], totalAmount: 0 }],
    ["GET", "/api/emergency/alerts"],
    ["POST", "/api/emergency/sos", { type: "OTHER", patientPhone: "0" }],
    ["GET", "/api/users/someone"],
    ["PUT", "/api/users/someone", { name: "x" }],
    ["GET", "/api/chat/app-101"],
    ["POST", "/api/chat/app-101", { sender: "PATIENT", text: "hi" }],
    ["PUT", "/api/hospitals/hosp-1/beds", { availableBeds: 1, icuAvailable: 1, emergencyOccupancy: 1 }],
    ["POST", "/api/hospitals", { name: "x", address: "x", phone: "0" }],
    ["PUT", "/api/hospitals/hosp-1", { name: "x" }],
    ["POST", "/api/hospitals/hosp-1/doctors", { name: "x", specialty: "x" }],
    ["PUT", "/api/doctors/doc-1/online", { online: true }],
    ["PUT", "/api/appointments/app-101/status", { status: "ACCEPTED" }],
    ["POST", "/api/appointments/app-101/prescription", { diagnosis: "x", medicines: [] }],
    ["PUT", "/api/queue/tok-1/status", { status: "COMPLETED" }],
    ["PUT", "/api/emergency/alerts/sos-1/status", { status: "RESOLVED" }],
    ["POST", "/api/symptoms/check", { symptoms: "x" }],
    ["POST", "/api/records/analyze", { templateId: "blood_cbc" }],
    ["POST", "/api/medicines/guide", { name: "x" }],
    ["POST", "/api/diet/recommend", { condition: "x", preference: "Veg" }],
    ["POST", "/api/developer/ai-pipeline", { prompt: "x" }],
    ["POST", "/api/medicines/search-nationwide", { query: "x" }]
  ];

  for (const [method, route, body] of guarded) {
    test(`${method} ${route} -> 401`, async () => {
      const res = await api(method, route, undefined, body);
      assert.equal(res.status, 401, `expected 401, got ${res.status}`);
    });
  }
});

describe("public routes remain reachable without a session", () => {
  for (const route of ["/api/health", "/api/hospitals", "/api/doctors", "/api/medicines"]) {
    test(`GET ${route} -> 200`, async () => {
      const res = await api("GET", route);
      assert.equal(res.status, 200);
    });
  }
});

describe("forged and malformed tokens are rejected", () => {
  test("garbage token -> 401", async () => {
    assert.equal((await api("GET", "/api/records", "not.a.jwt")).status, 401);
  });

  test("token signed with the old hardcoded secret -> 401", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const forged = jwt.sign(
      { uid: "attacker", email: "a@b.c", role: "ADMIN" },
      "city-healer-dev-only-secret",
      { expiresIn: "7d" }
    );
    assert.equal((await api("GET", "/api/records", forged)).status, 401);
  });

  test("expired token -> 401", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const expired = jwt.sign(
      { uid: actors.admin.uid, email: "admin@test.invalid", role: "ADMIN" },
      TEST_JWT_SECRET,
      { expiresIn: -60 }
    );
    assert.equal((await api("GET", "/api/records", expired)).status, 401);
  });

  test("validly signed token for a uid that does not exist -> 401", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const ghost = jwt.sign(
      { uid: "no-such-user", email: "ghost@test.invalid", role: "ADMIN" },
      TEST_JWT_SECRET,
      { expiresIn: "7d" }
    );
    assert.equal((await api("GET", "/api/records", ghost)).status, 401);
  });
});

describe("PATIENT is refused privileged operations", () => {
  const forbidden: Array<[string, string, unknown?]> = [
    ["GET", "/api/emergency/alerts"],
    ["PUT", "/api/hospitals/hosp-1/beds", { availableBeds: 1, icuAvailable: 1, emergencyOccupancy: 1 }],
    ["POST", "/api/hospitals", { name: "x", address: "x", phone: "0" }],
    ["PUT", "/api/hospitals/hosp-1", { name: "x" }],
    ["POST", "/api/hospitals/hosp-1/doctors", { name: "x", specialty: "x" }],
    ["PUT", "/api/doctors/doc-1/online", { online: true }],
    ["PUT", "/api/appointments/app-101/status", { status: "ACCEPTED" }],
    ["POST", "/api/appointments/app-101/prescription", { diagnosis: "x", medicines: [] }],
    ["PUT", "/api/queue/tok-1/status", { status: "COMPLETED" }],
    ["PUT", "/api/emergency/alerts/sos-1/status", { status: "RESOLVED" }]
  ];

  for (const [method, route, body] of forbidden) {
    test(`${method} ${route} -> 403`, async () => {
      const res = await api(method, route, actors.alice.token, body);
      assert.equal(res.status, 403, `expected 403, got ${res.status}`);
    });
  }

  test("cannot read another user's profile -> 403", async () => {
    assert.equal((await api("GET", `/api/users/${actors.bob.uid}`, actors.alice.token)).status, 403);
  });

  test("cannot write another user's profile -> 403", async () => {
    const res = await api("PUT", `/api/users/${actors.bob.uid}`, actors.alice.token, { name: "hacked" });
    assert.equal(res.status, 403);
  });

  test("cannot escalate own role -> 403 and role is unchanged", async () => {
    const res = await api("PUT", `/api/users/${actors.alice.uid}`, actors.alice.token, { role: "ADMIN" });
    assert.equal(res.status, 403);
    const check = await api("GET", `/api/users/${actors.alice.uid}`, actors.admin.token);
    assert.equal(check.body.role, "PATIENT");
  });
});

describe("PATIENT is allowed their own operations", () => {
  test("reads own profile -> 200", async () => {
    assert.equal((await api("GET", `/api/users/${actors.alice.uid}`, actors.alice.token)).status, 200);
  });
  test("updates own non-role fields -> 200", async () => {
    const res = await api("PUT", `/api/users/${actors.alice.uid}`, actors.alice.token, { name: "Alice Renamed" });
    assert.equal(res.status, 200);
  });
  test("reads own records -> 200", async () => {
    assert.equal((await api("GET", "/api/records", actors.alice.token)).status, 200);
  });
});

describe("cross-patient isolation", () => {
  test("Alice sees none of Bob's records", async () => {
    const res = await api("GET", "/api/records", actors.alice.token);
    assert.equal(res.status, 200);
    const titles = (res.body as any[]).map((r) => r.title);
    assert.ok(!titles.some((t) => t.includes("BOB PRIVATE")), `leaked: ${titles.join(", ")}`);
  });

  test("Bob sees his own record and not Alice's", async () => {
    const res = await api("GET", "/api/records", actors.bob.token);
    const titles = (res.body as any[]).map((r) => r.title);
    assert.ok(titles.some((t) => t.includes("BOB PRIVATE")));
    assert.ok(!titles.some((t) => t.includes("ALICE PRIVATE")));
  });

  test("Alice sees only her own appointments", async () => {
    const res = await api("GET", "/api/appointments", actors.alice.token);
    assert.ok((res.body as any[]).every((a) => a.patientId === actors.alice.uid));
  });

  test("Alice cannot read a consultation she is not party to -> 403", async () => {
    const bobAppts = await api("GET", "/api/appointments", actors.bob.token);
    const id = (bobAppts.body as any[])[0].id;
    assert.equal((await api("GET", `/api/chat/${id}`, actors.alice.token)).status, 403);
  });
});

describe("doctor scoping follows the clinical relationship", () => {
  test("unlinked doctor sees zero records", async () => {
    const res = await api("GET", "/api/records", actors.drUnlinked.token);
    assert.equal(res.status, 200);
    assert.equal((res.body as any[]).length, 0);
  });

  test("unlinked doctor sees zero appointments", async () => {
    const res = await api("GET", "/api/appointments", actors.drUnlinked.token);
    assert.equal((res.body as any[]).length, 0);
  });

  test("linked doctor sees his patient's record but not an unrelated patient's", async () => {
    const res = await api("GET", "/api/records", actors.drLinked.token);
    const titles = (res.body as any[]).map((r) => r.title);
    assert.ok(titles.some((t) => t.includes("BOB PRIVATE")), "should see linked patient");
    assert.ok(!titles.some((t) => t.includes("ALICE PRIVATE")), "must not see unrelated patient");
  });

  test("linked doctor only sees his own appointments", async () => {
    const res = await api("GET", "/api/appointments", actors.drLinked.token);
    assert.ok((res.body as any[]).every((a) => a.doctorId === linkedDoctorId));
  });
});

describe("privileged roles retain access", () => {
  test("HOSPITAL may write the bed census -> 200", async () => {
    const res = await api("PUT", "/api/hospitals/hosp-1/beds", actors.hospital.token, {
      availableBeds: 100, icuAvailable: 10, emergencyOccupancy: 50
    });
    assert.equal(res.status, 200);
  });
  test("HOSPITAL may read the dispatch stream -> 200", async () => {
    assert.equal((await api("GET", "/api/emergency/alerts", actors.hospital.token)).status, 200);
  });
  test("ADMIN may read all records -> 200", async () => {
    assert.equal((await api("GET", "/api/records", actors.admin.token)).status, 200);
  });
  test("ADMIN may change another user's role -> 200", async () => {
    const res = await api("PUT", `/api/users/${actors.bob.uid}`, actors.admin.token, { role: "PATIENT" });
    assert.equal(res.status, 200);
  });
});

describe("AI endpoints are metered per user", () => {
  test("quota returns 429 once exceeded, and the limit is per-account", async () => {
    const limit = Number(process.env.AI_RATE_LIMIT) || 30;
    let sawTooMany = false;
    for (let i = 0; i < limit + 5; i++) {
      const res = await api("POST", "/api/diet/recommend", actors.alice.token, {
        condition: "Diabetes", preference: "Veg"
      });
      if (res.status === 429) { sawTooMany = true; break; }
    }
    assert.ok(sawTooMany, `expected a 429 within ${limit + 5} calls`);

    // A different account still has its own budget.
    const other = await api("POST", "/api/diet/recommend", actors.bob.token, {
      condition: "Diabetes", preference: "Veg"
    });
    assert.equal(other.status, 200, "quota must be per-user, not global");
  });
});
