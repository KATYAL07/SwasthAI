/**
 * Supabase Postgres is the only data store.
 *
 * DATABASE_URL must point at the project's Postgres (Supabase -> Project
 * Settings -> Database -> Connection string -> URI). The schema comes from
 * supabase/schema.sql, applied once through the Supabase SQL editor; boot only
 * verifies it and seeds the reference tables if they are empty.
 */
import "./env";
import { createPostgresBackend } from "./db/postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "[FATAL] DATABASE_URL is not set. Copy the connection string from " +
    "Supabase -> Project Settings -> Database -> Connection string -> URI into " +
    ".env.local. Refusing to start without the database."
  );
  process.exit(1);
}

const db = createPostgresBackend(connectionString);

export const DB_KIND = db.kind;
export const DB_LOCATION = db.location;
export const dbRun = db.dbRun;
export const dbGet = db.dbGet;
export const dbAll = db.dbAll;
export const dbExec = db.dbExec;
export const initializeDatabase = db.initializeDatabase;
export const closeDatabase = db.close;
