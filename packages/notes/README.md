# @repo/notes — example feature module

A self-contained feature module and the reference for building your own. It owns
its **UI, data access, and server functions**, and is turned on from the app's
module registry. Copy it, rename it, adapt it — or delete it.

The full pattern is documented in [`docs/modules.md`](../../docs/modules.md).
This file covers what's in the package.

## Anatomy

| File                      | Responsibility                                                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/schema.ts`           | Drizzle table(s), user-owned, referencing the core `user` from `@repo/db/schema`. Picked up by Drizzle Kit via the `packages/*/src/schema.ts` glob. |
| `src/data.ts`             | Queries/commands via the shared `db` client from `@repo/db` (the single DB entry point).                                                            |
| `src/server.ts`           | TanStack Start server functions, guarded by `authMiddleware` (injects `context.user`) and validated with Valibot.                                   |
| `src/ui/notes-screen.tsx` | The screen, built from `@repo/ui` (Rams components).                                                                                                |
| `src/index.tsx`           | The single entry point: re-exports `NotesScreen` and the module object (`id`, `title`, `enabled`, `nav`).                                           |

Routing is **not** here. Modules own features; the app owns routes. This module
is mounted by a thin route file at
[`apps/web/src/routes/_auth/app/notes.tsx`](../../apps/web/src/routes/_auth/app/notes.tsx),
which keeps the route inside TanStack Start's generated, type-safe route tree.

## Enable / disable

Register in `apps/web/src/modules/registry.ts`:

```ts
import { notesModule } from "@repo/notes";
export const modules = [notesModule];
```

Set `enabled: false` in `src/index.tsx` (or remove the registry entry) to strip
the module's route **and** its sidebar nav: the mount file 404s, and the registry
filters the nav entry out.

## Migrations

The table lives in `src/schema.ts`; run `vpr db generate` (then `vpr db migrate`)
to emit and apply the migration — the glob already includes this file, so no
central edit is needed.
