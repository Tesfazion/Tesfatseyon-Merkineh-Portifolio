/**
 * blog.js — dependency-free markdown blog.
 *
 * Posts live in src/content/posts/*.md and are bundled at build time via
 * import.meta.glob (no fetch, no backend, static export friendly). Each
 * post starts with a YAML-ish frontmatter block; the body is a small,
 * safe subset of Markdown rendered by renderMarkdown below.
 *
 * Rendering escapes everything first, then applies formatting tokens, so
 * post content can never inject raw HTML. On top of that, link targets are
 * run through an explicit protocol allowlist — escaping alone would still
 * let a `[x](javascript:…)` URL through, which is a real XSS vector once
 * the output is injected with dangerouslySetInnerHTML.
 *
 * parseFrontmatter is shared with the build-time sitemap/RSS plugin so the
 * generated feeds can never disagree with the pages they point at.
 */
import { parseFrontmatter } from "./frontmatter";
import postIndex from "../content/posts.index.json";

/* Post bodies are imported LAZILY, one module per post, and only by the post
   page that is open. Metadata — title, date, tags, excerpt, word count — is
   read from the generated index instead, because the command palette needs
   it on every page and used to drag the entire blog into the entry bundle.
   Regenerate the index with: node tools/build_post_index.mjs */
const loaders = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
});

/* Stable, collision-free-ish anchor for a heading. */
export function slugifyHeading(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 64) || "section"
  );
}

/* A post is only publishable if it has a title and a real ISO date. The
   index generator and the build plugin apply the same rule, so a post can
   never appear in the archive while silently missing from sitemap.xml and
   rss.xml — and a malformed date can never reach a toLocaleDateString
   call, which would render "Invalid Date" on the page. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function getAllPosts() {
  return postIndex
    .filter((p) => p.title && p.title !== "Untitled" && ISO_DATE.test(p.date))
    .map((p) => ({ ...p }));
}

/* The body is fetched on demand, keyed by slug. Returns null for an unknown
   slug rather than throwing, so a bad URL renders the not-found view. */
export function getPostContent(slug) {
  const load = loaders[`../content/posts/${slug}.md`];
  if (!load) return Promise.resolve(null);
  return load().then((raw) => {
    const { body } = parseFrontmatter(raw);
    return { slug, body, headings: extractHeadings(body) };
  });
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug) || null;
}

/* Neighbouring posts, so a reader always has somewhere to go next. */
export function getPostNeighbours(slug) {
  const all = getAllPosts();
  if (all.length < 2) return { prev: null, next: null };
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: all[(i - 1 + all.length) % all.length],
    next: all[(i + 1) % all.length],
  };
}

/* Rough reading time — a static site can't do analytics, so be honest. */
export function readingTime(post, wpm = 190) {
  const words = post?.words || 0;
  return Math.max(1, Math.round(words / wpm));
}

/* Every tag across all posts, most-used first — powers the blog filters. */
export function getAllTags() {
  const counts = new Map();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/* ── Tiny markdown renderer ─────────────────────────────── */

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Escaping is not enough for href: block every scheme except the few we
   actually author, so a stray link can never become script execution. */
const SAFE_SCHEME = /^(https?:|mailto:|tel:|#|\/)/i;

function safeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Protocol-relative and relative URLs are fine; anything with an
  // explicit scheme must be on the allowlist.
  if (SAFE_SCHEME.test(trimmed)) return trimmed;
  return null;
}

function isExternal(url) {
  return /^https?:\/\//i.test(url.trim());
}

function inline(raw) {
  let s = esc(raw.trim());
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
    const url = safeUrl(href);
    if (!url) return text; // drop the link, keep the words
    if (isExternal(url)) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return `<a href="${url}">${text}</a>`;
  });
  return s;
}

/* Headings of depth 2-4, matching the ids renderMarkdown emits (# is
   promoted to h2, so it has no entry of its own). Used by the table of
   contents, so the two must stay in sync — when these were 2-3, a #### in
   a post got a real anchor in the article that never appeared in the
   sidebar, with no way to jump to it. */
function extractHeadings(markdown) {
  const out = [];
  const used = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    const m = /^\s{0,3}(#{2,4})\s+(.*)$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "").trim();
    let id = slugifyHeading(text);
    const seen = used.get(id) || 0;
    used.set(id, seen + 1);
    if (seen) id = `${id}-${seen}`;
    out.push({ id, text, depth: m[1].length });
  }
  return out;
}

export { extractHeadings };

export function renderMarkdown(src) {
  if (!src) return "";
  const lines = src.split(/\r?\n/);
  const out = [];
  let list = null;
  let codeBuf = null;
  let codeLang = "";
  let para = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (!list) return;
    const tag = list.type;
    out.push(
      `<${tag}>${list.items
        .map((it) => `<li>${inline(it)}</li>`)
        .join("")}</${tag}>`
    );
    list = null;
  };
  const flushAll = () => { flushPara(); flushList(); };

  const usedIds = new Map();
  const uniqueId = (text) => {
    const base = slugifyHeading(text.replace(/[*_`]/g, ""));
    const seen = usedIds.get(base) || 0;
    usedIds.set(base, seen + 1);
    return seen ? `${base}-${seen}` : base;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const fence = /^\s*```\s*([\w-]*)\s*$/.exec(line);
    if (fence) {
      flushAll();
      if (!codeBuf) {
        codeBuf = [];
        codeLang = fence[1] || "";
      } else {
        out.push(renderCodeBlock(codeBuf.join("\n"), codeLang));
        codeBuf = null;
        codeLang = "";
      }
      continue;
    }
    if (codeBuf) { codeBuf.push(line); continue; }

    if (/^\s*---+\s*$/.test(line)) { flushAll(); out.push("<hr />"); continue; }

    const heading = /^\s{0,3}(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      const level = heading[1].length === 1 ? 2 : heading[1].length;
      const inner = inline(heading[2]);
      const plain = heading[2].replace(/[*_`]/g, "");
      const id = uniqueId(plain);
      out.push(
        `<h${level} id="${id}" class="post-heading">` +
        `<a class="post-heading-anchor" href="#${id}" aria-label="Link to section: ${esc(plain)}">${inner}</a>` +
        `</h${level}>`
      );
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      flushAll();
      out.push(`<blockquote>${inline(line.replace(/^\s*>\s?/, ""))}</blockquote>`);
      continue;
    }

    const ul = /^\s*[-*]\s+(.*)$/.exec(line);
    const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const type = ul ? "ul" : "ol";
      if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
      list.items.push((ul || ol)[1]);
      continue;
    }

    if (line.trim() === "") { flushAll(); continue; }

    para.push(line);
  }

  flushAll();
  if (codeBuf) out.push(renderCodeBlock(codeBuf.join("\n"), codeLang));
  return out.join("\n");
}

/**
 * Minimal, dependency-free syntax highlighting.
 *
 * Token order matters: comments and strings are consumed first so their
 * contents can never be re-matched as keywords. Everything is escaped
 * before tokenising, so the result is safe to inject as HTML.
 */
const KEYWORDS = {
  js: "await async break case catch class const continue debugger default delete do else export extends finally for from function get if import in instanceof let new of return set static super switch this throw try typeof var void while with yield",
  ts: "abstract any as asserts await async boolean break case catch class const constructor continue declare default delete do else enum export extends finally for from function get if implements import in infer instanceof interface is keyof let module namespace never new number of private protected public readonly return satisfies set static string super switch symbol this throw try type typeof undefined unique unknown var void while yield",
  py: "and as assert async await break class continue def del elif else except finally for from global if import in is lambda match nonlocal not or pass raise return try while with yield",
  css: "important media supports keyframes import charset font-face",
  html: "",
  sh: "if then else fi for while do done case esac function return export local echo cd",
  json: "true false null",
};

const ALIASES = {
  javascript: "js",
  jsx: "js",
  tsx: "ts",
  typescript: "ts",
  python: "py",
  bash: "sh",
  shell: "sh",
  zsh: "sh",
  console: "sh",
  yml: "yaml",
};

/**
 * Minimal syntax highlighter.
 *
 * The token classes here are the contract with index.css — it styles
 * .tok-key / .tok-str / .tok-num / .tok-com / .tok-fn. They have to match
 * exactly: an earlier version emitted tok-keyword / tok-string / tok-number
 * / tok-comment, which matched no rule at all, so every code block rendered
 * as flat unstyled text while the feature looked present in the markup.
 *
 * Function calls are matched as a separate pass so the call sites read
 * differently from plain words. Everything else is left unstyled on
 * purpose — tinting more than this makes code harder to read.
 */
function highlight(code, lang) {
  const key = ALIASES[lang] || lang;
  const words = (KEYWORDS[key] || "").split(" ").filter(Boolean);
  if (!words.length) return esc(code);

  const wordRe = new RegExp(`\\b(${words.join("|")})\\b`, "g");
  const patterns = [
    ["com", /\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*/],
    ["str", /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/],
    ["num", /\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b/i],
    ["key", wordRe],
    ["fn", /\b[A-Za-z_$][\w$]*(?=\s*\()/],
  ];

  let out = "";
  let i = 0;
  while (i < code.length) {
    let matched = false;
    for (const [type, re] of patterns) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i) {
        out += `<span class="tok-${type}">${esc(m[0])}</span>`;
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += esc(code[i]);
      i += 1;
    }
  }
  return out;
}

/**
 * A code block with a language label and a copy button.
 *
 * The button carries no code itself — the delegated click handler in
 * BlogPost reads `textContent` off the sibling <code>, so the snippet is
 * never duplicated into an attribute.
 */
function renderCodeBlock(code, lang) {
  const label = lang || "text";
  return (
    `<div class="code-block" data-lang="${esc(label)}">` +
    `<div class="code-block-bar">` +
    `<span class="code-block-lang">${esc(label)}</span>` +
    `<button type="button" class="code-copy" data-copy-code aria-label="Copy code to clipboard">Copy</button>` +
    `</div>` +
    `<pre><code class="language-${esc(label)}">${highlight(code, label)}</code></pre>` +
    `</div>`
  );
}
