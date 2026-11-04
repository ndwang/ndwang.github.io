# Design system

The website presents Ningdong Wang’s projects, papers, blog, and CV. The home page leads with his name and factual role: researcher and builder, and PhD student at Cornell University. The subject-neutral Mono Color design uses two printing inks, clean exposed paper, strong typography, and open layouts defined by spacing.

## Copy

Use direct headings and factual descriptions. Name sections Home, Papers, Blog, Projects, and CV. Avoid redundant secondary labels, decorative numbering, taglines, slogans, and explanatory copy that adds no information. Dates, publication venues, authors, descriptive project summaries, and CV headings remain where they help the reader. Keep original article text unchanged.

## Color

Tokens live in `src/styles/global.css`.

| Token            | Value                       | Role                                                     |
| ---------------- | --------------------------- | -------------------------------------------------------- |
| `--paper`        | `#FAFAF7`                   | Neutral White canvas                                     |
| `--paper-raised` | `var(--paper)`              | Surfaces that retain the same substrate                  |
| `--ink`          | `#2148B8`                   | Cobalt text, navigation, actions, and focus              |
| `--accent`       | `#C65F38`                   | Terracotta display emphasis and selected graphic details |
| `--muted`        | 88% cobalt mixed with paper | Supporting text and metadata                             |
| `--line`         | 24% cobalt mixed with paper | Rules and boundaries                                     |
| `--soft`         | 5% cobalt mixed with paper  | Image wells and code surfaces                            |

The ink pair is `palette_cobalt_terracotta`; the substrate is `substrate_neutral_white`. Lighter values represent ink density on paper rather than additional colors. Cobalt carries readable text and controls. Reserve terracotta for large display text and graphic details; do not use it for small text against the white substrate. Keep the paper exposed and avoid gradients, shadows, beige aging, or unrelated accent colors.

## Typography and rhythm

Bricolage Grotesque is the locally bundled face for display titles, body copy, navigation, and controls. Locally bundled IBM Plex Mono identifies dates, publication metadata, and CV headings. These two voices provide the complete type system.

Large titles use compact line height and negative tracking. Page typography adapts to available space and readable text sizes. Reading copy has generous line height and a bounded measure. Keep useful metadata subordinate to titles without adding decorative labels. The desktop canvas is capped at 1320px and collapses to comfortable single-column reading on small screens.

## Artwork and image treatment

The generated [ribbon cutout](../public/assets/img/ribbon-cutout.png) gives the landing page one focal object: an enlarged folded ribbon with an open loop. Its transparent background lets the page show through the opening and around the form. The ribbon overlaps the name and is cropped at the hero boundaries, sharing the page canvas rather than sitting in a separate rectangular image. It is abstract and subject-neutral, with no text, numbered annotation, or caption. Its generation and edit instructions are preserved in [mono-color-prompt.txt](mono-color-prompt.txt).

The recipe uses a contemporary editorial composition with roughly 60% focal imagery and 40% quiet paper. Cobalt carries the dominant form; a narrow terracotta strip crosses the fold. Halftone screening, clipped highlights, and restrained uneven ink density supply the printed character. The paper stays clean and unaged. The artwork is static.

The lower home sections follow the hero's shared-canvas treatment with purpose-made landscape artwork. [The next experiment](../src/assets/editorial/blog-landscape.png) supplies a continuous simulation feedback ribbon for Blog; [SpaceCharge](../src/assets/editorial/projects-landscape.png) supplies the charged bunch, regular Cartesian mesh and outward electric fields for Projects; [Learning the dynamics](../src/assets/editorial/papers-landscape.png) supplies a four-pole magnet and sampled beam trajectory for Papers. Generate reinterpretations from the full original posters and complete original prompts, preserving their scientific relationships and original ink palettes. Do not use cropped or extracted derivatives as generation references. The landscape assets omit poster lettering and exterior paper so live headings can cross their contours. Display their full proportions in contained stages; avoid filters, tinting, opacity treatments, and narrow portrait crops. Use the same paper-colored text stroke as the hero to keep overlapping display type readable. Keep small body copy and publication metadata clear of dense artwork.

Mirror artwork when its direction improves the composition. Papers uses a horizontal CSS flip so the magnet faces toward its heading, while retaining its placement on the left. Crop only the displayed left side into the magnet casing, align that cropped edge with the page gutter, and preserve the incoming trajectory extending from the right. Keep the heading overlapping the magnet. Keep the original asset intact and apply the crop consistently at every breakpoint. Blog and Projects keep their generated orientation. Flip only the image, never the live text.

Original posters remain unchanged, including [Fields in motion](../src/assets/editorial/fields-in-motion.png), which is retained as source artwork. Astro produces responsive WebP versions at build time. The full source references and built-in imagegen prompts are recorded in [editorial-landscape-prompts.md](editorial-landscape-prompts.md); the earlier cutout workflow is recorded in [editorial-cutout-prompts.md](editorial-cutout-prompts.md).

Above 1100px, Blog and Papers place their reading lists beside the artwork, beneath their overlapping headings, to balance the left image mass with useful content on the right. Both lists share the scene's grid cell so the section accommodates whichever is taller. Blog stacks its entries with dividers; Papers keeps compact rows with authors and venues. At narrower widths, content follows the artwork at full reading width.

All content images use their original colors, including project previews, the CV portrait, and figures within articles. Do not apply CSS or SVG color filters, tint overlays, or other color-changing treatments to images. The CV portrait retains its natural proportions. The generated ribbon artwork keeps its original cobalt and terracotta colors.

## Page composition

- **Home:** an oversized name and concise role share a composition with the cropped ribbon on the right. The Blog, Projects, and Papers headings follow in that order, sharing their own open compositions with enlarged transparent artwork on the left, right, and left respectively. SpaceCharge.jl remains the sole featured project; Blog lists all published posts; Papers retains the three most recent first-author papers with year, title, MLA author list, and venue. Artwork and live display type overlap, while reading content occupies quiet areas. Mobile layouts preserve a compact image-and-heading composition and give the content the full reading width below. Quiet dividers mark major section boundaries. The mobile hero keeps its ribbon below the copy and links.
- **Papers:** chronological year groups with one year heading in the left column and publication titles, venues, and authors on the right. Quiet dividers separate papers within each group and span both columns between years. Search and authorship filters hide empty year groups; citations expand in place.
- **Blog:** a direct page title and articles with dates, titles, and descriptions. Keep the short list visible without search or topic filters.
- **Projects:** a featured project and supporting work in open layouts, each with its original preview image, page date, name, and description. The whole card links to its full write-up, which repeats the date above its title using the same treatment as blog posts.
- **CV:** an unstyled portrait and biography, then a structured record of education, industry and research experience, recognition, skills, and compact publications. Describe relevant software contributions within the corresponding experience entry; keep the project catalogue on the Projects page. A Download résumé link styled as a button downloads the selected résumé PDF directly.
- **Articles:** broad title, post date, a desktop contents margin, and a readable body column. The contents list moves above the article on narrow screens. Navigation uses direct labels such as Back to blog and Back to projects.

Prefer open lists and asymmetric compositions. On the home page, integrate the artwork with live type on the page's own paper background; do not separate it into thumbnail columns or filled rectangular cards. Vary scale, alignment, and overlap to suit each image and the amount of content. Use quiet structural dividers at major home section boundaries, between visible Papers and Blog entries, between CV groups, after the featured project on Projects, and between an article title and body. Use one divider per boundary, without top-and-bottom frames around individual entries; keep other spacing open. Form controls, tables, and article code or quotations may retain useful boundaries. Lightly filled surfaces support functional image wells and code.

## Interaction and accessibility

The title is the destination link. Each project card or blog row uses one anchor around its content, named by its heading, so it is one keyboard stop with a generous click target. Publication titles link directly to their papers; BibTeX remains a separate disclosure because it performs a different action. Home section headings link to their index pages instead of adding adjacent All projects, All posts, or All papers links.

Do not add decorative arrows, arrow-only links, or a second View/Read link to an already linked item. Keep arrows only when they carry actual content, such as the conversion direction in Bmad → SciBmad. Distinct navigation regions may repeat destinations, and long articles retain return links at both ends.

Card titles, section links, and standalone navigation links have no underline at rest. A single thin underline appears on hover or keyboard focus without shifting the layout; linked cards apply it only to their title. Outlined home display headings and project/blog titles use terracotta text on hover or focus instead, because their paper-colored stroke would also outline an underline. The hero’s CV link remains underlined. All links retain visible focus outlines and generous click targets. Links embedded in article prose remain underlined so they are distinguishable within sentences. Internal and external links share the same treatment; the link wording names the destination. Main navigation and article contents use their established navigation context, with underlines on hover and an active-page underline in the main navigation. Buttons perform actions such as filtering; navigation and file downloads use links.

Pages and navigation are static HTML. Filters appear only when their JavaScript is ready, so all entries remain accessible without scripts. Search results announce changes, filters expose pressed state, and empty states explain how to recover.

Keyboard users get a skip link and visible focus rings. Content images have descriptive alternatives; the decorative ribbon has an empty alternative. The main navigation identifies the current section, and article contents use real anchor links. Hover effects supplement links rather than hiding content.

The hero print is static. Link and preview transitions are restrained and respect reduced-motion preferences. Print styles remove navigation and interactive decoration while retaining the reading content.

## Content continuity

The original Markdown, BibTeX, résumé JSON, and media remain the source of truth. Styling should not change research claims or article text. The content loader preserves historical post URLs, video embeds, details blocks, and explicit heading anchors. Tests and the built-site link check protect that continuity.
