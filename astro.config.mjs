import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFile } from "node:fs/promises";
import path from "node:path";

export default defineConfig({
  site: "https://ndwang.github.io",
  outDir: "./.site-output",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  integrations: [
    {
      name: "local-drafts",
      hooks: {
        "astro:config:setup": ({ command, injectRoute }) => {
          if (command !== "dev") return;
          injectRoute({ pattern: "/drafts/[slug]/", entrypoint: "./src/dev/Draft.astro" });
        },
        "astro:server:setup": ({ server }) => {
          const directory = path.resolve("content/drafts");
          const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
          server.middlewares.use(async (request, response, next) => {
            const pathname = new URL(request.url, "http://localhost").pathname;
            if (!pathname.startsWith("/drafts/")) return next();
            const file = path.resolve(directory, pathname.slice("/drafts/".length));
            const type = types[path.extname(file)];
            if (!file.startsWith(directory + path.sep) || !type) return next();
            try {
              const data = await readFile(file);
              response.setHeader("Content-Type", `${type}; charset=utf-8`);
              response.end(data);
            } catch {
              next();
            }
          });
        },
      },
    },
    sitemap({ filter: (page) => !/\/(about|publications)\/$/.test(page) && !/\/blog\/(?:\d{4}\/|(?:tag|category)\/[^/]+\/)$/i.test(page) }),
  ],
});
