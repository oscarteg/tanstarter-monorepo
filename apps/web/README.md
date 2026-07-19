# @repo/web

The product: [TanStack Start](https://tanstack.com/start/latest) + React 19,
served by Nitro as a **Node SSR server**. It needs a process and a Postgres
database — this is not a static build.

```sh
vpr dev:web      # dev server on :3000
vpr build:web    # production build into .output/
node .output/server/index.mjs   # what the Docker image runs
```

## Layout

```
src/
├── routes/          # file-based routes (see below)
├── modules/         # the feature-module registry + AppModule type
├── components/      # app-level components (sidebar, command menu, theme toggle)
├── config/          # navigation and auth config
├── lib/             # sentry, posthog, command items — each with a *.test.ts
├── stores/          # Zustand stores for client-only UI state
└── mocks/           # MSW handlers for tests
```

## Routes

| Path               | What it is                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `__root.tsx`       | Root shell: providers, devtools, error and not-found boundaries.                                                                         |
| `index.tsx`        | Public landing route.                                                                                                                    |
| `_auth/route.tsx`  | Protected layout. `beforeLoad` requires a user or redirects to `/login`, and returns `{ user }` into the context for every child loader. |
| `_auth/app/*`      | The signed-in app. `route.tsx` is the shell (sidebar); `notes.tsx` mounts the notes module.                                              |
| `_guest/route.tsx` | Guest-only layout. Redirects authenticated users to `/app` and wraps login/signup in a centred card.                                     |
| `api/auth/$.ts`    | Better Auth's catch-all handler.                                                                                                         |

Route guards are a UX concern — they decide what renders during client
navigation. Anything that touches data guards itself with `authMiddleware`. See
[`docs/architecture.md`](../../docs/architecture.md#routing-and-auth-flow).

`routeTree.gen.ts` is generated. Don't edit it.

## Modules

Features live in their own packages and are switched on in
`src/modules/registry.ts`; each is mounted by a thin route file under
`routes/_auth/app/`. The `enabled` flag strips both the route and the sidebar
nav. Full pattern: [`docs/modules.md`](../../docs/modules.md).

## State

- **Server state** — TanStack Query. Auth reuses the single `["auth"]` query from
  `@repo/auth/tanstack/queries`, so hooks and route guards share one request.
- **Client state** — Zustand, in `src/stores/`, for UI-only concerns. Syncing
  server data into a store means it belonged in a query.

## Tests

Vitest, colocated as `*.test.ts`. HTTP is stubbed with MSW (`src/mocks/`).
End-to-end coverage lives in the repo-root [`e2e/`](../../e2e/) directory and
runs against a real SSR server.

```sh
vpr test
```
