/**
 * The contract the data layer satisfies.
 *
 * The ~75 call sites in server.ts are written against these helpers using `?`
 * placeholders; the Postgres implementation translates placeholders and
 * identifier case internally, so the API code never writes dialect-specific SQL.
 */
export interface DatabaseBackend {
  kind: "postgres";
  /** Human-readable location, for the boot log only. */
  location: string;
  dbRun(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }>;
  dbGet<T = any>(sql: string, params?: any[]): Promise<T | null>;
  dbAll<T = any>(sql: string, params?: any[]): Promise<T[]>;
  /** Multi-statement / DDL execution. No placeholder translation. */
  dbExec(sql: string): Promise<void>;
  /** Create or verify the schema, then seed reference data if the tables are empty. */
  initializeDatabase(): Promise<void>;
  /** Release the file handle or connection pool. Scripts call this before exiting. */
  close(): Promise<void>;
}
