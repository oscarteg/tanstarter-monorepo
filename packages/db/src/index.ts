import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { parseDbEnv } from "./env";
import { authRelations } from "./schema/auth.schema";
import { relations } from "./schema/relations";

const { DATABASE_URL } = parseDbEnv(process.env);
const client = postgres(DATABASE_URL);

export const db = drizzle({
  client,
  // authRelations uses defineRelationsPart,
  // so it must come after the main relations.
  // https://orm.drizzle.team/docs/relations-v2#relations-parts
  relations: { ...relations, ...authRelations },
});
