# Starting a project from this template

A checklist for turning the template into a real application. Work top to bottom;
each step is independent enough to stop and come back.

## 1. Get it running

Follow [development.md](./development.md#first-run) first. Don't rename anything
until you've seen it work — it's much easier to tell a rename mistake from a
setup mistake that way.

## 2. Rename

| What                             | Where                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| Root package name (`tanstarter`) | [`package.json`](../package.json)                                                      |
| Postgres database + volume name  | [`docker-compose.yml`](../docker-compose.yml) (`POSTGRES_DB`, `volumes:`, healthcheck) |
| `DATABASE_URL` database name     | `apps/web/.env`, [`apps/web/.env.example`](../apps/web/.env.example)                   |
| Image name                       | Nothing to change — CI derives it from the GitHub repo.                                |

The `@repo/*` package names can stay. They're internal and never published, and
renaming them is churn across every import.

## 3. Strip the demo

**The notes module.** `@repo/notes` is an example, not a feature. Either copy it
into your first real module or remove it — full instructions in
[modules.md](./modules.md#removing-the-example). Removing it before you've read
it is a waste; it's the reference for how a feature is meant to be shaped.

**The marketing copy.** `apps/marketing` ships deliberately absurd placeholder
text about a fake SaaS. Everything you need to change lives in
`apps/marketing/src/config/` and `src/content/` — you shouldn't have to touch
component markup. See [`apps/marketing/README.md`](../apps/marketing/README.md)
for the field-by-field table.

## 4. Rebrand

- **Design tokens** — colours and fonts, in `packages/ui/styles/base.css` and
  the marketing site's equivalents. The default is the Rams Document language:
  warm paper, near-black ink, one restrained Braun-orange accent, hairline rules,
  square corners, Archivo + Space Mono.
- **`apps/marketing/public/favicon.svg`** — a neutral placeholder mark.
- **`apps/marketing/public/og.png`** (1200×630) — nothing ships one, so social
  previews 404 until you add it.
- **`apps/marketing/public/uploads/*.png`** — the demo product screenshots.
- **`site` in `astro.config.mjs`** and the `Sitemap:` line in
  `public/robots.txt` — set to your real origin.

## 5. Wire up the real services

- Generate a fresh `BETTER_AUTH_SECRET` (`vpr auth:secret`). Never reuse the
  compose default, which is literally `dev-secret-change-me`.
- Point `DATABASE_URL` at a real Postgres.
- Set `VITE_BASE_URL` to your production origin.
- Decide on SSO (Authelia), error monitoring (Sentry), and analytics (PostHog).
  All three are off while their variables are blank — leaving them blank is a
  valid answer.

## 6. Legal

The template's code is public domain via [Unlicense](../LICENSE). Replace or
remove `LICENSE` for your own project. `apps/marketing/src/content/pages/`
holds a minimal `/privacy` page with placeholder prose — replace it before you
collect a single email address.

## 7. Build the first module

Follow [modules.md](./modules.md#building-a-new-module). Resist putting the
first feature directly in `apps/web` — the module boundary is cheap to keep and
expensive to retrofit.

## Before the first deploy

- [ ] `vpr check` and `vpr test` pass
- [ ] `vpr test:e2e` passes (update the E2E specs that assert on demo copy)
- [ ] Secrets are real, and set at runtime rather than baked into the image
- [ ] Migrations run as a deliberate deploy step — the app does not self-migrate
- [ ] `VITE_BASE_URL` and the OAuth redirect URIs point at the real origin
- [ ] `og.png`, favicon, and privacy page are yours
