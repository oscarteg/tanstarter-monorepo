# syntax=docker/dockerfile:1

# Multi-stage build for the TanStack Start SSR app (apps/web).
# The runtime image serves the self-contained Nitro output on Node — no static
# host assumptions. Built and published to ghcr by CI (see .github/workflows).

# ---- base: Node + pnpm (via corepack, pinned by package.json packageManager) ----
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable
WORKDIR /app

# ---- build: install the whole workspace and build the SSR server ----
FROM base AS build
# Copy the monorepo (exclusions in .dockerignore) and install with the frozen
# lockfile so the image matches the committed dependency graph.
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Produces apps/web/.output (Nitro bundles its own runtime dependencies).
RUN pnpm build:web

# ---- runner: slim image that only serves the Nitro output ----
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nodejs
# Nitro output is self-contained, so the runtime needs nothing but .output.
COPY --from=build --chown=nodejs:nodejs /app/apps/web/.output ./.output
USER nodejs
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
