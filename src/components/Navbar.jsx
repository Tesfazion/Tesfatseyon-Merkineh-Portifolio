/**
 * Navbar — fixed header with reading progress, section links, route
 * links, an accent CTA, and a mobile drawer.
 *
 * The closed drawer is visibility-hidden in CSS AND wrapped by a focus
 * trap while open, so a keyboard user can neither tab into it while it is
 * closed nor tab out into the page behind it while it is open.
 *
 * Scroll work is delegated to the shared scroll store in hooks.js rather
 * than a local listener, so the header, the read-progress bar and the
 * floating controls all cost one rAF-throttled callback per frame.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { navLinks, routeLinks, profile, socials } from "../config";
import {
  useFocusTrap, useScrolledPast, useScrollProgress,
  useActiveSection, useMediaQuery, useSectionNav,
} from "../hooks";
import Icon from "./Icon";
import PaletteTrigger from "./PaletteTrigger";

const SECTION_IDS = navLinks.map((l) => l.id);
const PORTFOLIO_ROUTES = ["/web", "/video"];

export default function Navbar() {
  const scrolled = useScrolledPast(20);
  const progress = useScrollProgress();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 860px)");

  const isPortfolio = PORTFOLIO_ROUTES.includes(pathname);
  const active = useActiveSection(isPortfolio ? SECTION_IDS : [], { offset: 0.35 });

  const drawerRef = useRef(null);
  const toggleRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  const goTo = useSectionNav();

  useFocusTrap(open, drawerRef, close);

  /* The trap only makes sense on the drawer breakpoint; on desktop the
     nav is always visible and must stay tabbable. */
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  /* Lock body scroll while the drawer is open. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handleSection = (id) => {
    setOpen(false);
    goTo(id);
  };

  return (
    <>
      <header className={`nav${scrolled ? " nav-scrolled" : ""}`} role="banner">
        <div
          className="nav-progress"
          style={{ transform: `scaleX(${progress / 100})` }}
          aria-hidden="true"
        />

        <div className="nav-inner">
          <Link to="/" className="brand" onClick={close} aria-label="Home">
            <span className="brand-mark">{profile.initials}</span>
            <span className="brand-name">
              {profile.firstName}<em>.</em>
            </span>
          </Link>

          <nav
            ref={drawerRef}
            className={`nav-links${open ? " open" : ""}`}
            id="nav-menu"
            aria-label="Main navigation"
            {...(open ? { "aria-modal": "true", role: "dialog" } : {})}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className={active === link.id ? "active" : ""}
                onClick={() => handleSection(link.id)}
                aria-current={active === link.id ? "true" : undefined}
              >
                {link.label}
              </button>
            ))}

            {routeLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={pathname === link.to ? "active" : ""}
                aria-current={pathname === link.to ? "page" : undefined}
                onClick={close}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm nav-cta"
              onClick={close}
            >
              <Icon name="telegram" size={14} />
              Hire Me
            </a>
          </nav>

          <div className="nav-actions">
            <div className="nav-desktop-only">
              <PaletteTrigger />
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="nav-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="nav-overlay"
          aria-hidden="true"
          onClick={close}
        />
      )}
    </>
  );
}
