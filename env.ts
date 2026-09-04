/**
 * Local environment loading, kept in its own module so it runs FIRST.
 *
 * ES module imports are evaluated before the importing module's body, so calling
 * dotenv.config() inside server.ts would run after ./database had already read
 * process.env.DB_PATH at its own module scope — silently ignoring anything set for it.
 * Importing this module ahead of the others guarantees the variables are in place
 * before any of them look.
 *
 *   .env.local  developer secrets, gitignored, wins over .env
 *   .env        optional shared defaults
 *
 * Neither overrides a variable the host already set, so deployed environments
 * (Railway, Vercel, Docker) keep using their own configuration.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();
