import * as v from "valibot";

const DbEnvSchema = v.object({
  DATABASE_URL: v.pipe(
    v.string("DATABASE_URL is required"),
    v.minLength(1, "DATABASE_URL is required"),
    v.startsWith("postgres", "DATABASE_URL must be a postgres:// connection string"),
  ),
});

export type DbEnv = v.InferOutput<typeof DbEnvSchema>;

/**
 * Parse and validate the database environment, failing fast with a clear
 * message. Pure (takes the source) so it's testable; the live call in
 * `index.ts` passes `process.env`.
 */
export function parseDbEnv(source: Record<string, string | undefined>): DbEnv {
  const result = v.safeParse(DbEnvSchema, source);
  if (!result.success) {
    const problems = Object.entries(v.flatten<typeof DbEnvSchema>(result.issues).nested ?? {})
      .map(([key, messages]) => `  - ${key}: ${messages?.join(", ")}`)
      .join("\n");
    throw new Error(
      `Invalid database environment:\n${problems}\n\nCopy apps/web/.env.example to apps/web/.env and fill it in.`,
    );
  }
  return result.output;
}
