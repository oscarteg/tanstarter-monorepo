# @repo/notes — example feature module

A self-contained feature module and the reference for building your own. It owns
its **routes, UI, and data access** and is turned on from the app's module
registry. Copy it, rename it, adapt it — or delete it.

## Anatomy

| File             | Responsibility                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/schema.ts`  | Drizzle table(s), user-owned, referencing the core `user` from `@repo/db/schema`. Picked up by drizzle-kit via the `../*/src/schema.ts` glob. |
| `src/data.ts`    | Queries/commands via the shared `db` client from `@repo/db` (the single DB entry point).                                                      |
| `src/server.ts`  | TanStack Start server functions, guarded by `authMiddleware` (injects `context.user`) and validated with Valibot.                             |
| `src/ui/*`       | Screens built from `@repo/ui` (Rams components).                                                                                              |
| `src/routes.tsx` | Route factory `(parent) => Route[]`, mounted under `/app`.                                                                                    |
| `src/index.tsx`  | The single entry point: exports the module object (`id`, `title`, `enabled`, `nav`, `routes`).                                                |

## Enable / disable

Register in `apps/web/src/modules/registry.ts`:

```ts
import { notesModule } from "@repo/notes";
export const modules = [notesModule];
```

Set `enabled: false` in `src/index.tsx` (or remove the registry entry) to strip
the module's routes **and** its sidebar nav.

## Start a new module

1. Copy this package to `packages/<your-module>` and rename it in `package.json`.
2. Replace `schema.ts` / `data.ts` with your tables and queries.
3. Rebuild the screens in `src/ui` and the routes in `src/routes.tsx`.
4. Export your module from `src/index.tsx` and add it to the registry.
5. Run the DB generate command to produce a migration for your new tables.

## Migrations

The table lives in `src/schema.ts`; run drizzle-kit generate (from `@repo/db`)
to emit the migration — the glob already includes this file, so no central edit
is needed.
