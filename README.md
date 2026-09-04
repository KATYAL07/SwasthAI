# SwasthAI

Healthcare platform for the Delhi NCR region — patient records, doctor booking,
OPD queues, pharmacy orders and emergency dispatch, with an Express
backend and a React front end served by Vite. Authentication and the database
are Supabase: Supabase Auth owns credentials and sessions, and the API talks to
Supabase Postgres.

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create a Supabase project and apply the schema**

At [supabase.com](https://supabase.com), then in the dashboard under
**SQL Editor -> New query**, run the contents of `supabase/schema.sql`. It
creates the ten tables, the trigger that provisions a profile for every new
account, and row-level-security policies.

**3. Create `.env.local`**

Gitignored, so each developer keeps their own. Loaded by `env.ts` ahead of every
other import.

```bash
SUPABASE_JWT_SECRET=   # Settings -> API -> JWT Settings -> JWT Secret
DATABASE_URL=          # Settings -> Database -> Connection string -> URI
VITE_SUPABASE_URL=     # Settings -> API
VITE_SUPABASE_ANON_KEY=# Settings -> API
GEMINI_API_KEY=        # optional, see below
```

**`SUPABASE_JWT_SECRET` is a verification key, not one you invent.** This server
no longer issues tokens — Supabase does — so it must be the project's own
secret. There is no fallback: without it every request fails 401, and the server
refuses to start rather than pretend otherwise.

**Never put the `service_role` key in a `VITE_` variable.** Anything prefixed
`VITE_` is compiled into the browser bundle. The anon key is designed for that;
`service_role` bypasses row-level security entirely.

**`GEMINI_API_KEY` — optional.** Used server-side only, never sent to the
browser. Without it the AI endpoints (symptom triage, report analysis,
medication guide, diet plans) return canned fallback responses rather than
failing.

`.env.example` documents every supported variable.

**4. Run the app**

```bash
npm run dev
```

Serves on http://localhost:3000. Hospitals, doctors and medicines (52 / 80 / 31)
are seeded on first boot if those tables are empty.

## Running locally without a Supabase project

The API and its authorization rules can be exercised against any Postgres, with
no Docker and no cloud project. Apply `supabase/local-test-shim.sql` first — it
supplies the `auth` schema that `schema.sql` depends on and a hosted project
would provide — then `schema.sql`, then:

```bash
npm run smoke
```

This starts the real server and checks the driver round trip, the provisioning
trigger, token verification, the profile routes and cross-patient isolation.
It does not cover Supabase Auth itself — sign-up, password policy, email
confirmation and refresh are Supabase's own code and need a real project.

## Tests

```bash
npm test
```

The access-matrix suite: for every guarded route it asserts anonymous -> 401,
wrong role -> 403, correct role -> 200, plus cross-patient isolation, doctor
relationship scoping and AI rate limiting.

It needs **its own Supabase project** — it creates and deletes real accounts
through the Auth admin API, and there is no throwaway database file to delete
any more. It refuses to start unless every `TEST_` variable is set, and
`TEST_DATABASE_URL` deliberately does not fall back to `DATABASE_URL`:

```bash
TEST_DATABASE_URL= TEST_SUPABASE_URL= TEST_SUPABASE_ANON_KEY= TEST_SUPABASE_SERVICE_ROLE_KEY= TEST_SUPABASE_JWT_SECRET= npm test
```

## Migrating an existing SQLite database

```bash
npm run migrate:supabase -- --db city_healer.db          # dry run
npm run migrate:supabase -- --db city_healer.db --commit
```

Dry run is the default. Passwords do not migrate: Supabase Auth owns
credentials, so migrated accounts are reachable only through a password reset.

## Doctor accounts

A newly registered `DOCTOR` account is **inert until it is linked** to a doctor
record — until then `/api/appointments` and `/api/queue` return nothing and the
clinician sees an empty workspace. There is no UI for this yet; use the CLI:

```bash
npm run link-doctor -- --list
npm run link-doctor -- --uid <user-uid> --doctorId doc-1
```

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server (API + Vite middleware) |
| `npm run build` | Build the client and bundle the server to `dist/` |
| `npm start` | Run the built server |
| `npm test` | Access-matrix regression suite |
| `npm run lint` | `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and the built server |
| `npm run link-doctor` | Link a DOCTOR account to a doctor record |
| `npm run smoke` | Local end-to-end check against any Postgres |
| `npm run migrate:supabase` | Migrate a SQLite database into Supabase |
