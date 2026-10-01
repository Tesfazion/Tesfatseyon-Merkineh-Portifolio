---
title: "The API call that failed is still your interface"
date: "2026-09-24"
tags: ["React", "Web Development", "Craft"]
excerpt: "The happy path is the easy half. What your component renders when the request fails, times out, or returns nothing is the half most people never build."
---

Every interface I've ever built looked finished in the demo and fell apart
in production, and it was almost never the happy path. The happy path is
the easy half — you control the data, so you control the result.

The other half is what happens when the request fails, times out, or
returns something you didn't predict. That's still your interface. The
user doesn't know the difference between your bug and their wifi.

## The state you forgot to design

There are more than two. I keep a mental list:

- **Loading** — but long enough that a spinner alone becomes a lie. Past
  about a second, show what's coming.
- **Empty** — the request succeeded and returned nothing. Different from
  an error, and needs different words.
- **Partial** — some data, some missing. The nastiest one, because it
  looks like success.
- **Failed** — network, server, or a thrown exception.
- **Stale** — you had data, then a refresh failed. Don't throw away what
  the user is already looking at.

The "stale" case is the one I get wrong most. If a background refresh
fails, the correct behaviour is almost never to replace a populated
screen with an error page. Keep the content, mark it as not fresh, let
the user retry.

## Throwing away the error object

The most common React mistake I see is catching an error and rendering
`Something went wrong`. That string is technically true and completely
useless.

```jsx
// Useless: the user learns nothing and cannot act.
catch (err) {
  setError("Something went wrong");
}
```

What the user actually needs to know is whether retrying could work, and
what they should do next. A failed upload that was rejected for being too
large needs a different message than a dropped connection.

```jsx
catch (err) {
  // Keep the cause; decide what to say from it, not instead of it.
  if (err.name === "AbortError") return;          // we cancelled it
  if (err.status === 413) setError("That file is over the 5 MB limit.");
  else if (!navigator.onLine) setError("You're offline. Reconnect and retry.");
  else setError("Couldn't reach the server. Try again in a moment.");
}
```

The important part is that the error object survives all the way to the
branch that uses it. A `catch` that immediately discards `err` has thrown
away the only information you had.

## Loading state that doesn't flicker

One more thing worth fixing while you're in there. If a component mounts
and shows a spinner for 80 ms before its data arrives, the spinner
flickers — and the user's eye registers a stutter even if they can't
name it.

I delay the loading indicator slightly on purpose:

```jsx
const [showSpinner, setShowSpinner] = useState(false);

useEffect(() => {
  // Don't flash a spinner for requests that resolve quickly.
  const t = setTimeout(() => setShowSpinner(true), 150);
  return () => clearTimeout(t);
}, []);
```

150 ms is a guess, but the principle isn't: a fast response should look
instant, and only a slow one should look like work. The threshold is a
design decision, not an engineering one, which is exactly why it belongs
in the component rather than in a shared library.

## The test I actually run

Before I call a view done, I make it fail on purpose. I block the request
in devtools, I throttle to 3G, and I return an empty array from the mock.
Then I look at the screen.

If anything renders as a blank area, an unstyled `undefined`, or a raw
stack trace, the view isn't finished — regardless of how good it looks
with a real network.

The happy path is what you demo. The error paths are what your users
actually remember.
