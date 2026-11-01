import { readFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";

// Content is read during the repository's build, before any pages are deployed.
// Use the project directory because Astro relocates this module when bundling.
const root = process.cwd();

export const resume = JSON.parse(readFileSync(path.join(root, "src/data/resume.json"), "utf8"));

export function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]
  );
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

// Keep the existing Kramdown anchors and warning blocks when rendering with Remark.
function legacyMarkdownAttributes() {
  return (tree) => {
    function visit(node) {
      if (node.type === "heading") {
        const last = node.children.at(-1);
        const anchor = last?.type === "text" && last.value.match(/\s+\{#([^}]+)\}$/);
        if (anchor) {
          last.value = last.value.slice(0, anchor.index);
          node.data = { ...node.data, hProperties: { id: anchor[1] } };
        }
      }
      if (node.type === "blockquote") {
        const paragraph = node.children.at(-1);
        const text = paragraph?.children?.at(-1);
        const attribute = text?.type === "text" && text.value.match(/(?:^|\n)\{:\s*\.([\w-]+)\s*\}$/);
        if (attribute) {
          text.value = text.value.slice(0, attribute.index);
          node.data = { ...node.data, hProperties: { className: [attribute[1]] } };
          if (!text.value) paragraph.children.pop();
          if (!paragraph.children.length) node.children.pop();
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

const processor = createMarkdownProcessor({
  shikiConfig: { theme: "github-light", wrap: false },
  remarkPlugins: [legacyMarkdownAttributes],
});

function includeAttributes(source) {
  return Object.fromEntries(
    Array.from(source.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g), ([, name, double, single, bare]) => [name, double ?? single ?? bare])
  );
}

function renderInclude(type, source) {
  const attributes = includeAttributes(source);
  if (!attributes.path) throw new Error(`Missing path in ${type}.liquid include`);
  const src = /^(https?:\/\/|\/)/.test(attributes.path) ? attributes.path : `/${attributes.path}`;
  const className = attributes.class ? ` class="${escapeHtml(attributes.class)}"` : "";
  const width = attributes.width ? ` width="${escapeHtml(attributes.width)}"` : "";
  const caption = attributes.caption ? `<figcaption>${escapeHtml(attributes.caption)}</figcaption>` : "";
  if (type === "video") {
    const flags = ["controls", "autoplay", "loop", "muted"].filter((flag) => attributes[flag] === "true").join(" ");
    return `<figure><video src="${escapeHtml(src)}"${className}${width} ${flags} playsinline preload="metadata"></video>${caption}</figure>`;
  }
  const alt = attributes.alt || attributes.title || path.basename(attributes.path, path.extname(attributes.path)).replace(/[-_]/g, " ");
  return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${className}${width} loading="${attributes.loading === "eager" ? "eager" : "lazy"}">${caption}</figure>`;
}

function convertLiquid(markdown, filename) {
  const converted = markdown
    .replace(/\{%\s*include\s+(video|figure)\.liquid\s+([\s\S]*?)%\}/g, (_, type, attributes) => renderInclude(type, attributes))
    .replace(/\{%\s*details\s+(.+?)\s*%\}/g, (_, caption) => `<details>\n<summary>${escapeHtml(caption)}</summary>\n\n`)
    .replace(/\{%\s*enddetails\s*%\}/g, "\n\n</details>");
  const unsupported = converted.match(/\{%[\s\S]*?%\}|\{\{[\s\S]*?\}\}/);
  if (unsupported) throw new Error(`Unsupported Liquid in ${filename}: ${unsupported[0]}`);
  return converted;
}

async function readCollection(collection) {
  const directory = path.join(root, "content", collection);
  const files = (await readdir(directory)).filter((name) => name.endsWith(".md")).sort();
  const renderer = await processor;
  return Promise.all(
    files.map(async (filename) => {
      const source = await readFile(path.join(directory, filename), "utf8");
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
      if (!match) throw new Error(`Missing frontmatter in ${collection}/${filename}`);
      const frontmatter = yaml.load(match[1]);
      const body = match[2];
      const isPost = collection === "posts";
      const stem = filename.replace(/\.md$/, "");
      const slug = isPost ? stem.replace(/^\d{4}-\d{2}-\d{2}-/, "") : stem;
      // Jekyll's frontmatter date overrides its filename date, including the URL year.
      const date = frontmatter.date ? new Date(frontmatter.date) : isPost ? new Date(`${filename.slice(0, 10)}T00:00:00Z`) : undefined;
      if (date && Number.isNaN(date.getTime())) throw new Error(`Invalid date in ${filename}`);
      const url = frontmatter.permalink || (isPost ? `/blog/${date.getUTCFullYear()}/${slug}/` : `/projects/${slug}/`);
      const rendered = await renderer.render(convertLiquid(body, filename));
      const words = body
        .replace(/<[^>]*>|\{%[\s\S]*?%\}/g, " ")
        .trim()
        .split(/\s+/).length;
      return {
        ...frontmatter,
        slug,
        url,
        date,
        tags: frontmatter.tags || [],
        category: frontmatter.category || frontmatter.categories?.[0] || "",
        description: frontmatter.description || "",
        html: rendered.code,
        headings: rendered.metadata.headings,
        minutes: Math.max(1, Math.ceil(words / 220)),
      };
    })
  );
}

export async function getPosts() {
  return (await readCollection("posts")).sort((a, b) => b.date - a.date);
}

export async function getProjects() {
  return (await readCollection("projects")).sort((a, b) => (a.importance || 0) - (b.importance || 0) || a.title.localeCompare(b.title));
}

// BibTeX values can nest braces and contain commas. Read their delimiters instead
// of splitting on commas, which would truncate titles and author lists.
function readBibValue(source, start) {
  const opening = source[start];
  if (opening !== "{" && opening !== '"') {
    const delimiter = source.slice(start).search(/[,}]/);
    const end = delimiter < 0 ? source.length : start + delimiter;
    return { value: source.slice(start, end).trim(), end };
  }
  let depth = 1;
  for (let index = start + 1; index < source.length; index++) {
    if (source[index] === "\\") {
      index++;
      continue;
    }
    if (opening === "{" && source[index] === "{") depth++;
    if ((opening === "{" && source[index] === "}") || (opening === '"' && source[index] === '"')) depth--;
    if (depth === 0) return { value: source.slice(start + 1, index), end: index + 1 };
  }
  throw new Error("Unclosed BibTeX value");
}

export function isLeadAuthor(author = "") {
  return /^(Wang,\s*Ningdong|Ningdong\s+Wang|Wang,\s*N\.?\s*(?:and|$))/i.test(author);
}

export function getPapers() {
  const source = readFileSync(path.join(root, "content/papers.bib"), "utf8");
  const entries = [];
  const pattern = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
  let match;
  while ((match = pattern.exec(source))) {
    const fields = {};
    let cursor = pattern.lastIndex;
    while (cursor < source.length) {
      while (/[\s,]/.test(source[cursor] || "") && cursor < source.length) cursor++;
      if (source[cursor] === "}") break;
      const field = source.slice(cursor).match(/^(\w+)\s*=\s*/);
      if (!field) throw new Error(`Invalid BibTeX field in ${match[2]}`);
      const result = readBibValue(source, cursor + field[0].length);
      fields[field[1].toLowerCase()] = result.value.replace(/[{}]/g, "").trim();
      cursor = result.end;
    }
    if (source[cursor] !== "}") throw new Error(`Unclosed BibTeX entry ${match[2]}`);
    pattern.lastIndex = cursor + 1;
    entries.push({
      ...fields,
      id: match[2],
      type: match[1],
      title: fields.title || "",
      author: fields.author || "",
      year: Number(fields.year),
      doi: fields.doi || "",
      url: fields.url || (fields.doi ? `https://doi.org/${fields.doi}` : ""),
      booktitle: fields.booktitle || fields.journal || fields.institution || fields.publisher || "",
      selected: fields.selected === "true",
      bibtex: source.slice(match.index, cursor + 1),
    });
  }
  return entries.sort((a, b) => b.year - a.year);
}

export function getPaperGroups() {
  const papers = getPapers();
  return [...new Set(papers.map((paper) => paper.year))].map((year) => ({
    year,
    papers: papers.filter((paper) => paper.year === year).sort((a, b) => Number(isLeadAuthor(b.author)) - Number(isLeadAuthor(a.author))),
  }));
}
