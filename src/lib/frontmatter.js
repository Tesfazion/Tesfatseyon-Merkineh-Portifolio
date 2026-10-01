/**
 * Frontmatter parsing, shared between the app and the build-time SEO
 * plugin.
 *
 * Deliberately not a YAML library: the posts use a flat "key: value"
 * header with one inline-array field (tags). Pulling in js-yaml for that
 * would add a runtime dependency to satisfy a shape we control, and the
 * plugin needs the exact same parse the app does — if the two ever drift,
 * the sitemap and RSS disagree with the pages they point at.
 */

export function parseFrontmatter(raw) {
  const fm = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+?/.exec(raw);
  if (!fm) return { meta: {}, body: raw.trim() };

  const meta = {};
  for (const line of fm[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    }
    if (value) meta[key] = value;
  }

  return { meta, body: raw.slice(fm[0].length).trim() };
}
