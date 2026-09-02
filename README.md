# SwasthAI

Healthcare platform for the Delhi NCR region — patient records, doctor booking,
OPD queues, pharmacy orders and emergency dispatch, with an Express + SQLite
backend and a React front end served by Vite.

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create `.env.local`**

The file is gitignored, so each developer keeps their own. It is loaded on
startup by `env.ts`, ahead of every other import.

```bash
JWT_SECRET=<paste the generated value>
GEMINI_API_KEY=<optional — see below>
```

**`JWT_SECRET` — set this, or your logins will not survive a restart.**
It signs and verifies session tokens. When it is missing, the server generates a
random secret for that process only and every existing session is invalidated
the next time you restart — you are silently signed out. It must be at least 32
characters; the server refuses to start below that, and refuses to start at all
in production if it is unset.

Generate one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Treat it as a credential: anyone holding it can mint a token for any role,
including ADMIN. Never commit it — `.gitignore` covers `.env*`, with an
exception only for `.env.example`.

**`GEMINI_API_KEY` — optional.** Used server-side only, never sent to the
browser. Without it the AI endpoints (symptom triage, report analysis,
medication guide, diet plans) return their canned fallback responses rather
than failing.

`.env.example` documents every supported variable, including `DB_PATH`,
`DEMO_MODE`, `PORT` and `API_ONLY`.

**3. Run the app**

```bash
npm run dev
```

Serves on http://localhost:3000. The SQLite database is created and seeded on
first boot (52 hospitals, 80 doctors, 31 medicines).

You should see `injected env (1) from .env.local` in the startup log. If you
instead see `[Security] JWT_SECRET not set`, the variable has not been picked
up and sessions will not persist.

## Tests

```bash
npm test
```

Runs the access-matrix suite: for every guarded route it asserts anonymous →
401, wrong role → 403, correct role → 200, plus cross-patient isolation, doctor
relationship scoping and AI rate limiting. It starts its own server on port 3799
against a throwaway database and never touches `city_healer.db`.

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
