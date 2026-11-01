import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ndwang.github.io",
  outDir: "./.site-output",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  integrations: [
    sitemap({ filter: (page) => !/\/(about|publications)\/$/.test(page) && !/\/blog\/(?:\d{4}\/|(?:tag|category)\/[^/]+\/)$/i.test(page) }),
  ],
});
