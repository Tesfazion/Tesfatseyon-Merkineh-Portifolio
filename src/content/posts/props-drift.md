---
title: "Props drift: the bug that hides inside a refactor"
date: "2026-09-11"
tags: ["React", "Architecture"]
excerpt: "Nothing throws. Nothing goes red. The component just quietly stops receiving what it needs, and you find out weeks later from a user."
---

The worst React bugs I've shipped were the ones that didn't announce
themselves. No stack trace, no failed test, no error in the console. Just
a component quietly rendering something slightly wrong for six weeks.

Almost all of them came from the same place: I renamed a prop, changed
where a piece of data lived, or made a field optional — and didn't follow
every consumer.

## How it actually happens

Here's a real shape of it. A project card gets a new field:

```jsx
// Before
function ProjectCard({ title, desc, tags }) { /* ... */ }

// After a "cleanup" that reads as harmless
function ProjectCard({ project }) { /* ... */ }
```

You change the definition. You change the one component you were looking
at. The other four consumers are now passing `title` and `desc` to a
component that no longer reads them.

React doesn't warn about this. Unused props are not an error. The card
renders with an empty title, and because the prop was `undefined` rather
than missing, there's no exception to send you looking.

## The refactor that made it worse

Here's the part that cost me the most time. I didn't type the wrong name.
I renamed a field in one place and a *different* field somewhere else,
and both were valid at the moment each change was made.

```jsx
// config.js — the new shape
{ title: "Hotel site", summary: "Responsive hotel design site." }

// The consumer I forgot
<p>{project.desc}</p>   {/* was correct yesterday */}
```

Each individual commit is green. The system is broken. This is the
signature of a bug that lives in *architecture* rather than in code.

## What I do now

Three things, in order of how much they've saved me.

**Make the shape hard to get wrong.** If a card needs four fields, take
one object, not four props. Then there's exactly one thing to pass and
one place to look. Renaming a field inside that object is a rename; you
can't get the wiring wrong, because there is no wiring.

**Let the linter find it.** ESLint's `react/props-no-spreading` and
TypeScript's `exactOptionalPropertyTypes` both catch classes of this that
a human review reliably misses. A plain-JS project can't lean on the
compiler, which is most of the reason I think a portfolio like this should
be TypeScript — not for the types people talk about, but for the fact that
it turns a silent refactor bug into a red squiggle.

**Grep for the old name before you commit.** This is the cheap one and it
catches most of it:

```bash
git grep -n "desc" -- src/
```

Ten seconds. It has saved me more than any amount of architecture.

## The tell

When a component renders *something* but it's emptier than it should be,
the bug is almost never inside the component. It's at the boundary — the
call site, the shape of the data, the prop that stopped being passed.

The component is fine. The contract between two files is broken, and
neither file is wrong on its own. That's the part that makes these bugs
slow to find: you're looking at the code that works.
