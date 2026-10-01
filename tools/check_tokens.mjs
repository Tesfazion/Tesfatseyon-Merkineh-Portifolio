/**
 * Checks that the syntax highlighter in src/lib/blog.js can only emit
 * class names that index.css actually styles.
 *
 * The two were out of sync once — the renderer emitted tok-keyword /
 * tok-string / tok-number / tok-comment while the stylesheet defined
 * tok-key / tok-str / tok-num / tok-com. Every token silently fell through
 * to the unstyled <pre> colour, so code blocks looked flat and nothing
 * reported an error. This fails the build loudly if it happens again.
 *
 * Usage:  node tools/check_tokens.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const blog = readFileSync(join(ROOT, "src", "lib", "blog.js"), "utf8");
const css = readFileSync(join(ROOT, "src", "index.css"), "utf8");

/* Every entry in the highlighter's pattern list is ["type", <regex|ref>],
   whatever the second element happens to be. */
const emitted = new Set(
  [...blog.matchAll(/^\s*\["([a-z]+)",\s*(?:\/|\w)/gm)].map((m) => m[1])
);
const styled = new Set(
  [...css.matchAll(/\.tok-([a-z]+)/g)].map((m) => m[1])
);

if (emitted.size === 0) {
  console.error("FAIL: no token types found in blog.js — the pattern list moved?");
  process.exit(1);
}

const missing = [...emitted].filter((t) => !styled.has(t));
const orphan = [...styled].filter((t) => !emitted.has(t));

if (missing.length) {
  console.error(`FAIL: highlighter emits unstyled classes: ${missing.map((m) => `.tok-${m}`).join(", ")}`);
  process.exit(1);
}

if (orphan.length) {
  console.warn(`note: styled but never emitted: ${orphan.map((o) => `.tok-${o}`).join(", ")}`);
}

console.log(`ok: ${emitted.size} token classes, all styled (${[...emitted].map((e) => `.tok-${e}`).join(" ")})`);
