/**
 * RouteAnnouncer — narrates client-side navigation to screen readers.
 *
 * A route change produces no focus move and no page load, so assistive
 * technology gets no signal that anything happened: the reader keeps
 * reading the old page's text while the DOM silently swaps underneath.
 * A visually hidden live region gives that change a voice.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState("");
  const first = useRef(true);

  useEffect(() => {
    // Announcing on first load fights the browser's own page title read.
    if (first.current) {
      first.current = false;
      return;
    }
    setMessage("");
    // Re-setting after a tick guarantees a change is announced even when
    // two consecutive routes resolve to the same readable label.
    const t = setTimeout(() => setMessage(labelFor(pathname)), 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

function labelFor(pathname) {
  if (pathname.startsWith("/blog/")) return "Article opened";
  if (pathname === "/blog") return "Blog index";
  if (pathname === "/web") return "Web developer portfolio";
  if (pathname === "/video") return "Video editor portfolio";
  if (pathname === "/") return "Home";
  return "Page not found";
}
