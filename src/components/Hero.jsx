/**
 * Hero — the opening spread of a discipline page.
 *
 * Left: the role claim and primary actions. Right: a portrait-led engineering
 * card on the web page, with related creative work kept secondary. Below:
 * technical focus in a compact strip.
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
  const otherMode = modesList.find((m) => m.key !== mode.key);
  const isWeb = mode.key === "web";

  return (
    <section id="home" className="hero" aria-label="Introduction">
      {/* ── Claim ── */}
      <div className="hero-copy">
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          {isWeb ? profile.role : mode.label}
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

      {/* ── Engineering focus / related work ── */}
      <aside className={`hero-types${isWeb ? " hero-types--web" : ""}`} aria-label={isWeb ? "Engineering focus" : "Related work"}>
        {isWeb ? (
          <>
            <div className="hero-profile-card">
              <picture className="hero-profile-photo">
                <source srcSet="/me.webp" type="image/webp" />
                <img
                  src={profile.photo}
                  alt={`${profile.name}, software engineer`}
                  width="600"
                  height="600"
                  fetchPriority="high"
                />
              </picture>
              <div className="hero-profile-copy">
                <span className="hero-types-kicker">Full-stack engineering</span>
                <strong>From interface to API.</strong>
                <ul className="hero-profile-skills">
                  <li>React · Next.js</li>
                  <li>TypeScript · Node.js</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <Link
            to={otherMode.route}
            className="hero-type"
            style={{ "--type-accent": `rgb(${otherMode.accent})` }}
          >
            <span className="hero-type-icon" aria-hidden="true">
              <Icon name={otherMode.icon} size={17} />
            </span>
            <span className="hero-type-body">
              <strong>Also in my portfolio</strong>
              <span>{otherMode.chips.slice(0, 2).join(" · ")}</span>
            </span>
            <Icon name="arrowRight" size={15} className="hero-type-arrow" />
          </Link>
        )}
        {isWeb && (
          <Link to={otherMode.route} className="text-link hero-other-work">
            Other creative work: video editing
            <Icon name="arrowRight" size={14} />
          </Link>
        )}
      </aside>

      {/* ── At a glance ── */}
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
