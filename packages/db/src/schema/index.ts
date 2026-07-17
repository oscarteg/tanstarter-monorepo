// Core / shared schema only. Feature modules define their own tables in
// packages/<module>/src/schema.ts (picked up by drizzle.config.ts) and must NOT
// be re-exported here — @repo/db never imports modules. See README.md.
export * from "./auth.schema";
