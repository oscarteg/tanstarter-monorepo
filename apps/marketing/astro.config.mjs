import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/**
 * Static marketing site — `output: "static"` means the build emits plain HTML
 * and needs no server runtime at deploy time.
 *
 * `site` is required for canonical URLs and sitemap generation; change it per
 * project (see `src/config/site.ts`).
 *
 * Not `// @ts-check`ed: the workspace pins `vite` to `@voidzero-dev/vite-plus-core`
 * via a root override, so `@tailwindcss/vite`'s `Plugin` type does not line up
 * nominally with the `vite` copy Astro's types reference. The plugin works — the
 * clash is types-only.
 */
export default defineConfig({
  site: "https://example.com",
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
