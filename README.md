# Tesfatseyon Merkinh - Portfolio

Personal website for **Tesfatseyon Merkinh** - full-stack web developer and
short-form video editor based in Wolaita-Sodo, Ethiopia.

**Live site:** https://tesfatseyon.dev

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Editing content](#editing-content)
- [Writing a blog post](#writing-a-blog-post)
- [Tooling and scripts](#tooling-and-scripts)
- [Deployment](#deployment)
- [Performance and security](#performance-and-security)
- [Contact](#contact)

---

## Highlights

- **Two professional modes** - Web Developer and Video Editor, each with its
  own hero, resume, skills, services, and projects. Switching modes is a
  single `config.js` object, not a menu of conditionals.
- **Real case studies** - every project card opens a written problem,
  approach, outcome, and reflection, not a screenshot and a star count.
- **Clean URLs** - `BrowserRouter` with a Vercel SPA rewrite, so real routes
  like `/web` and `/video` survive hard refreshes (no `/#/web`).
- **Markdown blog** - posts live in `src/content/posts/*.md` and become
  static route chunks at build time. No backend, no CMS, no fetch. Post
  *metadata* is separated from post *bodies*, so the command palette can
  search every post without the entry bundle carrying the whole blog.
- **Generated feeds** - `sitemap.xml` and `rss.xml` are emitted during
  `npm run build` from the same frontmatter the pages render, under the
  same publishability rule, so the feeds can never drift from the content.
- **Per-route SEO** - title, description, canonical, Open Graph, article tags,
  and JSON-LD are updated on every navigation, not just the first paint.
- **Command palette** - press `Ctrl`/`Cmd` + `K` to search every page,
  section, project, article, and social link from anywhere on the site.
- **Editorial light design** - warm paper, near-black ink, and one
  saturated accent per discipline. The palette is fixed at the token
  level: no theme switcher, no localStorage, no flash of the wrong theme.
- **Motion that behaves** - a scroll reveal, a reading-progress rule and
  an availability dot, nothing else. All of it collapses to static for
  `prefers-reduced-motion`, and no content moves on its own.
- **Downloadable resumes** - both CV PDFs are generated from the source
  `.docx` files by one script with a single shared contact block, each tinted
  with the accent of the mode it belongs to. Both preview in a focus-trapped
  modal.
- **Accessible by default** - skip link, focus traps, focus restoration,
  `aria-live` route announcements, combobox semantics, and
  `prefers-reduced-motion` support throughout.
- **No UI library, no CSS framework, no state manager** - React plus one
  hand-written stylesheet, tokenised through CSS custom properties.

## Tech stack

| Layer      | Choice                                                  |
|------------|---------------------------------------------------------|
| Framework  | React 19 + Vite 7                                       |
| Routing    | React Router v7 (`BrowserRouter`)                       |
| Styling    | Plain CSS with custom properties (tokenised theme)      |
| Fonts      | Instrument Serif, Inter, JetBrains Mono                 |
| Linting    | Oxlint                                                   |
| Deployment | Vercel (SPA rewrite + security headers)                 |

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:5173
npm run build      # production build into dist/ (also writes sitemap.xml + rss.xml)
npm run preview    # serve the production build locally
npm run lint       # run Oxlint
```

`npm run build` is the only command needed for a deployable artifact; the
feed generation is a Vite plugin and runs as part of the build. The build also
runs `npm run check:content` first, which fails it if the highlighter and
stylesheet disagree on a token class name, or if a project's `study` id points
at a case study that does not exist. Both are silent-failure bugs otherwise —
see [Syntax highlighting](#syntax-highlighting) and
[Why the case studies are split out](#why-the-case-studies-are-split-out).

## Project structure

```
portfolio/
├── index.html            HTML shell: fonts, meta, static Person JSON-LD,
│                         RSS/sitemap links, PWA manifest
├── package.json          run scripts + dependencies (React, Router, Vite, Oxlint)
├── vite.config.js        React plugin, feed plugin, vendor/manual chunk split
├── .oxlintrc.json        linter config (React rules)
├── vercel.json           build command, SPA rewrite, Cache-Control, CSP and
│                         security headers
│
├── public/               copied verbatim into dist/
│   ├── me.webp           profile photo, 15 kB (me.jpg is the fallback tier)
│   ├── me.jpg            profile photo fallback, 31 kB
│   ├── og.jpg            1200x630 social share card
│   ├── favicon.svg       site favicon
│   ├── apple-touch-icon.png  180x180 iOS home-screen icon
│   ├── icon-512.png      512x512 PWA icon (standard + maskable)
│   ├── manifest.webmanifest  PWA manifest with /web and /video shortcuts
│   ├── robots.txt        crawl rules + sitemap URL
│   ├── 404.html          static fallback page
│   ├── CV-Tesfatseyon-Web-Developer.pdf    generated from the web .docx
│   ├── CV_Tesfatseyon_VideoEditor.pdf      generated from the video .docx
│   └── backgrounds/      per-section textured background images
│       ├── hero-bg.jpg
│       ├── about-bg.jpg
│       ├── work-bg.jpg
│       └── contact-bg.jpg
│
├── build/
│   └── seo-feed.js       Vite plugin: emits dist/sitemap.xml + dist/rss.xml
│                         from the post frontmatter at build time
│
├── tools/                development helpers (Python + Node, run from repo root)
│   ├── build_resumes.py  regenerate BOTH resume PDFs from the .docx sources
│   ├── make_icons.py     regenerate the PNG icons from the brand gradient
│   ├── read_cv.py        dump a .docx source's text to the console
│   ├── dump_pdf.py       diff a served PDF against its .docx source
│   ├── build_post_index.mjs  regenerate src/content/posts.index.json
│   ├── check_tokens.mjs  assert the highlighter and stylesheet agree
│   ├── check_studies.mjs assert every project's `study` id resolves
│   └── check_posts.mjs   assert posts.index.json matches the .md frontmatter
│
└── src/
    ├── main.jsx          entry point
    ├── App.jsx           router, route focus management, error boundaries,
    │                     command palette mount points
    ├── config.js         site content - single source of truth for what a
    │                     card needs to render
    ├── hooks.js          scroll store, media queries, focus trap, section spy
    ├── PortfolioContext.js portfolio-mode context + usePortfolio() hook
    ├── PortfolioProvider.jsx the provider component (selects the mode)
    ├── index.css         entry point: imports the layered design system
    ├── styles/           the design system, split by responsibility
    │   ├── tokens.css      colour, type, spacing, motion
    │   ├── base.css        reset, typography, layout, shared controls
    │   ├── chrome.css      navigation, footer, floating controls
    │   ├── landing.css     the front door
    │   ├── portfolio.css   hero, work, about, services, toolkit, contact
    │   ├── blog.css        journal index, article, prose, code tokens
    │   └── overlays.css    command palette, CV preview, case study
    │
    ├── assets/           resume .docx sources (not bundled; PDFs are in public/)
    │
    ├── content/
    │   ├── case-studies.js     long-form project narrative, keyed by `study` id
    │   ├── posts.index.json    GENERATED post metadata (no bodies) — see below
    │   └── posts/              blog posts in markdown with YAML frontmatter
    │                           (bodies are imported lazily, one per post)
    │
    ├── lib/              framework-agnostic helpers
    │   ├── blog.js       post loading, heading extraction, safe markdown
    │   │                 renderer, syntax highlighter
    │   ├── frontmatter.js frontmatter parser (shared with the build plugin)
    │   ├── palette.js    command-palette open state (useSyncExternalStore)
    │   └── schema.js     JSON-LD builders (Person, BreadcrumbList, BlogPosting)
    │
    ├── pages/            route-level components (all lazy-loaded)
    │   ├── Landing.jsx        service chooser (choose Web or Video)
    │   ├── PortfolioPage.jsx  full per-mode page (skills, services, projects)
    │   ├── BlogIndex.jsx      featured post + tag-filterable archive
    │   └── BlogPost.jsx       article view: TOC, progress bar, copy-code,
    │                          prev/next navigation
    │
    └── components/       presentational + interactive components
        ├── Navbar.jsx          progress bar, scroll-spy, focus-trapped drawer
        ├── Footer.jsx
        ├── Hero.jsx            display claim, discipline index, stat strip
        ├── About.jsx           bio, facts, picture chain, section CTA
        ├── Services.jsx        per-mode service cards
        ├── TechStack.jsx       ruled toolkit index + capability groups
        ├── Projects.jsx        filterable work grid + case-study dialog
        ├── ProjectModal.jsx    full case-study dialog
        ├── Resume.jsx          credential strip + CV entry point
        ├── Contact.jsx         contact channels + validated email-composing form
        ├── TableOfContents.jsx generated outline with scroll-spy
        ├── Seo.jsx            per-route title/meta/canonical/OG/JSON-LD
        ├── CommandPalette.jsx Cmd+K searchable index (combobox semantics)
        ├── PaletteTrigger.jsx header button that opens the palette
        ├── StickyCTA.jsx      hire-me button that appears past the hero
        ├── FabControls.jsx    single floating scroll-to-top button
        ├── CvModal.jsx        focus-trapped resume preview
        ├── Reveal.jsx         scroll-triggered fade-up reveal
        ├── Icon.jsx           inline SVG icon set
        ├── RouteAnnouncer.jsx aria-live page-change announcements
        ├── NotFound.jsx       in-app 404 with a noindex directive
        ├── ErrorBoundary.jsx  route-level error recovery
        └── ErrorPage.jsx      dependency-free global fallback
```

## How it works

### Routing and modes

`App.jsx` declares three routes: `/` (landing chooser), `/web` and `/video`
(portfolio modes), plus `/blog` archive and `/blog/:slug` article pages. Each
mode is selected through `PortfolioProvider`, which picks the matching object
from `config.js`. All section components read the selected mode through
`usePortfolio()` - nothing is hardcoded per mode.

`App.jsx` also derives the accent mode from the URL in one place, so `/video`
carries the teal mode and every other route falls back to the orange
developer accent rather than rendering in monochrome.

### Content pipeline

1. Posts are authored as plain markdown with YAML frontmatter in
   `src/content/posts/`.
2. `src/lib/frontmatter.js` parses the frontmatter; `src/lib/blog.js` extracts
   headings (for the table of contents) and renders the body through a small
   hand-written markdown renderer - no third-party parsing library.
3. At build time, `build/seo-feed.js` reads the same frontmatter through the
   shared parser and emits `dist/sitemap.xml` and `dist/rss.xml`. Both apply
   the same publishability rule - a post needs a title and a valid `YYYY-MM-DD`
   date to appear anywhere - so the archive and the feeds always agree, and a
   malformed date can never render as "Invalid Date".

### Syntax highlighting

`src/lib/blog.js` emits `<span class="tok-key">` and friends; the stylesheets
in `src/styles/` style `.tok-key`, `.tok-str`, `.tok-num`, `.tok-com`, and
`.tok-fn`. Those
two lists are a contract, and they were once out of sync — the renderer emitted
`tok-keyword` / `tok-string` / `tok-number` / `tok-comment` while the
stylesheet defined the short forms, so every token fell through to the plain
`<pre>` colour and all code blocks looked flat. `npm run check:tokens` (wired
into `npm run build`) reads every file under `src/styles/` and fails the build
if the two ever drift apart again.

### Why the case studies are split out

`config.js` is imported by the eagerly-loaded command palette, so anything in
it is downloaded before the landing page paints. The case-study prose used to
live there too, which cost every first-time visitor ~19 kB of narrative they
could not read until they opened a project dialog. Moving it to
`src/content/case-studies.js` puts it in the lazily-loaded portfolio chunk
instead: the entry bundle stayed at 49 kB while the prose moved behind a
navigation the reader has already chosen to make.

The join between the two files is a plain `study` id. `ProjectModal` degrades
gracefully when a key is missing, so a typo would silently drop a case study
with no error anywhere — `npm run check:content` asserts all 15 ids resolve
1:1 and fails the build otherwise.

### Why the post bodies are split from the post index

The same bug, one level over, and it is worth knowing about because adding
blog posts makes it worse rather than better.

`blog.js` originally read every `.md` through an **eager** `import.meta.glob`,
so all post bodies were bundled wherever `blog.js` was imported. The command
palette needs to search posts and is mounted on every page — including the
landing route — so the entire blog shipped in the entry chunk. At 13 posts
that was 32 kB of Markdown, and it would have passed 200 kB by 50.

The fix splits metadata from body:

- `src/content/posts.index.json` — **generated**, committed, and holds only
  `slug`, `title`, `date`, `tags`, `excerpt` and `words`. 4.8 kB for 14
  posts. This is what the palette and the archive read.
- `src/content/posts/*.md` — imported **lazily**, one module per post, only
  by `BlogPost` for the slug actually being read. Each post is its own chunk
  of 1.5–4 kB.

The entry bundle went from 81.6 kB back to 48.5 kB, and adding a post now
costs the landing page nothing at all.

The index is committed rather than generated at build time so the app needs
no Vite plugin to run — which means it *could* drift, so
`npm run check:content` regenerates it in memory and fails the build on any
difference, naming the cause (new post, deleted post, or an edited title).

**After adding or editing any post, run:**

```bash
node tools/build_post_index.mjs
```

A post with no title or an invalid date is treated as a draft and stays out
of the index, the archive, the feeds, and the palette.

### SEO

- `index.html` ships a static `Person` JSON-LD block with `id="ld-json"` for
  crawlers that do not run JavaScript. `Seo.jsx` replaces that block
  in-place, so there is never more than one schema graph in the document.
- Every route sets an appropriate `@type`: `Person` on the landing page,
  `BreadcrumbList` on the static pages, and `BlogPosting` on articles.
- Unknown URLs render `NotFound.jsx`, which adds
  `<meta name="robots" content="noindex, follow">`.

### Theme

The site is light-only by design: warm paper (`#f3f0e7`), near-black ink and
one saturated accent per discipline. There is no theme toggle, no
`localStorage` read, and no pre-paint theme script - the palette is fixed at
the token level in `src/styles/tokens.css`, so the first paint is already
correct and there is no flash of the wrong theme. The only theming that changes
is the per-mode accent, set from the route in `App.jsx` and consumed through a
single RGB triple (`--accent-rgb`) that every tint derives from.

## Editing content

All content lives in **`src/config.js`**. The file is organised in clearly
named sections (profile, socials, nav, site SEO, modes) - most edits never
touch a component.

| Object             | Purpose                                             |
|--------------------|-----------------------------------------------------|
| `profile`          | name, contact details, photo, availability          |
| `company`          | the studio — name, role, services, locales, contact  |
| `socials`          | social profile URLs                                  |
| `navLinks`         | navbar and footer links                              |
| `routeLinks`       | routes shown in the navbar                           |
| `site.seo`         | landing-page title and meta description              |
| `modes.web`        | the entire web-developer page (bio, roles, stats,    |
|                    | skills, services, projects, resume, SEO)             |
| `modes.video`      | the entire video-editor page                         |

**The studio.** `company` is Tesfatseyon's company, Sunshine Tech Solution. Every
value in it — the five service lines, the six locales, the address, the contact
address — is taken from the company's own repository
(`src/data/site.ts` and `src/i18n.tsx`), not invented. It surfaces in four
places from that one object: the studio band on the landing page, the Studio
row in About, the Studio column in the footer, and `worksFor` in the Person
JSON-LD (both the runtime schema built by `src/lib/schema.js` and the static
block in `index.html`). Change the object and all four follow.

The studio's own site is also the **first project** on `/web` — it is the one
case that demonstrates the whole stack the services claim, end to end. Its
case study is sourced from the same repository: React + TypeScript + Vite +
Tailwind, six locales with Arabic RTL, and a build that typechecks before it
bundles.

**Adding a project** is two objects - a card in `config.js` and a case study
in `src/content/case-studies.js`, joined by the `study` id:

```js
// src/config.js
{
  category: "AI & SaaS",                    // must match projectCategories
  title:    "Project name",
  desc:     "One-sentence summary shown on the card.",
  tags:     ["React", "APIs"],
  gradient: ["#6366f1", "#818cf8"],
  accent:   "#6366f1",
  link:     "https://example.com",           // live demo, or null
  github:   "https://github.com/Tesfazion/…", // repository, or null
  study:    "project-name",                  // key into case-studies.js
}
```

```js
// src/content/case-studies.js  (keyed by the id above)
"project-name": {
  role:     "What you did.",
  problem:  "Why it existed.",
  approach: "How you solved it.",
  outcome:  "Measurable result.",
  highlights: ["Detail 1", "Detail 2"],
  learned:  "What you took away.",
},
```

The split is a bundle decision, not an organisational one: `config.js` is
imported by the eagerly-loaded command palette, so any prose left in it is
downloaded before the landing page paints. The narrative only matters inside
the case-study dialog, which lives in the lazily-loaded portfolio chunk.
Every case-study field except `role` is optional, and a project with no entry
in `case-studies.js` still renders its card and modal summary.

**Editing a mode's SEO:**

```js
modes.video.seo = {
  title: "Video Editor — Tesfatseyon Merkinh",
  description: "One or two sentences, ideally under 160 characters.",
};
```

## Writing a blog post

Create `src/content/posts/my-post.md`:

```markdown
---
title: My post title
date: 2026-09-28
tags: [React, Performance]
excerpt: One or two sentences used for the card, meta description, and RSS.
---

## First section

Body markdown. Markdown headings become the automatic table of contents.

```js
// Fenced code with a language label gets syntax highlighting.
const answer = await load();
```
```

A post needs a `title` and a valid `YYYY-MM-DD` `date` to be published
anywhere; without both it is treated as a draft and skipped by the archive,
the feeds, the palette, and the sitemap — which is the point, a half-written
draft should not reach the sitemap.

Then regenerate the post index and build:

```bash
node tools/build_post_index.mjs
npm run build
```

The post now appears in the archive, the sitemap, the RSS feed, and the
command palette. The index step is not optional — `npm run build` runs
`check:content` first and will fail telling you to run it, which is
deliberate: forgetting it is the one way this post could exist and never
appear anywhere.

## Tooling and scripts

The `tools/` directory holds small helpers for regenerating generated assets
and for guarding the hand-written highlighter against the stylesheet:

```bash
python tools/read_cv.py        # show a .docx resume source's text
python tools/build_resumes.py  # rebuild BOTH public/*.pdf resumes
python tools/make_icons.py     # rebuild the favicon/apple-touch/512 icons
python tools/dump_pdf.py public/CV_Tesfatseyon_VideoEditor.pdf
                              # diff a served PDF against its .docx source

node tools/build_post_index.mjs  # regenerate src/content/posts.index.json
                                 #  (required after adding or editing a post)

npm run check                  # all three content guards
npm run check:tokens           # highlighter classes vs. stylesheet classes
npm run check:content          # `study` ids vs. case-studies.js, and
                               # posts.index.json vs. the .md frontmatter
```

### Regenerating the resumes

Both PDFs come from `tools/build_resumes.py`, and the contact block is
defined once in that script and used by both. The `.docx` sources each carry
a stale placeholder email (`tesfatseyon16@email.com` — not a real domain)
and a truncated LinkedIn slug, so a visitor who downloaded the CV got an
address they could not reply to and a profile URL that 404s, contradicting
the contact details on the site itself.

The script has the corrected details. **The `.docx` files in `src/assets/`
still contain the old ones** — if you re-export a CV from Word, either fix
the header first or do not re-export over these PDFs.

If the CV content itself changes, update the constants at the top of
`build_resumes.py` and re-run it. `python tools/dump_pdf.py <pdf>` prints the
served PDF and its `.docx` source side by side for diffing.

## Deployment

### Vercel (recommended)

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Set **Root Directory** to `portfolio` (or deploy the root if this folder is
   the repository root).
4. `vercel.json` already carries the build command, the SPA rewrite, and the
   `Cache-Control` / security headers - no further configuration needed.
5. Add the custom domain under **Settings > Domains**.

Notes:

- The catch-all rewrite sends every unmatched path to `index.html`, so `/web`
  and `/video` keep working on hard refresh. Vercel checks the filesystem
  before applying rewrites, so files in `public/` (resumes, images) and the
  generated feeds are still served directly.
- Because the rewrite catches everything, an unknown path returns the SPA's
  404 view with a `200` status. The `noindex` meta on that route is what keeps
  it out of search results.

### GitHub Pages

GitHub Pages does not support rewrites. Switch `BrowserRouter` to
`HashRouter` in `src/App.jsx` if you deploy there; `/web` becomes `/#/web`.

## Performance and security

- **Vendor chunking** - React and the router live in their own long-lived
  chunks, so a content-only redeploy does not invalidate the cached vendor
  bundle.
- **Image tiers** - the profile photo ships as WebP (15 kB) with a JPEG
  fallback; the source PNG is kept out of the repo. Every interface icon is an
  inline SVG in `Icon.jsx`, so the toolkit grid and the social rows cost no
  extra requests.
- **Security headers** - `vercel.json` sends a strict Content Security Policy
  (self-only scripts, no frames, `upgrade-insecure-requests`), plus `nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive
  `Permissions-Policy`, and HSTS.
- **Offline-first 404** - `public/404.html` is a self-contained fallback for
  edge cases where the SPA has not booted yet.

## Contact

- Email: tesfatseyon16@gmail.com
- Telegram: https://t.me/Zizo1616
- GitHub: https://github.com/Tesfazion
- LinkedIn: https://www.linkedin.com/in/tesfatseyon-merkinh-becho-a38626402