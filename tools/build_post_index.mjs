/**
 * Generate src/content/posts.index.json — post metadata WITHOUT the bodies.
 *
 * Why this file exists:
 *
 * The command palette needs to search posts, and it is mounted on every page
 * including the landing route. It used to get that data from getAllPosts(),
 * which reads src/content/posts/*.md through an eager import.meta.glob — so
 * every post body was bundled into the entry chunk and downloaded by
 * visitors who may never open the blog. With 13 posts that was 32 kB of
 * Markdown in the entry bundle; at 50 posts it would be over 200 kB.
 *
 * So the metadata lives here instead, and the .md files are imported lazily,
 * one per post, only by the post page that is actually open.
 *
 * The index is generated and committed rather than generated during the
 * build so the app needs no plugin to run. It cannot drift: tools/
 * check_posts.mjs (wired into `npm run check:content`, which gates
 * `npm run build`) regenerates it in memory and fails if the committed file
 * differs by a single byte.
 *
 * Usage:  node tools/build_post_index.mjs          # write the index
 *         node tools/build_post_index.mjs --check  # verify only, exit 1 on drift
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parseFrontmatter } from "../src/lib/frontmatter.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(ROOT, "src", "content", "posts");
const OUT = join(ROOT, "src", "content", "posts.index.json");

/* Must stay identical to the rule blog.js and build/seo-feed.js apply, so a
   post can never appear in the palette but not the feed. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function buildIndex() {
  const posts = readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(join(POSTS_DIR, file), "utf8");
      const { meta, body } = parseFrontmatter(raw);
      const slug = file.replace(/\.md$/, "");
      return {
        slug,
        title: meta.title || "Untitled",
        date: meta.date || "",
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        excerpt: meta.excerpt || "",
        words: body.trim() ? body.trim().split(/\s+/).length : 0,
      };
    })
    .filter((p) => p.title && p.title !== "Untitled" && ISO_DATE.test(p.date))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return `${JSON.stringify(posts, null, 2)}\n`;
}

/* pathToFileURL rather than string-concatenating "file://" — on Windows
   argv paths are backslashed and need a leading slash and drive colon, so
   the naive comparison never matches and the script silently does nothing. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const next = buildIndex();
  if (process.argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(OUT, "utf8");
    } catch {
      console.error("FAIL: src/content/posts.index.json is missing — run: node tools/build_post_index.mjs");
      process.exit(1);
    }
    if (current !== next) {
      console.error("FAIL: posts.index.json is stale — a post's frontmatter changed without regenerating.");
      console.error("      run: node tools/build_post_index.mjs");
      process.exit(1);
    }
    const n = JSON.parse(current).length;
    console.log(`ok: posts.index.json up to date (${n} publishable posts, no bodies)`);
  } else {
    writeFileSync(OUT, next);
    const n = JSON.parse(next).length;
    console.log(`wrote src/content/posts.index.json  ${n} posts`);
  }
}
