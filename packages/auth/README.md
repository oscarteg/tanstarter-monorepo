# @repo/auth

[Better Auth](https://better-auth.com/) configuration and its TanStack Start
integration.

## Layout

| File                         | What it is                                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/auth.ts`                | The Better Auth server config — providers, session, `cookieCache`. The source of truth for the auth schema.                                              |
| `src/auth-client.ts`         | The browser client.                                                                                                                                      |
| `src/tanstack/functions.ts`  | `$getUser` (server function) and `_getUser` (server-only util, shared with the middleware). Forwards `Set-Cookie` so session refresh reaches the client. |
| `src/tanstack/queries.ts`    | `authQueryOptions()` — the single query key (`["auth"]`) everything else reuses.                                                                         |
| `src/tanstack/hooks.ts`      | `useAuth()` and `useAuthSuspense()`, sharing that deduped query.                                                                                         |
| `src/tanstack/middleware.ts` | `authMiddleware` and `freshAuthMiddleware` for server functions and API routes.                                                                          |

Exports are per-file: `@repo/auth/auth`, `@repo/auth/tanstack/hooks`, and so on.

## Using it

**In components** — use the hooks. They share the query the route guard already
populated, so they don't cause a second request:

```ts
import { useAuth } from "@repo/auth/tanstack/hooks";
```

**In `_auth` route loaders** — take the user from the loader context. The
`_auth` layout already resolved it and returns `{ user }`; fetching again is
duplicate work.

**In server functions** — apply the middleware. Always:

```ts
import { authMiddleware } from "@repo/auth/tanstack/middleware";

export const $doThing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => context.user /* guaranteed */);
```

Use `freshAuthMiddleware` instead for destructive or sensitive mutations — it
bypasses the cookie cache so a session revoked four minutes ago can't act.

## Why middleware and route guards both exist

They protect different things. `beforeLoad` in `routes/_auth/route.tsx` decides
what renders; it runs on the client during navigation and is a UX concern.
Middleware decides what the server will do. A server function called from the
client is an HTTP endpoint, and it is only as protected as its own middleware —
sitting inside a guarded route tree buys it nothing.

## Password reset

`sendResetPassword` in `src/auth.ts` hands the message to
[`@repo/email`](../email/README.md), which picks its transport from the
environment. With no email provider configured the reset link is printed to the
console — enough to exercise the whole flow locally without an inbox.

The screens are `_guest/forgot-password.tsx` (request a link) and
`_guest/reset-password.tsx` (choose a new password). The request form reports
success whether or not the address exists: saying "no such account" there would
turn it into an account-enumeration oracle.

## Changing the config

The database schema is generated from this package. After editing `src/auth.ts`:

```sh
vpr auth:generate   # regenerates packages/db/src/schema/auth.schema.ts
vpr db generate     # then a migration for the diff
```

Never hand-edit `auth.schema.ts` — the next generate overwrites it.
