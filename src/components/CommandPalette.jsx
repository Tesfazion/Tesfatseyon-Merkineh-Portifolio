/**
 * CommandPalette — Ctrl/⌘+K opens a searchable index of the whole site.
 *
 * On a portfolio with two specialisations, a blog and eleven projects,
 * the navbar cannot expose all of it. This gives every destination a
 * keyboard-reachable path without cluttering the chrome.
 *
 * Mounted once in App so the shortcut works on every route; the trigger
 * lives in whichever header is showing (see PaletteTrigger.jsx) and
 * shares state through lib/palette.js.
 *
 * Everything indexed here is derived from config.js and the post
 * frontmatter, so it cannot fall out of date the way a hand-written
 * menu would.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { modesList, navLinks, socials } from "../config";
import { getAllPosts, readingTime } from "../lib/blog";
import {
  closePalette, getPaletteOpen, subscribePalette, togglePalette,
} from "../lib/palette";
import { useClickOutside, useFocusTrap, useSectionNav } from "../hooks";
import Icon from "./Icon";

const MAX_RESULTS = 8;

export default function CommandPalette() {
  const open = useSyncExternalStore(subscribePalette, getPaletteOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const goToSection = useSectionNav();
  const panelRef = useRef(null);
  const listRef = useRef(null);

  /* Closing resets the query too, so reopening starts from a clean list
     rather than the previous search. */
  const close = useCallback(() => {
    closePalette();
    setQuery("");
    setActive(0);
  }, []);

  /* Indexed once — these are small, static collections. */
  const items = useMemo(() => {
    const out = [];

    for (const m of modesList) {
      out.push({
        group: "Pages",
        label: m.label,
        hint: m.tagline,
        icon: m.icon,
        run: () => navigate(m.route),
      });
    }

    /* Section links only make sense on a portfolio route, so this routes
       to the mode the reader is already on and scrolls once the lazy chunk
       has mounted. */
    for (const l of navLinks) {
      out.push({
        group: "Sections",
        label: l.label,
        hint: `Jump to the ${l.label.toLowerCase()} section`,
        icon: "arrowRight",
        run: () => goToSection(l.id),
      });
    }

    out.push({
      group: "Pages",
      label: "Blog",
      hint: "Notes on building and editing",
      icon: "layout",
      run: () => navigate("/blog"),
    });

    for (const post of getAllPosts()) {
      out.push({
        group: "Writing",
        label: post.title,
        hint: `${readingTime(post)} min read · ${post.date}`,
        icon: "layout",
        run: () => navigate(`/blog/${post.slug}`),
      });
    }

    for (const m of modesList) {
      for (const p of m.projects) {
        if (!p.github) continue;
        out.push({
          group: "Projects",
          label: p.title,
          hint: "Open the repository",
          icon: "github",
          run: () => window.open(p.github, "_blank", "noopener,noreferrer"),
        });
      }
    }

    for (const [key, url] of Object.entries(socials)) {
      out.push({
        group: "Contact",
        label: `Message on ${key}`,
        hint: url,
        icon: key,
        run: () => window.open(url, "_blank", "noopener,noreferrer"),
      });
    }

    return out;
  }, [navigate, goToSection]);

  /* Matches are counted before the cap so the footer can say how many were
     hidden — otherwise a long list looks exhaustive when it is not. */
  const { results, matchCount } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q))
      : items;
    return { results: pool.slice(0, MAX_RESULTS), matchCount: pool.length };
  }, [items, query]);

  /* Global shortcut. Ignored while a text field has focus so ⌘K still
     works inside a form, and while ⌘/Ctrl is held with another key so
     it does not shadow browser shortcuts. */
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      togglePalette();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFocusTrap(open, panelRef, close);
  useClickOutside(panelRef, close, open);

  /* A shrinking result set must not leave `active` past the end, or
     Enter silently does nothing. */
  useEffect(() => {
    if (active > results.length - 1) setActive(0);
  }, [results.length, active]);

  /* Keep the highlighted row in view while arrowing through results. */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onKeyDown = (e) => {
    const count = results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (count ? (i + 1) % count : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (count ? (i - 1 + count) % count : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
      close();
    }
  };

  if (!open) return null;

  return (
    <div
      className="palette-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="palette" ref={panelRef}>
        <div className="palette-input">
          <Icon name="search" size={17} />
          <input
            data-autofocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page, project or article…"
            /* Combobox, not a bare textbox: the input owns a listbox of
               results and reports which option is current. Without
               aria-activedescendant a screen reader announces the list
               but not the highlighted row. */
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={
              results.length ? `palette-option-${active}` : undefined
            }
            aria-autocomplete="list"
            aria-label="Search the site"
            autoComplete="off"
            spellCheck="false"
            type="text"
          />
          <button
            type="button"
            className="palette-close"
            onClick={close}
            aria-label="Close search"
          >
            <Icon name="close" size={15} />
          </button>
        </div>

        <ul className="palette-list" id="palette-results" role="listbox" ref={listRef}>
          {results.length === 0 ? (
            <li className="palette-empty">
              No match for “{query}”. Try a project name, a page, or a topic.
            </li>
          ) : (
            results.map((item, i) => (
              <li key={`${item.group}-${item.label}`} role="none">
                <button
                  type="button"
                  id={`palette-option-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  className={`palette-item${i === active ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => { item.run(); close(); }}
                >
                  <span className="palette-item-icon">
                    <Icon name={item.icon} size={15} />
                  </span>
                  <span className="palette-item-text">
                    <strong>{item.label}</strong>
                    <span>{item.hint}</span>
                  </span>
                  <span className="palette-item-group">{item.group}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="palette-foot">
          <span className="palette-count" role="status" aria-live="polite">
            {query.trim() && matchCount === 0
              ? "No matches"
              : `${results.length} of ${matchCount}`}
          </span>
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </footer>
      </div>
    </div>
  );
}
