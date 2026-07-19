# Feature modules

A **module** is a self-contained feature: its own tables, data access, server
functions, and UI, shipped as a workspace package and switched on from one
registry. `@repo/notes` is the worked example — copy it, or delete it.

## The split: modules own features, the app owns routing

A module exports UI and a description of itself. It does **not** export routes.

Each module is mounted by a thin file under `apps/web/src/routes/_auth/app/`,
so its route stays part of TanStack Start's generated, type-safe route tree.
Assembling the tree by hand instead produces an invalid tree at runtime —
`createRouter` throws on malformed segments. The mount file is small enough that
this costs almost nothing:

```tsx
// apps/web/src/routes/_auth/app/notes.tsx
import { notesModule, NotesScreen } from "@repo/notes";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/notes")({
  beforeLoad: () => {
    if (!notesModule.enabled) {
      throw notFound();
    }
  },
  component: NotesScreen,
});
```

## Anatomy

| File            | Responsibility                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/schema.ts` | Drizzle tables, user-owned, referencing the core `user` from `@repo/db/schema`. Found by Drizzle Kit's glob. |
| `src/data.ts`   | Queries and commands against the shared `db` client from `@repo/db`.                                         |
| `src/server.ts` | TanStack Start server functions, guarded with `authMiddleware`, inputs validated with Valibot.               |
| `src/ui/*`      | Screens composed from `@repo/ui`.                                                                            |
| `src/index.tsx` | The single entry point: re-exports the screen(s) and the module object.                                      |

## The module object

```ts
// packages/notes/src/index.tsx
export const notesModule = {
  id: "notes",
  title: "Notes",
  enabled: true,
  nav: [{ title: "Notes", url: "/app/notes", icon: NotebookPenIcon }],
};
```

The shape is `AppModule` in [`apps/web/src/modules/types.ts`](../apps/web/src/modules/types.ts),
which also exports a `defineModule()` identity helper if you want inference and a
single call site.

| Field     | Meaning                                            |
| --------- | -------------------------------------------------- |
| `id`      | Stable key, e.g. `"notes"`.                        |
| `title`   | Human-readable name.                               |
| `enabled` | The on/off switch.                                 |
| `nav`     | Sidebar entries this module contributes. Optional. |

## The registry

One file decides what exists:

```ts
// apps/web/src/modules/registry.ts
import { notesModule } from "@repo/notes";

export const modules: AppModule[] = [notesModule];
export const enabledModules = modules.filter((module) => module.enabled);
```

`enabled` is a single switch with two effects: the registry drops disabled
modules from the sidebar nav, and the mount file 404s their route. A disabled
module contributes neither navigation nor a reachable page — no half-off state
where a nav item leads to a broken screen.

## Building a new module

1. Copy `packages/notes` to `packages/<your-module>`, rename it in `package.json`.
2. Add it to `apps/web/package.json` as a `workspace:*` dependency, then `vp install`.
3. Replace `schema.ts` and `data.ts` with your tables and queries.
4. Rebuild the screens in `src/ui`.
5. Export your module object from `src/index.tsx`.
6. Add a mount file at `apps/web/src/routes/_auth/app/<your-module>.tsx`.
7. Register it in `apps/web/src/modules/registry.ts`.
8. Generate and apply the migration for your new tables:

   ```sh
   vpr db generate
   vpr db migrate
   ```

No central schema edit is needed in step 8 — Drizzle Kit's glob already covers
`packages/*/src/schema.ts`.

## Removing the example

`@repo/notes` is demo content. To strip it:

- Delete `packages/notes/`
- Delete `apps/web/src/routes/_auth/app/notes.tsx`
- Remove the entry from `apps/web/src/modules/registry.ts`
- Remove `"@repo/notes"` from `apps/web/package.json`, then `vp install`
- Drop its table in a new migration (`vpr db generate`)

The registry, the `AppModule` type, and `defineModule` stay — they're the
pattern, not the example.
