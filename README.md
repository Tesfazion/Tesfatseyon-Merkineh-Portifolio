# Tesfatseyon Merkinh | Portfolio

<div align="center">

[![Live Site](https://img.shields.io/badge/Live-Site-0F172A?style=for-the-badge&logo=vercel&logoColor=white)](https://tesfatseyon.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Build](https://img.shields.io/badge/Build-Production-22C55E?style=for-the-badge)](https://tesfatseyon.dev)

</div>

Software engineer and product-minded builder focused on creating fast, thoughtful digital products. This portfolio highlights my work across web development, product execution, and content-driven storytelling, with a clear emphasis on practical impact and modern engineering.

Live site: https://tesfatseyon.dev

## Overview

I built this portfolio to present a strong technical and product identity across two complementary disciplines:

- Full-stack web development
- Video editing and content production

The result is a single platform that communicates both engineering depth and creative execution, while staying lightweight, accessible, and easy to maintain.

## What this project includes

- Product-style portfolio experience with strong positioning
- Two professional modes: web development and video editing
- Clean navigation, polished layout, and strong visual consistency
- Searchable command palette for content discovery
- Detailed case studies with structured outcomes and implementation context
- Markdown-based blog with generated metadata and feed support
- SEO-focused structure and schema-ready pages
- Downloadable CV/resume assets
- Responsive, accessible, and performance-conscious front-end

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Custom CSS with design tokens |
| Content | Markdown + structured JS content |
| Linting | Oxlint |
| Deployment | Vercel |

## Project Structure

```text
portfolio/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── public/
│   ├── CV-Tesfatseyon-Web-Developer.pdf
│   ├── CV_Tesfatseyon_VideoEditor.pdf
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── backgrounds/
├── build/
│   └── seo-feed.js
├── tools/
│   ├── build_post_index.mjs
│   ├── build_resumes.py
│   ├── check_posts.mjs
│   ├── check_studies.mjs
│   ├── check_tokens.mjs
│   ├── dump_pdf.py
│   ├── make_icons.py
│   └── read_cv.py
├── src/
│   ├── App.jsx
│   ├── components/
│   ├── config.js
│   ├── content/
│   ├── hooks.js
│   ├── lib/
│   ├── main.jsx
│   ├── pages/
│   ├── styles/
│   └── index.css
└── README.md
```

## Getting Started

### Requirements

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

### Common commands

```bash
npm run dev       # run the app locally
npm run build     # create a production build
npm run preview   # preview the production build
npm run lint      # run lint checks
npm run check     # validate content and build assumptions
```

## Architecture

The codebase is structured around maintainability and product clarity:

- `src/config.js` centralizes the main content and portfolio configuration.
- `src/content/case-studies.js` holds deeper project narratives and outcomes.
- `src/content/posts/` contains the Markdown-based blog content.
- `public/` stores generated assets, resumes, and static files.
- `tools/` contains automation for content validation and generated outputs.

This separation keeps the site fast, modular, and easy to evolve as the work grows.

## Blog workflow

Posts are written in Markdown with frontmatter, for example:

```md
---
title: My Post Title
date: 2026-09-28
tags: [React, Performance]
excerpt: A short summary used in the archive and feed.
---
```

After creating or editing a post, regenerate the index:

```bash
node tools/build_post_index.mjs
```

## Quality and automation checks

```bash
python tools/build_resumes.py      # regenerate resume PDFs
python tools/make_icons.py        # regenerate icon assets
python tools/read_cv.py           # inspect source CV content
node tools/build_post_index.mjs   # rebuild blog metadata
npm run check                     # run project validation checks
npm run check:tokens              # verify syntax highlighting contract
npm run check:content             # validate content references and integrity
```

## Deployment

This project is configured for Vercel deployment.

### Recommended setup

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Keep **Root Directory** at the repository root; it contains `package.json`
   and `vercel.json`.
4. Vercel uses `npm ci` and the build/output settings in `vercel.json`.

The app includes SPA routing and the necessary production security headers through `vercel.json`.

No environment variables are required. If you add secrets later, configure
them in Vercel's project settings instead of committing them; local `.env`
files are ignored by Git.

## Accessibility and performance

This portfolio was built with a product mindset and engineering discipline:

- accessible structure and interaction patterns
- reduced-motion support
- performance-conscious asset strategy
- maintainable CSS system and reusable patterns
- structured metadata and SEO-friendly architecture

## Contact

For work, collaboration, or product opportunities:

- Website: https://tesfatseyon.dev
- Web portfolio: https://tesfatseyon.dev/web
- Video portfolio: https://tesfatseyon.dev/video

## License

This project is intended for personal portfolio use and is not meant for public redistribution without permission.
