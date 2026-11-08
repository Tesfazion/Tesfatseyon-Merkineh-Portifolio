/**
 * hooks.js — shared behaviour: scroll utilities, media queries, focus
 * management, and the small animation hooks used across the site.
 *
 * Two things here are worth knowing about:
 *
 *  • Scroll position comes from ONE shared rAF-throttled listener. Several
 *    components need scrollY (nav frosted-glass, read progress, the
 *    floating controls); each with its own listener they would each force
 *    a layout read on every scroll event, which is the classic jank bug.
 *
 *  • Nothing here runs on a timer any more. The only motion left is the
 *    CSS reveal, which the reduced-motion query in base.css switches off;
 *    the typewriter and count-up hooks were removed with the redesign
 *    rather than left behind as dead code.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ── Shared scroll store ─────────────────────────────────── */

const scrollSubs = new Set();
let scrollY = 0;
let scrollMax = 1;
let rafId = 0;

function measure() {
  rafId = 0;
  scrollY = window.scrollY || window.pageYOffset || 0;
  const doc = document.documentElement;
  scrollMax = Math.max(1, doc.scrollHeight - window.innerHeight);
  for (const fn of scrollSubs) fn(scrollY, scrollMax);
}

function schedule() {
  if (!rafId) rafId = requestAnimationFrame(measure);
}

function subscribe(fn) {
  scrollSubs.add(fn);
  if (scrollSubs.size === 1) {
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  return () => {
    scrollSubs.delete(fn);
    if (scrollSubs.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }
  };
}

/** Fires with (scrollY, maxScroll) at most once per frame. */
export function useScrollPosition(onScroll) {
  const ref = useRef(onScroll);
  ref.current = onScroll;
  useEffect(() => subscribe((y, max) => ref.current?.(y, max)), []);
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold = 20) {
  const [past, setPast] = useState(false);
  useScrollPosition(useCallback((y) => setPast(y > threshold), [threshold]));
  return past;
}

/** Document read progress, 0-100. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useScrollPosition(
    useCallback((y, max) => setProgress(max > 0 ? (y / max) * 100 : 0), [])
  );
  return progress;
}

/* ── Environment ────────────────────────────────────────── */

function matchMediaSafe(query) {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  return window.matchMedia(query);
}

/** Subscribes to a media query and re-renders when it flips. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => matchMediaSafe(query)?.matches ?? false);

  useEffect(() => {
    const mq = matchMediaSafe(query);
    if (!mq) return;
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * True when the visitor has asked for reduced motion.
 *
 * Read live rather than once on mount: the OS setting can change while
 * the page is open, and these hooks drive JS timers CSS cannot stop.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/* ── Scrolling ──────────────────────────────────────────── */

export function scrollToId(id, block = "start") {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = matchMediaSafe("(prefers-reduced-motion: reduce)")?.matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block });
  // Moving focus too keeps keyboard and screen-reader users with the
  // content they just asked for; without it focus stays back at the nav.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}

/**
 * Scrolls to a section once it actually exists, polling on a short rAF
 * loop instead of guessing a fixed delay.
 *
 * Section links are reachable from routes that do not contain the section
 * at all (the navbar on /blog, the command palette on /web), so the click
 * has to navigate and only then scroll — and the target arrives whenever
 * its lazy chunk finishes loading. A setTimeout(…, 120) worked locally and
 * silently did nothing on a cold cache, because scrollToId no-ops on a
 * missing id and nothing reports the miss.
 *
 * Gives up after `timeout` ms so a genuinely absent id cannot leave a
 * rAF loop running forever.
 */
export function scrollToIdWhenReady(id, timeout = 2500) {
  if (scrollToId(id)) return;

  const deadline = performance.now() + timeout;
  let frame = 0;
  const tick = () => {
    if (scrollToId(id)) return;
    if (performance.now() > deadline) return;
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

/**
 * Returns a callback that jumps to a section, routing to the correct
 * portfolio mode first when the visitor is not already on one.
 *
 * The mode is the one currently displayed, not a hardcoded "/web": picking
 * "Work" from the command palette while reading the video portfolio used
 * to throw the reader onto the developer page. Falls back to `web` off a
 * portfolio route, where there is no better default.
 *
 * The route is derived from the path segment rather than read out of
 * config.js, deliberately: hooks.js is imported by every page, so importing
 * the content file here would pull all of it into the shared entry chunk.
 * The two must stay in sync — a mode's `key` is its path segment.
 */
export function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (id) => {
      if (pathname === "/web" || pathname === "/video") {
        scrollToId(id);
        return;
      }
      const mode = pathname.startsWith("/video") ? "video" : "web";
      navigate(`/${mode}`);
      scrollToIdWhenReady(id);
    },
    [navigate, pathname]
  );
}

/* Sets the accent mode on <html> for a route (data-mode="web"|"video").
   Removes it on unmount so shared pages fall back to the neutral accent. */
export function useMode(modeKey) {
  useEffect(() => {
    if (!modeKey) return;
    const root = document.documentElement;
    const prev = root.dataset.mode;
    root.dataset.mode = modeKey;
    return () => {
      if (prev) root.dataset.mode = prev;
      else delete root.dataset.mode;
    };
  }, [modeKey]);
}

/**
 * Highlights the section currently occupying the middle of the viewport.
 *
 * Shared so the navbar, the table of contents and any future in-page
 * nav all agree on which section is "current" instead of each running
 * their own observer with slightly different thresholds.
 */
export function useActiveSection(ids, { offset = 0.4 } = {}) {
  const [active, setActive] = useState("");

  /* Callers usually pass a fresh array literal, so depend on the joined
     ids instead of the array identity — otherwise the observer is torn
     down and rebuilt on every single render. */
  const key = ids.join("|");

  /* Anchor targets sit under the fixed header, so the reading line has
     to clear it or a section reads as "active" a screen early. */
  const offsetTop =
    offset * vh() + Number.parseFloat(cssVar("--nav-h") || "0");

  useEffect(() => {
    const els = key
      ? key.split("|").map((id) => document.getElementById(id)).filter(Boolean)
      : [];
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const visible = new Map();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry);
          else visible.delete(entry.target.id);
        }
        // Whichever tracked section sits closest to the reading line wins.
        const best = [...visible.values()].sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - offsetTop) -
            Math.abs(b.boundingClientRect.top - offsetTop)
        )[0];
        if (best) setActive(best.target.id);
      },
      {
        rootMargin: `-${offsetTop}px 0px -${Math.max(0, vh() - offsetTop - 1)}px 0px`,
        threshold: 0,
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [key, offsetTop]);

  return active;
}

const vh = () =>
  typeof window === "undefined" ? 800 : window.innerHeight;

const cssVar = (name) => {
  if (typeof document === "undefined") return "0";
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

/* ── Animation hooks ────────────────────────────────────── */

export function useInView(threshold = 0.15, { once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver the content would stay at opacity 0,
    // so show it immediately rather than hiding it forever.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}

/* ── Focus management ───────────────────────────────────── */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const visible = (el) =>
  !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

/**
 * Traps Tab focus inside a container while it is open, moves focus in on
 * open, and returns focus to whatever opened it on close.
 *
 * Without this, a keyboard user can tab straight out of an open drawer or
 * modal into the page behind, which is still visible and still reads.
 *
 * `onEscape` is held in a ref instead of being a dependency. Callers pass
 * inline arrows, so a dep on it would tear the trap down and rebuild it on
 * every parent render — and because the effect captures the opener, each
 * rebuild re-snapshots `document.activeElement` (already inside the dialog)
 * and then immediately restores focus to it. Escape still works: the
 * handler reads the live ref.
 */
export function useFocusTrap(active, containerRef, onEscape) {
  const returnTo = useRef(null);
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    returnTo.current = document.activeElement;

    // Focus the first sensible target, falling back to the container.
    const first =
      container?.querySelector("[data-autofocus]") ||
      container?.querySelector(FOCUSABLE);
    (first || container)?.focus?.({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        escapeRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !container) return;

      const items = [...container.querySelectorAll(FOCUSABLE)].filter(visible);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && (current === firstItem || current === container)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && current === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      returnTo.current?.focus?.({ preventScroll: true });
    };
  }, [active, containerRef]);
}

/**
 * Calls `handler` when a pointer is pressed outside every given ref.
 * Used by the command palette and the project detail modal.
 *
 * The handler is kept in a ref for the same reason as `useFocusTrap`:
 * inline arrows would otherwise re-bind the listener on every render.
 */
export function useClickOutside(refs, handler, active = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!active) return;
    const onDown = (e) => {
      const list = Array.isArray(refs) ? refs : [refs];
      if (list.some((r) => r.current?.contains(e.target))) return;
      handlerRef.current(e);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [refs, active]);
}
