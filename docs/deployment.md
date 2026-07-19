# Deployment

The app deploys as a **container running the Nitro Node SSR server** — not to a
static host. It needs a process and a Postgres database. The marketing site is
the opposite: static HTML that can go anywhere.

## The image

[`Dockerfile`](../Dockerfile) is multi-stage:

| Stage    | What it does                                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `base`   | `node:24-slim` + pnpm via corepack, plus CA certificates (Vite+ is a Rust binary that panics without them, and `node:*-slim` ships none). |
| `build`  | Copies the workspace, installs with `--frozen-lockfile`, runs `pnpm build:web` → `apps/web/.output`.                                      |
| `runner` | Copies only `.output` and serves it as a non-root user on port 3000. Nitro's output is self-contained, so nothing else is needed.         |

The build stage deletes the repo's `prepare` script before installing — it runs
`vp config`, a dev-machine step that wants git and a `.git` directory the image
deliberately doesn't ship.

Build and run it yourself:

```sh
docker build --target runner -t tanstarter .
docker run -p 3000:3000 \
  -e DATABASE_URL=... -e BETTER_AUTH_SECRET=... -e VITE_BASE_URL=... \
  tanstarter
```

**Never bake secrets into the image.** Pass them at runtime.

## Compose

[`docker-compose.yml`](../docker-compose.yml) has two modes:

```sh
docker compose up -d              # Postgres only — what dev and E2E need
docker compose --profile full up  # + migrations + the containerised app
```

The `full` profile is opt-in because it builds the whole image. It runs three
services in order: `db` (health-checked), `migrate` (a one-shot that applies
Drizzle migrations and exits), then `web` on
[http://localhost:3000](http://localhost:3000).

The `migrate` service builds from the `build` stage, because that's where
drizzle-kit and the workspace live — the runtime image stays slim.

## Migrations

Migrations are `pnpm --filter @repo/db db migrate` (`vpr db migrate` locally).
The `full` profile runs this before `web` starts. Against any other environment,
set `DATABASE_URL` and invoke the same command.

There is no automatic migration-on-boot: the app doesn't migrate its own
database. Run migrations as a deliberate step in your deploy.

## Environment

The runtime needs `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `VITE_BASE_URL`
(your real origin, not localhost). Everything else — Authelia SSO, Sentry,
PostHog — is optional and stays off when blank. Full table in
[development.md](./development.md#environment).

`DATABASE_URL` is validated at boot, so a bad value fails immediately with a
clear message rather than mid-request.

## CI

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on every pull
request and every push to `main`.

**`check`** — install, generate Astro types (`astro:content` types live in the
gitignored `.astro/`, so a fresh clone has none), format check, lint + typecheck,
test, build. No Postgres service: nothing in these steps connects to a database.
The build only bundles and never evaluates the db client, and the tests are
unit-level.

**`publish`** — on pushes to `main` only, after `check` passes. Builds the
`runner` target for `linux/amd64` (servers) and `linux/arm64` (Apple Silicon)
via QEMU, and pushes to `ghcr.io/<owner>/<repo>` tagged `latest` and `sha-<sha>`.
It authenticates with the built-in `GITHUB_TOKEN` — no extra secrets — and needs
only the per-job `packages: write` permission.

[`.github/workflows/e2e.yml`](../.github/workflows/e2e.yml) runs Playwright on
the same triggers. Nothing has to be deployed first; see
[development.md](./development.md#testing).

## Build caching

Vite+ supports [caching](https://viteplus.dev/guide/cache) through Vite Task. A
`build` task is configured in
[`apps/web/vite.config.ts`](../apps/web/vite.config.ts). Use `vp run build` as
the build command where the cache is available.

## Other targets

The Vite config uses Nitro, which has [presets](https://nitro.build/deploy) for
Netlify, Vercel, Node, and more — switch presets if you'd rather not ship a
container. See the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting).

`apps/marketing` builds to static files (`vp run --filter=@repo/marketing build`
→ `dist/`) and needs no runtime at all.

> **Personal projects:** Terraform, DNS, and Cloudflare resources live in the
> `citadel` repo, not here.
