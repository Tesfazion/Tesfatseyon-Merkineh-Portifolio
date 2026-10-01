/**
 * Fails if src/content/posts.index.json does not exactly match the frontmatter
 * of the .md files it was generated from.
 *
 * The index is what the command palette and the blog archive read, and it is
 * committed to the repo so the app needs no build plugin to run. That only
 * stays safe if nothing can drift: add a post, or edit a title, without
 * regenerating it, and the archive would quietly disagree with the file on
 * disk — or, worse, a new post would exist and never appear anywhere.
 *
 * This runs as part of `npm run check:content`, which gates `npm run build`.
 *
 * Usage:  node tools/check_posts.mjs
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildIndex } from "./build_post_index.mjs";
import { readFileSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "content", "posts.index.json");
const POSTS_DIR = join(ROOT, "src", "content", "posts");

let current;
try {
  current = readFileSync(OUT, "utf8");
} catch {
  console.error("FAIL: src/content/posts.index.json is missing.");
  console.error("      run: node tools/build_post_index.mjs");
  process.exit(1);
}

const expected = buildIndex();

const onDisk = new Set(
  readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
);

if (current !== expected) {
  // Name the actual cause rather than just "mismatch" — the two failure
  // modes need different fixes.
  const indexed = new Set(JSON.parse(expected).map((p) => p.slug));

  const added = [...onDisk].filter((s) => !indexed.has(s));
  const removed = [...indexed].filter((s) => !onDisk.has(s));

  console.error("FAIL: posts.index.json is stale.");
  if (added.length) console.error(`      new post(s) not indexed: ${added.join(", ")}`);
  if (removed.length) console.error(`      indexed post(s) no longer on disk: ${removed.join(", ")}`);
  if (!added.length && !removed.length) {
    console.error("      a title, date, tag, excerpt or word count changed without regenerating");
  }
  console.error("      run: node tools/build_post_index.mjs");
  process.exit(1);
}

const n = JSON.parse(current).length;
const bodies = [...onDisk].length - n;
console.log(
  `ok: posts.index.json up to date (${n} publishable posts indexed, no bodies)`
);
if (bodies > 0) {
  console.log(`note: ${bodies} .md file(s) are drafts and correctly excluded (no title or valid date)`);
}
