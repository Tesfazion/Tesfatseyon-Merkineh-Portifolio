/**
 * Seo — sets document title, meta description, robots, canonical and
 * social tags for the current route, plus JSON-LD and article metadata
 * for blog posts.
 *
 * index.html ships sensible defaults for the landing page so crawlers
 * and link previews get something correct on a cold load. This component
 * overrides them per route, because a SPA that never touches document.head
 * makes /web, /video and every blog post look identical to crawlers.
 *
 * Two details worth keeping:
 *  • `noindex` is applied as a *removal* of the index tag, not by adding a
 *    second one. Two conflicting robots metas is worse than either alone.
 *  • article:tag is rebuilt from scratch on every change, and never via
 *    a selector built from user content (tags can contain quotes).
 */

import { useEffect } from "react";
import { site } from "../config";

const setMeta = (selector, attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const removeMeta = (selector) => {
  document.head.querySelectorAll(selector).forEach((el) => el.remove());
};

/* setMeta is intentionally single-element: `og:*` and `description` are
   a single tag each, and reusing the node avoids duplicates. Repeating
   tags (`article:tag`) need this instead, or every call after the first
   just overwrites the same element. */
const addMeta = (attr, key, content) => {
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  document.head.appendChild(el);
};

export default function Seo({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
  image = "/og.jpg",
  imageAlt,
  noindex = false,
  jsonLd,
}) {
  const tagsKey = tags.join(",");

  /* Computed in render scope, not inside the effect: the effect below
     lists it as a dependency, and a value declared inside the callback is
     not in scope for that array. */
  const url = `${site.url}${path}`;
  const imageUrl = image?.startsWith("http") ? image : image ? `${site.url}${image}` : "";

  useEffect(() => {
    if (title) document.title = title;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    if (imageUrl) {
      setMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
      setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", imageAlt || title);
    }

    /* Indexing: the canonical link is only meaningful for pages that
       should be indexed, so 404s drop it as well as setting noindex. */
    if (noindex) {
      removeMeta('meta[name="robots"]');
      setMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
      removeMeta('link[rel="canonical"]');
    } else {
      setMeta('meta[name="robots"]', "name", "robots", "index, follow");
      /* Recreate it if a previous noindex route (e.g. a direct load of
         the 404 page) removed it — otherwise every client-side
         navigation away from that route inherits no canonical at all. */
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
    }

    /* Article extras (blog posts) — cleaned up on every change so a
       post never leaks its tags into the next route. */
    if (type === "article") {
      if (publishedTime) {
        setMeta('meta[property="article:published_time"]', "property", "article:published_time", publishedTime);
      }
      if (modifiedTime) {
        setMeta('meta[property="article:modified_time"]', "property", "article:modified_time", modifiedTime);
      }
      removeMeta('meta[property="article:tag"]');
      (tagsKey ? tagsKey.split(",") : []).forEach((tag) =>
        addMeta("property", "article:tag", tag)
      );
    }

    return () => {
      removeMeta('meta[property="article:tag"]');
      removeMeta('meta[property="article:published_time"]');
      removeMeta('meta[property="article:modified_time"]');
    };
  }, [title, description, url, type, publishedTime, modifiedTime, imageUrl, imageAlt, tagsKey, noindex]);

  /* JSON-LD is injected as a single managed node so a route change can
     never leave two conflicting schema graphs in the document. */
  useEffect(() => {
    const ID = "ld-json";
    const existing = document.getElementById(ID);

    if (!jsonLd) {
      existing?.remove();
      return;
    }

    const node = JSON.stringify(jsonLd);
    if (existing) {
      if (existing.textContent !== node) existing.textContent = node;
      return;
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = ID;
    script.textContent = node;
    document.head.appendChild(script);
  }, [jsonLd]);

  return null;
}
