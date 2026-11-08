/**
 * Hero — the opening spread of a discipline page.
 *
 * Left: the claim (display serif) and the two things a visitor can do.
 * Right: the Web / Video index, so switching discipline never means a
 * trip back to the landing page. Below: the numbers, in a ruled strip.
 *
 * The typed role line and the count-up stats are gone on purpose: motion
 * for its own sake competes with the work, and a static number is not
 * less convincing than one that counts itself up.
 */
import { Link } from "react-router-dom";
import { profile, socials, SOCIAL_KEYS, modesList } from "../config";
import { scrollToId } from "../hooks";
import { usePortfolio } from "../PortfolioContext.js";
import Icon from "./Icon";

export default function Hero() {
  const mode = usePortfolio();

  return (
    <section id="home" className="hero" aria-label="Introduction">
      {/* ── Claim ── */}
      <div className="hero-copy">
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          {profile.role}
        </div>

        <h1 className="hero-title">
          {mode.heroTitle.line1}
          <br />
          <em>{mode.heroTitle.emph}</em>
        </h1>

        <p className="hero-sub">{mode.tagline}</p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => scrollToId("work")}
          >
            View the work <Icon name="arrowDown" size={15} />
          </button>
          <a
            href={socials.telegram}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-lg"
          >
            <Icon name="telegram" size={15} /> Let&apos;s talk
          </a>
        </div>

        <div className="hero-socials">
          {SOCIAL_KEYS.map((key) => (
            <a
              key={key}
              href={socials[key]}
              target="_blank"
              rel="noreferrer me"
              aria-label={key}
            >
              <Icon name={key} size={15} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Discipline index ── */}
      <aside className="hero-types" aria-label="The two disciplines">
        <span className="hero-types-kicker">Two disciplines</span>
        {modesList.map((m) => (
          <Link
            key={m.key}
            to={m.route}
            className="hero-type"
            style={{ "--type-accent": `rgb(${m.accent})` }}
            aria-current={m.key === mode.key ? "page" : undefined}
          >
            <span className="hero-type-icon" aria-hidden="true">
              <Icon name={m.icon} size={17} />
            </span>
            <span className="hero-type-body">
              <strong>{m.label}</strong>
              <span>{m.chips.slice(0, 2).join(" · ")}</span>
            </span>
            <Icon name="arrowRight" size={15} className="hero-type-arrow" />
          </Link>
        ))}
      </aside>

      {/* ── Numbers ── */}
      <div className="hero-stats-bar">
        {mode.stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-value">{s.value}{s.suffix}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
