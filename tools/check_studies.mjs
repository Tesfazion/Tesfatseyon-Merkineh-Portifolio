/**
 * Asserts every project in config.js has a matching case study, and that
 * every case study is used by some project.
 *
 * ProjectModal falls back gracefully when a key is missing (the card and
 * modal summary still render), so a typo in a `study` id would never throw
 * and would never be caught by lint or the build -- the case study would
 * just silently never appear. This makes that failure loud instead.
 *
 * Usage:  node tools/check_studies.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const configSrc = readFileSync(join(ROOT, "src", "config.js"), "utf8");
const studiesSrc = readFileSync(join(ROOT, "src", "content", "case-studies.js"), "utf8");

const ids = [...configSrc.matchAll(/^\s*study:\s*"([^"]+)"/gm)].map((m) => m[1]);
const keys = new Set(
  [...studiesSrc.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map((m) => m[1])
);

if (ids.length === 0) {
  console.error("FAIL: no `study:` ids found in config.js -- did the field move?");
  process.exit(1);
}

const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
const missing = [...new Set(ids)].filter((id) => !keys.has(id));
const orphans = [...keys].filter((k) => !ids.includes(k));
let bad = false;

if (dupes.length) {
  console.error(`FAIL: duplicate study ids in config.js: ${[...new Set(dupes)].join(", ")}`);
  bad = true;
}
if (missing.length) {
  console.error(
    `FAIL: ${missing.length} project(s) point at a missing case study: ${missing.join(", ")}`
  );
  bad = true;
}
if (orphans.length) {
  console.error(`FAIL: unused case studies (dead weight in the bundle): ${orphans.join(", ")}`);
  bad = true;
}
if (bad) process.exit(1);

console.log(`ok: ${ids.length} projects, all ${keys.size} case studies matched 1:1`);
