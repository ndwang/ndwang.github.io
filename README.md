# Ningdong Wang

A personal website built with Astro. The site brings together research, software projects, writing, and a CV in a subject-neutral Mono Color design: cobalt and terracotta ink on neutral white, strong typography, and open ruled layouts. Copy uses direct headings and factual descriptions, without redundant labels or decorative slogans.

## Run locally

Use a current Node.js 22 LTS release (22.23.4 or later) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. To check the production build:

```sh
npm test
npm run build
npm run check:links
npm run format:check
npm run preview
```

The build writes to `.site-output/`, which is ignored by Git. Astro serves `public/` directly and copies it into the build without an asset preparation step. Use `npm run format` to format application code and documentation; original content, résumé data, and archived source files are excluded.

## Edit content

| Content                                   | Source                                        |
| ----------------------------------------- | --------------------------------------------- |
| Blog posts                                | `content/posts/*.md`                          |
| Unpublished drafts and diagrams           | `content/drafts/`                             |
| Project write-ups                         | `content/projects/*.md`                       |
| Papers and citations                      | `content/papers.bib`                          |
| Education, experience, awards, and skills | `src/data/resume.json`                        |
| Biography and home copy                   | `src/pages/cv.astro`, `src/pages/index.astro` |
| Images and videos                         | `public/assets/img/`, `public/assets/video/`  |
| Home editorial artwork                    | `src/assets/editorial/`                       |

CV content was checked against `Ningdong_Wang_Complete_Portfolio_September_2026_v2.docx`, including the Shizuku AI internship. The older portfolio DOCX is preserved locally under `docs/reference/`, excluded from Git, and is not the source for current CV wording. Earlier UIUC and Argonne roles remain part of the CV; publication records are verified separately against publisher sources in [publication sources](docs/publication-sources.md).

CV experience follows the order of the `experience` array in `src/data/resume.json`.

CV and Papers publications are grouped by year, newest first, with Ningdong's first-author papers first within each year. Bibliography order is preserved within each authorship group. The CV uses compact MLA author lists; Papers retains full author lists.

Skills wording follows the AI/ML Research Engineer, ML Systems Engineer, Quant Researcher, Accelerator Physics, and LBNL Agentic AI résumés linked from [Ningdong Wang resume versions](https://chatgpt.com/space/page_7610b481dbc481918a6c5cea4a5937f1), including the revised AI/ML upload. Direct corrections from Ningdong take precedence over résumé versions for employment dates and attribution.

The CV’s **Download résumé** link serves `public/assets/pdf/Ningdong_Wang_Resume.pdf` directly, without JavaScript or a Space sign-in. It is an unchanged copy of `Ningdong Wang - AI ML Research Engineer Resume.pdf`, the local PDF of the AI/ML résumé version listed on the résumé Page. Replace this file to update the download while keeping its URL stable. The PDF currently retains its original Brookhaven end date of “Present”; the web CV records Ningdong’s corrected 2024 end date.

Posts use YAML frontmatter with `title`, `description`, `date`, and `tags`, followed by Markdown. Name new posts `YYYY-MM-DD-slug.md`. The frontmatter date determines the URL year, preserving the existing `/blog/2025/AI_space_charge/` address despite its older filename. Project filenames determine `/projects/<filename>/` routes.

Keep unpublished writing and its supporting files in `content/drafts/`. This directory is excluded from production builds. Published HTML diagrams and their shared CSS and JavaScript live in `public/assets/blog/`.

During `npm run dev`, drafts are available at `/drafts/<filename-without-extension>/` using the website's article layout, including their HTML diagrams. These routes are excluded from production builds. “A Brief History of LLM Agents” is published at `/blog/2026/LLM-agents/`, dated November 4, 2026.

Project write-ups also use a `date: "YYYY-MM-DD"` frontmatter field, displayed on the project card and page header. The three original project dates come from their first file-addition commits: SpaceCharge.jl on July 17, 2025 (`648c1dd`), Bmad-bot on July 28, 2025 (`5d6f7d2`), and Bmad to SciBmad on December 11, 2025 (`72a2e32`). These record page creation, not when development of the software began.

The content loader in `src/lib/content.js` reads the original Markdown and BibTeX files at build time. It supports the existing Liquid video/figure includes, expandable details, and explicit heading anchors. New writing can use ordinary Markdown and HTML. Add support in the loader before introducing other Liquid constructs.

Home artwork uses transparent `*-landscape.png` compositions in `src/assets/editorial/`, with live headings layered over them. These were generated from the full original posters and their complete original prompts, preserving each image's scientific relationships and ink palette. Original posters and earlier cutouts remain preserved; the SpaceCharge source is `public/assets/img/spacecharge-editorial.png`. Astro generates responsive WebP files during the build. The [landscape prompts](docs/editorial-landscape-prompts.md) include the source Page links and complete generation instructions; [cutout edit prompts](docs/editorial-cutout-prompts.md) document the earlier background and lettering removal.

Existing posts, project write-ups, and personal media retain their original URLs. Files under `public/assets/` are served at `/assets/`. `/publications/` redirects to `/papers/`; `/about/` redirects to `/cv/`. The retired Jekyll build, template examples, and unused template assets have been removed. Historical personal biography and repository/social settings are preserved under `docs/reference/previous-site/`.

## Structure and design

- `src/layouts/Base.astro`: shared document, navigation, and footer.
- `src/pages/`: home, papers, blog, projects, CV, article routes, and 404.
- `src/components/`: static editorial artwork and article layout.
- `src/styles/global.css`: design tokens, shared components, responsive rules, and reading styles.
- `src/data/resume.json`: structured CV content.
- `content/`: original posts, project write-ups, and publication bibliography.
- `public/`: static media, robots file, and Google site verification.
- `tools/`: built-site link checks.
- `tests/`: content preservation checks.
- `docs/reference/`: historical source material, excluded from the deployed site.
- `docs/design/shots/`: preserved screenshots from design review, excluded from the deployed site.

See [the design system](docs/design-system.md) for visual principles, copy guidance, image treatment, and components. Bricolage Grotesque and IBM Plex Mono are bundled locally. The landing page combines Ningdong Wang’s name and role with a generated [transparent ribbon cutout](public/assets/img/ribbon-cutout.png) that overlaps the typography and extends to the hero boundaries; its [generation and edit instructions](docs/mono-color-prompt.txt) are preserved. Useful dates, publication metadata, and CV headings remain. The pages render as static HTML; JavaScript enhances filters.

## Deploy

The `Deploy site` GitHub Actions workflow installs dependencies, runs tests, builds Astro, and checks local links. Pushes to `main` or `master` publish `.site-output/` using the existing GitHub Pages deployment action. Pull requests run the same checks without publishing.

Keep `public/.nojekyll` in the deployed output. It tells GitHub Pages to serve Astro’s generated files directly, including the `_astro/` styles, scripts, fonts, and images that Jekyll would otherwise omit.

Separate workflows check formatting and analyze JavaScript/TypeScript with CodeQL. The manually triggered Axe workflow builds Astro and checks the five main pages, or one supplied relative path, for accessibility issues.

The canonical URL is configured in `astro.config.mjs`. If the site moves, also update the feed, redirect pages, and public robots file. No Ruby installation is needed for the active build.
