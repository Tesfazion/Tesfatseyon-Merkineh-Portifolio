/**
 * Hero — wide editorial: oversized serif title, typed role line, and
 * a "types" switcher panel (Web / Video) on the right in place of a
 * photo, plus a rule-separated stat strip. Colour is driven entirely
 * by the mode accent (data-mode on <html>).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { profile, socials, SOCIAL_KEYS, modesList } from "../config";
import { useCountUp, useTypewriter, scrollToId } from "../hooks";
import { usePortfolio } from "../PortfolioContext.js";
import Icon from "./Icon";
import CvModal from "./CvModal";

function Stat({ stat }) {
  const [value, ref] = useCountUp(stat.value);
  return (
    <div className="stat" ref={ref}>
      <span className="stat-value">{value}{stat.suffix}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

export default function Hero() {
  const mode     = usePortfolio();
  const typed    = useTypewriter(mode.roles);
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <section id="home" className="hero" aria-label="Introduction">
      {/* ── Copy ── */}
      <div className="hero-copy">
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          {profile.availability}
        </div>

        <h1 className="hero-title">
          {mode.heroTitle.line1}
          <br />
          <em>{mode.heroTitle.emph}</em>
        </h1>

        <div className="hero-role-line">
          <span className="hero-role-prefix">I do</span>
          <span className="hero-typed-text">{typed}</span>
          <span className="hero-caret" aria-hidden="true" />
        </div>

        <p className="hero-sub">{mode.tagline}</p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToId("work")}
          >
            View My Work <Icon name="arrowRight" size={16} />
          </button>
          <a
            href={socials.telegram}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            <Icon name="telegram" size={16} /> Let's Talk
          </a>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setCvOpen(true)}
          >
            <Icon name="eye" size={16} /> View CV
          </button>
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
              <Icon name={key} size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Types panel: Web / Video switcher ── */}
      <div className="hero-types" aria-label="Choose what I do">
        <span className="hero-types-kicker">Two types of work</span>
        {modesList.map((m) => (
          <Link
            key={m.key}
            to={m.route}
            className="hero-type"
            style={{ "--type-accent": `rgb(${m.accent})` }}
          >
            <span className="hero-type-icon" aria-hidden="true">
              <Icon name={m.icon} size={20} />
            </span>
            <span className="hero-type-body">
              <strong>{m.label}</strong>
              <span>{m.chips.slice(0, 2).join(" · ")}</span>
            </span>
            <Icon name="arrowRight" size={16} className="hero-type-arrow" />
          </Link>
        ))}
      </div>

      {/* ── Stats ── */}
      <div className="hero-stats-bar">
        {mode.stats.map((s) => <Stat key={s.label} stat={s} />)}
      </div>

      {cvOpen && (
        <CvModal
          url={mode.resumeUrl}
          name={mode.resumeName}
          onClose={() => setCvOpen(false)}
        />
      )}
    </section>
  );
}