/**
 * App.jsx — root router.
 *
 * Every page chunk is lazy-loaded (React.lazy + Suspense) so the landing
 * page ships without pulling in the portfolio, blog, or 404 code.
 *
 * BrowserRouter (not HashRouter) so URLs read /web, /video and /blog/…
 * SPA rewrites for direct hits are handled by vercel.json.
 */
import { Suspense, lazy, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import CommandPalette from "./components/CommandPalette";
import RouteAnnouncer from "./components/RouteAnnouncer";
import ErrorPage from "./components/ErrorPage";
import { useMode } from "./hooks";

/* Page chunks */
const Landing       = lazy(() => import("./pages/Landing"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const BlogIndex     = lazy(() => import("./pages/BlogIndex"));
const BlogPost      = lazy(() => import("./pages/BlogPost"));
const NotFound      = lazy(() => import("./components/NotFound"));

function PageProgress() {
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      const bar = document.getElementById("page-progress-bar");
      if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-progress" aria-hidden="true">
      <span id="page-progress-bar" />
    </div>
  );
}

/**
 * Route transition: scroll, then focus.
 *
 * Two things must happen on navigation, in this order:
 *
 *  1. Scroll — a new route starts at the top, EXCEPT on POP (back/forward),
 *     where the browser's own scroll restoration is the correct behaviour
 *     and overriding it would yank the visitor away from where they were.
 *
 *  2. Focus — without this, a screen reader keeps reading from wherever it
 *     was and the page change is silent. Scrolling has to settle first or
 *     the focus() scroll adjustment is visible to sighted users.
 */
function useRouteTransition() {
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (location.action === "POP") return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const raf = requestAnimationFrame(() => {
      const main = document.getElementById("main");
      const target = main?.querySelector("h1") || main;
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.action]);
}

/**
 * Route-level loading state.
 *
 * The old `fallback={null}` blanked the page while a chunk downloaded,
 * which reads as a broken site on a slow connection. This is a quiet
 * skeleton that matches the page rhythm instead.
 */
function PageSkeleton() {
  return (
    <div className="page-skeleton" role="status">
      <span className="page-skeleton-bar" style={{ width: "38%" }} />
      <span className="page-skeleton-bar" style={{ width: "62%" }} />
      <span className="page-skeleton-bar" style={{ width: "48%" }} />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

function Shell() {
  useRouteTransition();

  /* The whole design system reads its accent off html[data-mode]. /video
     carries the teal mode; every other route (web, blog, landing, 404)
     is the orange developer mode — otherwise those pages have no accent
     rules at all and render in monochrome. Deriving it from the URL here,
     in one place, beats leaving it to whichever page remembers to. */
  const { pathname } = useLocation();
  useMode(pathname.startsWith("/video") ? "video" : "web");

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <PageProgress />
      <RouteAnnouncer />

      <ErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          <div id="main" tabIndex={-1}>
            <Routes>
              <Route path="/"       element={<Landing />} />
              <Route path="/web"    element={<PortfolioPage modeKey="web" />} />
              <Route path="/video"  element={<PortfolioPage modeKey="video" />} />
              <Route path="/blog"   element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*"       element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </ErrorBoundary>

      <CommandPalette />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
