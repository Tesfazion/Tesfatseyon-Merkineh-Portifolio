/**
 * Footer — editorial grid: brand + blurb, page nav, service modes,
 * socials — then a bottom rule with copyright and back-to-top.
 */
import { Link } from "react-router-dom";
import { navLinks, modesList, profile, socials, SOCIAL_KEYS, site, company } from "../config";
import { usePrefersReducedMotion, useSectionNav } from "../hooks";
import Icon from "./Icon";

export default function Footer() {
  const year = new Date().getFullYear();
  const reduced = usePrefersReducedMotion();
  /* Footer section links are reachable from /blog, where the sections do not
     exist yet — goTo routes to the portfolio first, then scrolls once the
     lazy chunk has mounted. */
  const goTo = useSectionNav();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand" aria-label="Home">
              <span className="brand-mark">{profile.initials}</span>
              <span className="brand-name">
                {profile.firstName}<em>.</em>
              </span>
            </Link>
            <p>
              Full-stack developer &amp; short-form video editor.
              Websites that convert, videos that retain.
            </p>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/blog">Blog</Link>
              <a href={company.url} target="_blank" rel="noopener noreferrer">
                {company.name}
              </a>
              <a href={socials.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </div>
          </div>

          <div>
            <h4>Pages</h4>
            <nav className="footer-nav" aria-label="Footer navigation">
              <Link to="/">Home</Link>
              <Link to="/blog">Blog</Link>
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => goTo(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4>Services</h4>
            <nav className="footer-nav" aria-label="Service modes">
              {modesList.map((m) => (
                <Link key={m.key} to={m.route}>{m.label}</Link>
              ))}
              <a href={`mailto:${profile.email}`}>Contact</a>
            </nav>
          </div>

          <div>
            <h4>Studio</h4>
            <div className="footer-nav">
              <a href={company.url} target="_blank" rel="noopener noreferrer">
                {company.name}
              </a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <span className="footer-location">{company.location}</span>
            </div>
          </div>

          <div>
            <h4>Follow</h4>
            <div className="hero-socials">
              {SOCIAL_KEYS.map((key) => (
                <a
                  key={key}
                  href={socials[key]}
                  target="_blank"
                  rel="noreferrer me"
                  aria-label={key}
                >
                  <Icon name={key} size={16} />
                </a>
              ))}
            </div>
            <p style={{ color: "var(--ink-3)", fontSize: "0.84rem", marginTop: 14, maxWidth: "26ch" }}>
              {profile.availability.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {year} {profile.name} — {site.url.replace("https://", "")}</p>
          <button
            type="button"
            className="text-link"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
            }
          >
            Back to top <Icon name="arrowUp" size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}