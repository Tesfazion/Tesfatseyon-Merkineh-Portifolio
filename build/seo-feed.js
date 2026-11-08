/**
 * A tiny Vite plugin that generates sitemap.xml and rss.xml at build time.
 *
 * Why a plugin instead of a hand-maintained file: a static sitemap goes
 * stale the moment someone adds a post, and search engines punish that.
 * Generating from the same markdown the app renders means the feed can
 * never list a post that doesn't exist, or miss one that does.
 *
 * It emits during generateBundle so the files land in dist/ alongside the
 * hashed assets with no extra npm script.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "../src/lib/frontmatter.js";

/* Static routes and how often they change. "monthly" for anything that
   gets edited as prose; "weekly" for the blog index, which changes
   whenever a post is published. */
const STATIC_ROUTES = [
  { path: "/",        priority: "1.0", changefreq: "monthly" },
  { path: "/web",     priority: "0.9", changefreq: "monthly" },
  { path: "/video",   priority: "0.9", changefreq: "monthly" },
  { path: "/blog",    priority: "0.8", changefreq: "weekly"  },
];

/* Only the five XML predefined entities are legal, and they must also be
   escaped in attributes and CDATA. Apostrophes are handled explicitly
   because "&apos;" is XML 1.1, not XML 1.0. */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/* Shared with src/lib/blog.js so a post is publishable in the archive and
   in the feeds under exactly the same conditions. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function readPosts(dir) {
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  return files
    .map((file) => {
      const raw = readFileSync(join(dir, file), "utf8");
      const { meta, body } = parseFrontmatter(raw);
      /* Same publishability rule as src/lib/blog.js — a post missing a
         title or carrying a malformed date is excluded from the archive
         and from here, so the pages and the feeds can never disagree. */
      if (!meta.title || !ISO_DATE.test(meta.date || "")) return null;
      return {
        slug: file.replace(/\.md$/, ""),
        title: meta.title,
        date: meta.date,
        excerpt: meta.excerpt || "",
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        body,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function seoFeed({ siteUrl, postsDir, author, language = "en" }) {
  const base = siteUrl.replace(/\/+$/, "");

  return {
    name: "portfolio-seo-feed",
    apply: "build",

    generateBundle() {
      const posts = readPosts(postsDir);
      const lastmod = posts[0]?.date || new Date().toISOString().slice(0, 10);

      /* ── sitemap.xml ── */
      const urls = [
        ...STATIC_ROUTES.map(
          (r) =>
            `  <url><loc>${esc(base + r.path)}</loc><lastmod>${lastmod}</lastmod>` +
            `<changefreq>${r.changefreq}</changefreq>` +
            `<priority>${r.priority}</priority></url>`
        ),
        ...posts.map(
          (p) =>
            `  <url><loc>${esc(`${base}/blog/${p.slug}`)}</loc>` +
            `<lastmod>${esc(p.date)}</lastmod>` +
            `<changefreq>monthly</changefreq><priority>0.7</priority></url>`
        ),
      ].join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `${urls}\n</urlset>\n`,
      });

      /* ── rss.xml ── */
      const items = posts
        .map((p) => {
          const link = `${base}/blog/${p.slug}`;
          const pubDate = new Date(`${p.date}T00:00:00Z`).toUTCString();
          const categories = p.tags
            .map((t) => `<category>${esc(t)}</category>`)
            .join("");

          /* Excerpt rather than body: RSS readers truncate anyway, and
             shipping raw markdown risks leaking syntax into the feed. */
          return [
            "    <item>",
            `      <title>${esc(p.title)}</title>`,
            `      <link>${esc(link)}</link>`,
            `      <guid isPermaLink="true">${esc(link)}</guid>`,
            `      <pubDate>${pubDate}</pubDate>`,
            `      <description>${esc(p.excerpt)}</description>`,
            categories,
            "    </item>",
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n");

      this.emitFile({
        type: "asset",
        fileName: "rss.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
          `  <channel>\n` +
          `    <title>${esc(author.name)} — Blog</title>\n` +
          `    <link>${esc(`${base}/blog`)}</link>\n` +
          `    <description>${esc(author.description)}</description>\n` +
          `    <language>${language}</language>\n` +
          `    <lastBuildDate>${new Date(`${lastmod}T00:00:00Z`).toUTCString()}</lastBuildDate>\n` +
          `    <atom:link href="${esc(`${base}/rss.xml`)}" rel="self" type="application/rss+xml"/>\n` +
          `${items}\n` +
          `  </channel>\n</rss>\n`,
      });
    },
  };
}
