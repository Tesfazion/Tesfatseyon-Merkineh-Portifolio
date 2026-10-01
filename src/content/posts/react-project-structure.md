---
title: "How I structure a React app that survives real projects"
date: "2026-09-18"
tags: ["React", "Web Development", "Architecture"]
excerpt: "Most React projects start fine and die of entropy. Here's the folder shape and the three rules I keep going back to on every client build."
---

Every React project starts clean. Two months later there's a
`Components/Final_v2/` folder and nobody knows which `button` is the
real one.

I've shipped enough client projects to stop trusting me — and start
trusting structure. These are the three rules I actually stick to.

## Rule one: code files, not opinion files

I never name files things like `MainPageFinal.tsx`. The filename
describes *what the code is*, not *which version it is*. Git is the
version history. Folders are the map.

```
src/
  components/   # presentational pieces
  features/     # one folder per business capability
  lib/          # pure logic, no JSX
  hooks/        # reusable behaviour
```

## Rule two: components own their styles

A component that only works when three other CSS files load is a bomb
waiting to blow up the rest of the page. Co-locating styles with the
component means a deletion is a deletion — nothing stale survives.

## Rule three: data flow is visible

If a screen reads from seven different places, no future-you will
understand it. I keep data access in one layer so that when the API
changes (it always does), there's exactly one file that changes too.

```js
// lib/api.js — the only file that knows the endpoint exists
const BASE = import.meta.env.VITE_API_URL;

export async function getProjects() {
  const res = await fetch(`${BASE}/projects`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`projects: ${res.status}`);
  return res.json();
}
```

A component imports `getProjects` and never sees a URL. Swap the API, mock
it in a test, or move it behind a worker — and no component changes. The
screen above it stays honest because it was never allowed to learn where
the data comes from.

> Structure isn't for the employer reading your repo.
> It's for the developer who opens it in six months — which is you.

## The payoff

Fast onboarding, safe refactors, and a project the client can hand to
their own team without a support contract. That's what "production
quality" actually means to me: code that survives contact with real
people and real deadlines.

Want to see the result instead of reading about it? Every project on
my [work](/web) page links to the real repository.