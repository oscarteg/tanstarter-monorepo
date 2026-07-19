# Development

Day-to-day commands and workflows.

`vpr` is shorthand for `vp run` — the [Vite+](https://viteplus.dev/) task runner.
Prefer it over calling `pnpm`, `vitest`, or `tsc` directly; the wrappers carry
the workspace config.

## Prerequisites

- [Node.js](https://nodejs.org/en/download) >= 24
- [pnpm](https://pnpm.io/installation) >= 11
- [Vite+](https://viteplus.dev/guide/#install-vp) (`vp`)
- Docker, for the local Postgres

## First run

```sh
vp install
cp apps/web/.env.example apps/web/.env   # then fill it in
docker compose up -d                     # Postgres on :5432
vpr db generate                          # first migration from the schema
vpr db migrate
vpr dev
```

The app comes up at [http://localhost:3000](http://localhost:3000).

`dev` runs every workspace in parallel, so the marketing site starts too. To run
just one:

```sh
vpr dev:web                             # only apps/web
vp run --filter=@repo/marketing dev     # only apps/marketing
```

[`./dev.sh`](../dev.sh) is a convenience wrapper that brings up Postgres and then
the dev server(s) in one go — `./dev.sh` for everything, `./dev.sh web` for the
app alone.

## Environment

Everything lives in `apps/web/.env`, seeded from
[`apps/web/.env.example`](../apps/web/.env.example).

| Variable                 | Required | What it does                                                                                                 |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`           | **yes**  | Postgres connection string. Validated at boot — must start with `postgres`.                                  |
| `BETTER_AUTH_SECRET`     | **yes**  | Session signing secret. Generate one with `vpr auth:secret`.                                                 |
| `VITE_BASE_URL`          | yes      | The app's own origin. `http://localhost:3000` in development.                                                |
| `AUTHELIA_ISSUER_URL`    | no       | Authelia (self-hosted OIDC) SSO. The provider is only registered when the three `AUTHELIA_*` values are set. |
| `AUTHELIA_CLIENT_ID`     | no       |                                                                                                              |
| `AUTHELIA_CLIENT_SECRET` | no       |                                                                                                              |
| `VITE_AUTHELIA_ENABLED`  | no       | `"true"` renders the SSO button on `/login` and `/signup`.                                                   |
| `RESEND_API_KEY`         | no       | Outbound email. Blank prints messages (including reset links) to the console instead of sending.             |
| `EMAIL_FROM`             | no       | Verified sender. Required _only_ when `RESEND_API_KEY` is set — otherwise startup throws.                    |
| `VITE_SENTRY_DSN`        | no       | Error monitoring. Blank disables Sentry.                                                                     |
| `VITE_POSTHOG_KEY`       | no       | Product analytics. Blank disables PostHog.                                                                   |
| `VITE_POSTHOG_HOST`      | no       | Defaults to `https://us.i.posthog.com`.                                                                      |

Only `DATABASE_URL` is schema-validated (see
[architecture.md](./architecture.md#the-database-entry-point)); the rest are read
where they're used.

Using Authelia? Register `http://localhost:3000/api/auth/callback/authelia` as
the redirect URI on the OIDC client.

## Database

Drizzle Kit runs through `@repo/db`:

```sh
vpr db generate        # diff the schema, write a migration
vpr db migrate         # apply pending migrations
vpr db studio          # browse the data
```

Schema lives in `packages/db/src/schema/` for core tables and
`packages/*/src/schema.ts` for module tables — both are covered by Drizzle Kit's
glob, so a new module needs no central registration.

**`packages/db/src/schema/auth.schema.ts` is generated.** After changing the
Better Auth config in `packages/auth/src/auth.ts`, regenerate it and produce a
migration:

```sh
vpr auth:generate
vpr db generate
```

## Checks

```sh
vpr check          # format + lint + typecheck — the one to run before pushing
vpr check:fix      # and fix what it can
vpr lint           # type-aware lint; this also type-checks, so no separate tsc
vpr format         # Oxfmt
vpr test           # Vitest
vpr test:e2e       # Playwright
vpr build          # only when you need to verify production output
```

`vpr lint` is type-aware and runs the type checker, so there's no reason to run
`tsc --noEmit` separately. Don't build after every change — if `vpr check`
passes, assume the change works.

Oxfmt runs on staged files via Vite+'s pre-commit hook. **`jj` does not run git
hooks**, so on `jj commit` the formatter never fires — run `vpr check` yourself
before pushing. CI is the backstop, not the first line of defence.

## Testing

Unit and integration tests are Vitest, colocated as `*.test.ts` next to the code
(`apps/web/src/lib/`, `apps/web/src/stores/`, `apps/web/src/mocks/`). HTTP is
stubbed with MSW — handlers in `apps/web/src/mocks/handlers.ts`.

End-to-end tests are Playwright, in [`e2e/`](../e2e/). Nothing needs to be
deployed first: `webServer` in [`playwright.config.ts`](../playwright.config.ts)
builds and serves both apps itself.

- **`marketing`** runs against a preview of the static build.
- **`app`** runs against the real SSR server — the same Nitro output the Docker
  image runs — so it needs Postgres with migrations applied.

```sh
docker compose up -d db
vpr db migrate
vpx playwright install chromium   # first run only
vpr test:e2e
```

`DATABASE_URL` defaults to the compose database; export it to point elsewhere.

## UI components

`@repo/ui` vendors shadcn/ui primitives via the CLI. Add one:

```sh
vpr ui add button          # into packages/ui
vpr ui:web add button      # into apps/web
```

Vendored primitives in `packages/ui/components/` are **lint-ignored on purpose**:
they're regenerated by the CLI, so local fixes are lost on the next `add`. Put
your own compositions outside that directory.

Icons: [`lucide-react`](https://lucide.dev) with an `Icon` suffix
(`import { Loader2Icon } from "lucide-react"`), and
`@icons-pack/react-simple-icons` for brand marks (`SiGithub`).

## Dependencies

Versions are shared through the pnpm catalog in
[`pnpm-workspace.yaml`](../pnpm-workspace.yaml). Declare `"react": "catalog:"` in
a package, never a literal version.

```sh
vpr deps      # selective upgrades via taze (pinned, 3-day maturity window)
vpr fallow    # find unused dependencies
```

Run `vp install` after pulling. If setup, runtime, or package-manager behaviour
looks wrong, `vp env doctor` is the first thing to try.

## Agent conventions

[`.agents/`](../.agents/) holds the conventions AI agents follow in this repo —
[TanStack patterns](../.agents/tanstack-patterns.md),
[auth](../.agents/auth.md), [TypeScript](../.agents/typescript.md), and
[workflow](../.agents/workflow.md). [`AGENTS.md`](../AGENTS.md) is the entry
point.
