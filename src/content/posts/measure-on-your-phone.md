---
title: "Measure on the phone you actually own"
date: "2026-09-26"
tags: ["Web Development", "Craft"]
excerpt: "Lighthouse on a fast laptop in a quiet office is a measurement of the machine, not the page. The only number that matters is the one on a real mid-range phone."
---

I used to run Lighthouse, get a 98, and call the work done. Then I opened
the same site on my own phone — a mid-range Android I've owned for three
years, on mobile data, standing outside — and it felt like a different site.

Same build. Same number in the report. Both true, and only one of them
useful.

## Why the report flatters you

A Lighthouse run on a developer machine measures a machine with an SSD, a
fast CPU, and no throttling anxiety. The score is real, but it describes
the environment as much as the page. It answers *is this code reasonable?*
It does not answer *does this load on a real device?*

The gap between those two is where users actually live.

## The three things I actually check

**Time to first tap, not time to first paint.** What matters is when the
page stops being a spinner. On a real device this is usually dominated by
one oversized image and a blocking font, not by your JavaScript.

**Layout shift while reading.** The number people feel without noticing.
Reserve space for anything that loads late — images, ads, embeds, fonts.
On a narrow screen with a slow connection, an unsized image will move the
paragraph you are halfway through.

**Weight per page, honestly counted.** One number, from the browser, on
mobile data. I stopped trusting a total from a build report once I realised
it was counting chunks the visitor never loaded.

## What that changed

Two fixes came out of measuring properly, and neither was exotic:

- The hero image was a 280 kB JPEG served to a phone that was already
  downloading a WebP. Right format, wrong assumption about the device.
- A font was blocking first paint for text that could have rendered in the
  system stack immediately.

> A performance budget is a constraint you agreed to, not a score you
> reported.

Both were invisible in a 98. Both were obvious on a phone. That gap is the
entire reason I care about measuring on the device rather than the report.

It is the same discipline as the editing side of this site: the export
preset is a decision, the file that reaches the viewer is the one that
counts. I wrote more about testing against something real in
[why this portfolio links to real code](/blog/real-code-not-claims).
