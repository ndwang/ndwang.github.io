import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".site-output");
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? htmlFiles(path.join(directory, entry.name)) : entry.name.endsWith(".html") ? [path.join(directory, entry.name)] : []
    )
  );
  return files.flat();
}
const files = (await htmlFiles(root)).filter((file) => !file.includes(`${path.sep}assets${path.sep}`));
const errors = [];
let checked = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  const pageUrl = `https://ndwang.github.io/${path
    .relative(root, file)
    .split(path.sep)
    .join("/")
    .replace(/index\.html$/, "")}`;
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)) continue;
    const url = new URL(value, pageUrl);
    let target = path.join(root, decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      await stat(target);
      if (url.hash && target.endsWith(".html")) {
        const document = target === file ? html : await readFile(target, "utf8");
        const id = decodeURIComponent(url.hash.slice(1));
        if (!document.includes(`id="${id}"`)) throw new Error(`missing anchor ${id}`);
      }
      checked++;
    } catch (error) {
      errors.push(`${path.relative(root, file)} → ${value} (${error.code || error.message})`);
    }
  }
  if (/\{%[\s\S]*?%\}/.test(html)) errors.push(`${file}: unrendered Liquid`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} local links, media and anchors across ${files.length} pages.`);
}
