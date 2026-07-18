import { describe, expect, it } from "vite-plus/test";

import { parseDbEnv } from "./env";

describe("parseDbEnv", () => {
  it("returns the typed env for a valid postgres URL", () => {
    const env = parseDbEnv({ DATABASE_URL: "postgres://user:pass@localhost:5432/db" });
    expect(env.DATABASE_URL).toBe("postgres://user:pass@localhost:5432/db");
  });

  it("throws a helpful error naming DATABASE_URL when it is missing", () => {
    expect(() => parseDbEnv({})).toThrow(/DATABASE_URL/);
  });

  it("throws when DATABASE_URL is not a postgres connection string", () => {
    expect(() => parseDbEnv({ DATABASE_URL: "mysql://localhost/db" })).toThrow(/postgres/);
  });
});
