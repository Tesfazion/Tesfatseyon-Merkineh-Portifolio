---
title: "I set a bundle budget and immediately found 19 kB of dead weight"
date: "2026-09-27"
tags: ["Web Development", "Architecture", "Craft"]
excerpt: "I'd been reading bundle sizes for years and never once asked a simple question: does any of this arrive before the visitor can see it?"
---

I rebuilt this site's landing page recently and it was 66 kB of
JavaScript. That number is not impressive on its own, so I did what I
should have done months earlier and asked where it all came from.

Nineteen kilobytes of it was case-study prose — a few thousand words of
project write-ups — sitting in the main config file, and therefore
downloaded by every first-time visitor before the landing page had
finished painting.

None of them would ever read it on that visit.

## Why it was there

Not carelessness. A reasonable sequence of decisions, each of which made
sense on its own:

1. Project data goes in one config file, so it's easy to edit.
2. The config file holds the project summaries.
3. The config file also holds the long-form write-ups, because they
   *belong* with the project.
4. Something eager — in my case the command palette, which needs to
   search project titles — imports that config file.
5. Therefore the write-ups are in the critical path.

Step 3 is defensible. Step 4 is completely reasonable. The result is the
kind of thing that happens when nobody looks at the output.

## The fix wasn't clever

The prose only matters inside the project dialog, and the dialog only
exists on `/web` and `/video`. Both are already lazy-loaded routes. So
the prose belongs in a module those routes import, not in one they share
with everything.

```
src/config.js                 project cards, eager (palette needs it)
src/content/case-studies.js   the prose, lazy (only the dialog needs it)
```

The two are joined by a plain string id. That's the entire mechanism.

The landing page went from 66 kB to 49 kB, and nobody can tell anything
is different — the content is still there, it just arrives when it's
relevant.

## The part that took longer than the fix

Splitting the file was an afternoon's work. The thing I almost didn't do
was stop the problem coming back.

The failure mode is silent. A missing id doesn't throw; the modal just
renders without its narrative. Nothing in the build complains. So I
added a check that runs before the bundle is written:

```
ok: 15 projects, all 15 case studies matched 1:1
```

It fails the build on an unmatched id, a duplicate, or an unused entry.
It's about thirty lines of text comparison, and it converts a bug that
would surface as "the about section looks a bit thin" into a build
error.

## What I'd tell my past self

Measure the thing, then ask a question the number doesn't answer.

"66 kB" is a number. "Nineteen kilobytes of case studies arrive before
anyone can see a case study" is a *problem*, and it's the only sentence
that changed the code. The first number is a measurement; you have to do
the second half of the work yourself.

And once you've found it, add the check. A performance fix that nothing
enforces is a performance fix that quietly expires the next time someone
adds a field to a config file at 11pm.
