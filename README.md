# [TanStarter Monorepo](https://github.com/mugnavo/tanstarter-monorepo)

<!-- scaffold:description -->

A minimal monorepo starter for 🏝️ TanStack Start, based on [mugnavo/tanstarter](https://github.com/mugnavo/tanstarter).

```
pnpm create mugnavo -t monorepo
```

- [Vite Plus](https://viteplus.dev/) + pnpm workspaces with [catalogs](https://pnpm.io/catalogs)
- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest)
- [Vite 8](https://vite.dev/) + [Nitro v3](https://nitro.build/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) (base-rhea, [`--preset b1au68YWO`](https://ui.shadcn.com/create?preset=b1au68YWO&base=base&template=start&pointer=true))
- [Drizzle ORM v1](https://orm.drizzle.team/docs/relations-v1-v2) + PostgreSQL
- [Better Auth](https://better-auth.com/)
- [Astro](https://astro.build/) for the static marketing site
- [Vitest](https://vitest.dev/) + [MSW](https://mswjs.io/) + [Playwright](https://playwright.dev/)

```sh
├── apps
│    ├── web                    # TanStack Start app (Nitro Node SSR)
│    └── marketing              # Astro marketing site (static)
├── packages
│    ├── auth                   # Better Auth + TanStack integration
│    ├── db                     # Drizzle ORM + Drizzle Kit + PostgreSQL
│    ├── notes                  # Example feature module — copy it or delete it
│    └── ui                     # shadcn/ui primitives, Rams components, theme
├── tooling
│    └── tsconfig               # Shared TypeScript configuration
├── e2e                         # Playwright end-to-end tests
├── docs                        # Documentation (start here ↓)
├── .agents                     # Conventions for AI agents
├── docker-compose.yml
├── Dockerfile
└── vite.config.ts
```

## Documentation

| Guide                                              | What's in it                                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Architecture](./docs/architecture.md)             | How the pieces fit: packages, the database entry point, auth flow, data flow. |
| [Feature modules](./docs/modules.md)               | The module pattern — building one, enabling it, removing the example.         |
| [Development](./docs/development.md)               | Commands, environment, database, checks, testing, dependencies.               |
| [Deployment](./docs/deployment.md)                 | Docker, Compose, migrations, CI, other hosting targets.                       |
| [Starting a project](./docs/starting-a-project.md) | Turning the template into a real application.                                 |

Package-level detail lives next to the code: [`apps/web`](./apps/web/README.md),
[`apps/marketing`](./apps/marketing/README.md), [`packages/auth`](./packages/auth/README.md),
[`packages/db`](./packages/db/README.md), [`packages/email`](./packages/email/README.md),
[`packages/ui`](./packages/ui/README.md), [`packages/notes`](./packages/notes/README.md).

## Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/en/download) >= 24
- [pnpm](https://pnpm.io/installation) >= 11
- [Vite Plus](https://viteplus.dev/guide/#install-vp) (`vp`)
- Docker, for the local Postgres

#### Setup

1. [Use this template](https://github.com/new?template_name=tanstarter-monorepo&template_owner=mugnavo) or create a project with the CLI:

   ```
   pnpm create mugnavo -t monorepo
   ```

2. Copy [`apps/web/.env.example`](./apps/web/.env.example) to `apps/web/.env` and fill it in.

   - `DATABASE_URL` — Postgres connection string (or run `docker compose up -d` for the bundled Postgres).
   - `BETTER_AUTH_SECRET` — generate one with `vpr auth:secret`.
   - `VITE_BASE_URL` — the app's base URL (`http://localhost:3000` in development).
   - SSO, Sentry, and PostHog keys are optional and stay off while blank.

   `DATABASE_URL` is validated on boot (Valibot), so a missing or malformed value fails fast with a clear message instead of a cryptic runtime error. Full table in [development.md](./docs/development.md#environment).

3. Generate and apply the initial migration:

   ```sh
   vpr db generate
   vpr db migrate
   ```

4. Run the development server:

   ```sh
   vpr dev
   ```

   The app comes up at [http://localhost:3000](http://localhost:3000).

> [!TIP]
> [`./dev.sh`](./dev.sh) brings up Postgres and the dev server together — `./dev.sh` for every workspace, `./dev.sh web` for the app alone.

`vpr check` (format + lint + typecheck) is the one command to run before pushing.
Note that `jj` doesn't run git hooks, so the staged-file formatter never fires on
`jj commit` — CI is the backstop, not the first line of defence.

## Deploying to production

The app ships as a container running the Nitro **Node SSR** server; CI publishes
a multi-arch image to `ghcr.io` on every push to `main`. Nitro also has
[presets](https://nitro.build/deploy) for Netlify, Vercel, Node, and more if
you'd rather not use a container.

See [deployment.md](./docs/deployment.md) for the image, Compose profiles,
migrations, and CI.

## Issue watchlist

- [Router/Start issues](https://github.com/TanStack/router/issues) - TanStack Start is in RC.
- [Devtools releases](https://github.com/TanStack/devtools/releases) - TanStack Devtools is in alpha and may still have breaking changes.
- [Nitro v3 beta](https://nitro.build/blog/v3-beta) - This template is configured with Nitro v3 beta by default.
- [Drizzle ORM v1 RC](https://orm.drizzle.team/docs/relations-v1-v2) - Drizzle ORM v1 is in RC with relations v2.
- [Better Auth releases](https://github.com/better-auth/better-auth/releases) - We're using Better Auth v1.7 RC which supports Drizzle Relations v2.
- [Vite+ releases](https://github.com/voidzero-dev/vite-plus/releases) - Vite+ is in beta.

## Goodies

#### Upgrading dependencies

Dependency versions are pinned, so they may be slightly outdated when you create your project. To selectively upgrade packages, run `vpr deps` or `vpx taze@latest -Ilwr --maturity-period 3`.

#### Scripts

Check the root [package.json](./package.json) and each workspace package's `package.json` for the full list.

- **`check`** - Format, lint, and typecheck. Run this before pushing. (`check:fix` to fix.)
- **`test`**, **`test:e2e`** - Vitest and Playwright.
- **`db`** - Drizzle Kit. (e.g. `vpr db generate`)
- **`auth:generate`** - Regenerate the [auth db schema](./packages/db/src/schema/auth.schema.ts) after changing the Better Auth [config](./packages/auth/src/auth.ts).
- **`ui`** - The shadcn/ui CLI. (e.g. `vpr ui add button`)
- **`deps`**, **`fallow`** - Upgrade dependencies via taze; find unused ones.

#### Utilities

- [`/auth/src/tanstack/middleware.ts`](./packages/auth/src/tanstack/middleware.ts) - Middleware for enforcing authentication on server functions & API routes.
- [`/web/src/components/theme-toggle.tsx`](./apps/web/src/components/theme-toggle.tsx), [`/ui/lib/theme-provider.tsx`](./packages/ui/lib/theme-provider.tsx) - A theme toggle and provider for light/dark mode.
- [`/web/src/modules/`](./apps/web/src/modules/) - The feature-module registry.

## License

Code in this template is public domain via [Unlicense](./LICENSE). Feel free to remove or replace for your own project.

## Ecosystem

- [@tanstack/intent](https://tanstack.com/intent/latest/docs/getting-started/quick-start-consumers) - Up-to-date skills for your AI agents, auto-synchronized from your installed dependencies.
- [awesome-tanstack-start](https://github.com/Balastrong/awesome-tanstack-start) - A curated list of awesome resources for TanStack Start.
- [shadcn/ui Directory](https://ui.shadcn.com/docs/directory), [shoogle.dev](https://shoogle.dev/) - Component directories & registries for shadcn/ui.

## Related templates

- [mugnavo/tanstarter](https://github.com/mugnavo/tanstarter) - The original minimal version that this template is based on.
- [tsu-moe/tsu-stack](https://github.com/tsu-moe/tsu-stack) - An opinionated and batteries-included monorepo template from Luzefiru, built on tanstarter-monorepo, with Paraglide.js (i18n), Hono, oRPC, and more.
