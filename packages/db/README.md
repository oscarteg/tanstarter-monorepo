# @repo/db — the single database entry point

Every package in this monorepo reaches the database through `@repo/db`. There is
exactly **one** connection and **one** client.

## Exports

- `@repo/db` → the `db` client (Drizzle over a single `postgres` connection).
  This is the only place a connection is opened.
- `@repo/db/schema` → the core / shared schema (Better Auth tables, etc.).

## Rule: one connection

Never call `postgres()` / `drizzle()` anywhere else. Modules and apps import `db`
from `@repo/db` and run queries against their own table objects.

## Per-module data access

A feature module (a package under `packages/`) owns its data:

- `packages/<module>/src/schema.ts` — the module's Drizzle tables. User-owned
  rows reference the core user table:

  ```ts
  import { user } from "@repo/db/schema";
  import { nanoid } from "nanoid";
  import { pgTable, text } from "drizzle-orm/pg-core";

  export const note = pgTable("note", {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // ...
  });
  ```

- `packages/<module>/src/data.ts` — queries/commands via the shared client:

  ```ts
  import { db } from "@repo/db";
  import { eq } from "drizzle-orm";
  import { note } from "./schema";

  export function listNotes(userId: string) {
    return db.select().from(note).where(eq(note.userId, userId));
  }
  ```

Modules use the explicit query builder (`db.select()/insert()/update()/delete()`).
The relational query API (`db.query.*`) is reserved for the core schema, since
registering module relations on the client would require `@repo/db` to import
modules — a dependency cycle. Modules depend on `@repo/db`, never the reverse.

## Migrations

`drizzle.config.ts` globs `./src/schema/index.ts` + `../*/src/schema.ts`, so
generating migrations sees the core schema **and** every module's tables. Add a
module → add its `src/schema.ts` → it is included automatically. No central
registration edit required.
