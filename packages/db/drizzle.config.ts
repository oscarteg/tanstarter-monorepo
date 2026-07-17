import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import type { Config } from "drizzle-kit";

// Load .env from /apps/web for local dev. In containers/CI the vars come from
// the environment, so only load the file when it actually exists.
const localEnv = "../../apps/web/.env";
if (existsSync(localEnv)) {
  loadEnvFile(localEnv);
}

export default {
  out: "./migrations",
  // Core schema + every module's `src/schema.ts`. A module package contributes
  // tables simply by exporting Drizzle tables from `src/schema.ts`; drizzle-kit
  // picks them up here so migrations cover the whole workspace. Modules depend
  // on @repo/db (never the reverse), so aggregation lives in this glob, not in
  // an import.
  schema: ["./src/schema/index.ts", "../*/src/schema.ts"],
  breakpoints: true,
  verbose: true,
  strict: true,

  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
