# ndwang.github.io

Personal website of Ningdong Wang — accelerator physicist at Cornell University working on the Electron-Ion Collider, and builder of AI tools for science.

Built from scratch with [Astro](https://astro.build). Design concept: **the interaction point** — two beams (ion gold for physics, electron cyan for AI) colliding on a control-room dark ground.

## Develop

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static build into dist/
npm run preview  # serve the production build locally
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/posts/` | Blog posts (markdown; `draft: true` hides a post from production) |
| `src/content/projects/` | Project pages (frontmatter: title, summary, category, order, image, github, link) |
| `src/data/papers.bib` | Publications — plain BibTeX, parsed at build time by `src/lib/bibtex.ts` |
| `src/pages/` | Routes (home, blog, projects, publications, cv, 404, rss) |
| `src/components/` | Header, footer, collider hero, list items |
| `src/styles/global.css` | Design tokens & shared styles |
| `public/` | Static assets (images, video, embedded HTML widgets) |

## Editing content

- **New post**: add `src/content/posts/<slug>.md` with `title`, `description`, `date`, `tags`. URL becomes `/blog/<year>/<slug>/`. Math ($...$, $$...$$) renders via KaTeX.
- **New publication**: append the BibTeX entry to `src/data/papers.bib`. Mark `selected = {true}` to feature it on the home page.
- **CV**: edit the data arrays in `src/pages/cv.astro`.

## Deploy

Pushes to `main` build and deploy via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages. The repository's Pages source must be set to **GitHub Actions**.
