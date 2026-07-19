# Architecture

How the monorepo fits together, and why it's shaped this way.

## The two apps

| App              | What it is                                               | Runtime                                                     |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| `apps/web`       | The product. TanStack Start + React 19.                  | Nitro **Node SSR server** — needs a process and a database. |
| `apps/marketing` | The public site: landing page, `/privacy`, `404`. Astro. | Static HTML. No server, no database.                        |

They are deliberately separate. The marketing site must stay cheap and fast to
serve, and it has no reason to know about auth or Postgres. They share a design
language (Rams Document) but not code: `apps/marketing` re-authors its sections
as `.astro` components rather than importing `@repo/ui`, because pulling React
into a static site to render a hero is a bad trade.

## Packages

```
apps/web ──┬──> @repo/notes ──┬──> @repo/auth ──┬──> @repo/db
           │                  ├──> @repo/db     └──> @repo/email
           ├──> @repo/auth    └──> @repo/ui
           ├──> @repo/db
           └──> @repo/ui
```

| Package          | Owns                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/db`       | The Drizzle client, the schema, and environment validation. The single database entry point.                                    |
| `@repo/auth`     | Better Auth config, the auth client, and the TanStack integration (middleware, queries, hooks, server functions).               |
| `@repo/email`    | The single outbound-email entry point. Transport is chosen from the environment — console in development, Resend in production. |
| `@repo/ui`       | shadcn/ui + Base UI primitives, the Rams components, theme provider, styles. A leaf — it depends on nothing in the repo.        |
| `@repo/notes`    | An **example feature module**. Not infrastructure — a worked reference you copy or delete. See [modules.md](./modules.md).      |
| `@repo/tsconfig` | Shared TypeScript config, under `tooling/`.                                                                                     |

Dependencies point one way: apps depend on modules, modules depend on
infrastructure (`auth`, `db`, `ui`), and `ui` depends on nothing. Nothing in
`packages/` imports from `apps/`.

Versions are shared through the pnpm [catalog](https://pnpm.io/catalogs) in
`pnpm-workspace.yaml` — packages declare `"react": "catalog:"`, never a literal
version, so every workspace resolves the same React.

## The database entry point

`packages/db/src/index.ts` constructs one `db` client and exports it. It is
marked `"@tanstack/react-start/server-only"`, so importing it from client code
is a build error rather than a leaked connection string.

Environment is parsed before the client is built:

```ts
const { DATABASE_URL } = parseDbEnv(process.env);
```

`parseDbEnv` ([`packages/db/src/env.ts`](../packages/db/src/env.ts)) is a Valibot
schema that requires `DATABASE_URL` to be present and to start with `postgres`.
A missing or malformed URL fails at boot with a message telling you to copy
`.env.example`, instead of surfacing as a connection error somewhere deep in a
request. The function takes its source as an argument rather than reading
`process.env` directly, which is what makes it testable.

Note that this validates **only** `DATABASE_URL`. Other variables
(`BETTER_AUTH_SECRET`, the Authelia and analytics keys) are read where they're
used and are optional or fail later. See [development.md](./development.md#environment)
for the full list.

## Schema

The Drizzle schema lives in `packages/db/src/schema/`:

- `auth.schema.ts` — **generated**. Produced by `vpr auth:generate` from the
  Better Auth config. Don't hand-edit it; change `packages/auth/src/auth.ts`
  and regenerate.
- `relations.ts` — the main relations. `authRelations` uses
  `defineRelationsPart` and so must be spread _after_ it in the `drizzle()` call.
- `index.ts` — the barrel.

Feature modules keep their own tables in their own package (`packages/*/src/schema.ts`).
Drizzle Kit picks them up through a glob, so adding a module's tables doesn't
require editing anything central.

## Routing and auth flow

Routes are file-based under `apps/web/src/routes/`, with two layout routes doing
the guarding:

| Route tree      | Guard                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `_auth/`        | `beforeLoad` requires a user, else redirects to `/login`. Returns `{ user }` into the router context for every child loader. |
| `_guest/`       | `beforeLoad` redirects an authenticated user to `/app`. Wraps login/signup in a centred card layout.                         |
| `api/auth/$.ts` | Better Auth's catch-all handler.                                                                                             |

The `_auth` guard resolves the user through TanStack Query
(`ensureQueryData(authQueryOptions())`), so navigation and prefetch hit a cache
rather than the server every time. Better Auth's `cookieCache` (5 minutes by
default) cuts the server-to-database calls underneath that.

**Route guards are UX, not security.** `beforeLoad` runs on the client during
navigation. Anything that reads or writes data must guard itself:

```ts
// packages/auth/src/tanstack/middleware.ts
export const authMiddleware = /* 401s without a user, injects context.user */;
export const freshAuthMiddleware = /* same, but bypasses the cookie cache */;
```

Apply `authMiddleware` to every server function that requires auth — including
ones only called from inside `_auth` routes. Use `freshAuthMiddleware` for
destructive or sensitive mutations, where acting on a session revoked four
minutes ago is not acceptable.

## Data flow

A typical authenticated read:

```
route loader (_auth/app/*)
  └─ TanStack Query
       └─ server function (src/server.ts)   ← authMiddleware injects context.user
            └─ data access (src/data.ts)    ← Valibot-validated input
                 └─ db (@repo/db)
```

Server functions are the boundary. Called from the server they execute directly;
called from the client they become an RPC over HTTP — which is exactly why they
need their own authorization rather than inheriting the route's.

## Client state

Server state is TanStack Query's job. `apps/web/src/stores/` holds Zustand
stores for the small amount of state that is genuinely client-only (UI state:
sidebar, command menu). If you find yourself syncing server data into Zustand,
that's a signal the data belongs in a query instead.

## Observability

Both are optional and disabled when their env keys are blank:

- `apps/web/src/lib/sentry.ts` — error monitoring, via `VITE_SENTRY_DSN`.
- `apps/web/src/lib/posthog.ts` — product analytics, via `VITE_POSTHOG_KEY`.

## Further reading

- [modules.md](./modules.md) — the feature module pattern
- [development.md](./development.md) — day-to-day commands and workflows
- [deployment.md](./deployment.md) — Docker, CI, migrations
- [`.agents/`](../.agents/) — conventions for AI agents (TanStack patterns, auth, TypeScript)
