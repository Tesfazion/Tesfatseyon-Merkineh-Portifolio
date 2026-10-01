---
title: "Why I stopped reaching for useEffect"
date: "2026-09-11"
tags: ["React", "Architecture"]
excerpt: "Most of the useEffect calls I used to write were syncing state to other state. React can derive that. Deleting the effect deletes a whole class of bug."
---

I used to open a component, see two pieces of state that depended on each
other, and reach for an effect. It worked, so I shipped it. Then I started
finding bugs that all had the same shape: **the screen was briefly wrong.**

## The effect that did nothing but compute

Here is a real one, shortened. A filter, a list, and a count:

```jsx
const [items, setItems] = useState([]);
const [query, setQuery] = useState("");
const [visible, setVisible] = useState([]);

useEffect(() => {
  setVisible(items.filter((i) => i.includes(query)));
}, [items, query]);
```

Two states, one derived from the other, and an effect to keep them in sync.
It also renders once with the wrong `visible`, because the effect runs after
paint. That flash is the bug you spend an afternoon on.

React can compute this during render. No effect, no sync, no flash:

```jsx
const visible = items.filter((i) => i.includes(query));
```

One state instead of two. The dependency array that could be wrong is gone,
because there is no longer a moment where the two can disagree.

## The test I now apply

Before writing an effect, I ask what kind of work it is:

- **Syncing state to other state** — you almost certainly want a computed
  value during render instead.
- **Responding to the outside world** — a subscription, a timer, an event
  listener, a manual DOM measurement. This is what effects are for.
- **Running after a render for its own sake** — usually a bug or a
  `useLayoutEffect` in disguise.

Most of my effects are the second kind. Network calls, scroll listeners, the
carousel. None of them are the first kind, any more.

## Why this is also an architecture thing

Deleting state is not a micro-optimisation. Every piece of state you delete
is a source of truth you no longer have to reason about, and the
architecture of a component is just the sum of its sources of truth. The
[structure post](/blog/react-project-structure) covers where the boundaries
go; this is the same instinct applied one level down.

The practical result: fewer re-render passes, no intermediate states to
debug, and code that is correct on the first paint instead of the second.
