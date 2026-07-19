# @repo/db

The Drizzle client, the schema, and environment validation. **The single
database entry point** — nothing else in the repo constructs a connection.

## Exports

```ts
import { db } from "@repo/db"; // the client
import { user } from "@repo/db/schema"; // tables and relations
```

`src/index.ts` is marked `"@tanstack/react-start/server-only"`, so importing the
client from browser code fails the build instead of leaking a connection string.

## Environment

`parseDbEnv` (`src/env.ts`) validates `DATABASE_URL` with Valibot before the
client is built: it must be present and start with `postgres`. A bad value fails
at boot with a message pointing at `.env.example`, rather than surfacing as a
connection error mid-request.

It takes its source as an argument rather than reading `process.env` itself,
which is what makes it testable; the live call in `index.ts` passes
`process.env`.

## Schema

| File                        | What it is                                                  |
| --------------------------- | ----------------------------------------------------------- |
| `src/schema/auth.schema.ts` | **Generated** from the Better Auth config. Don't hand-edit. |
| `src/schema/relations.ts`   | The main relations.                                         |
| `src/schema/index.ts`       | The barrel.                                                 |

`authRelations` uses `defineRelationsPart`, so it must be spread **after** the
main relations in the `drizzle()` call — see the comment in `src/index.ts`.

Feature modules keep their tables in their own package (`packages/*/src/schema.ts`).
Drizzle Kit's glob picks them up, so adding a module requires no edit here.

## Commands

```sh
vpr db generate     # diff the schema, write a migration
vpr db migrate      # apply pending migrations
vpr db studio       # browse the data
vpr auth:generate   # regenerate auth.schema.ts from packages/auth/src/auth.ts
```

`vpr db` is Drizzle Kit — any of its subcommands work.
