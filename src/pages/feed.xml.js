import { getPosts, escapeHtml } from "../lib/content.js";
export async function GET() {
  const posts = await getPosts();
  const site = "https://ndwang.github.io";
  const items = posts
    .map(
      (post) =>
        `<item><title>${escapeHtml(post.title)}</title><link>${site}${post.url}</link><guid>${site}${post.url}</guid><pubDate>${post.date.toUTCString()}</pubDate><description>${escapeHtml(post.description)}</description></item>`
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ningdong Wang — Blog</title><link>${site}/blog/</link><description>Articles by Ningdong Wang.</description>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
