/**
 * About — editorial split: identity + key facts on the left, bio and a
 * numbered highlight rail on the right.
 */
import { useState } from "react";
import { profile } from "../config";
import { scrollToId } from "../hooks";
import { usePortfolio } from "../PortfolioContext.js";
import Reveal from "./Reveal";
import Icon from "./Icon";

export default function About() {
  const mode = usePortfolio();
  const [imgOk, setImgOk] = useState(true);

  const meta = [
    { dt: "Focus",  dd: mode.chips.join(" · ") },
    { dt: "Based in", dd: profile.location },
    { dt: "Status", dd: profile.availability },
  ];

  return (
    <section id="about" className="section section--rule">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>01</i> About</span>
          <h2 className="sec-title">
            The person behind <em>the work</em>
          </h2>
        </Reveal>

        <div className="split">
          {/* ── Identity ── */}
          <Reveal>
            <div className="about-intro">
              <span className="about-avatar" aria-hidden="true">
                {imgOk ? (
                  <picture>
                    {/* Two tiers is the whole story: WebP is 15 kB where
                        it is supported, and every browser that lacks
                        WebP supports JPEG, so a third PNG tier would add
                        209 kB to the repo to serve nobody. */}
                    <source srcSet="/me.webp" type="image/webp" />
                    <img
                      src={profile.photo}
                      alt=""
                      width="600"
                      height="600"
                      loading="lazy"
                      decoding="async"
                      onError={() => setImgOk(false)}
                    />
                  </picture>
                ) : (
                  profile.initials
                )}
              </span>
              <h3>{profile.name}</h3>
              <p><strong>{mode.label}</strong></p>
              <span className="about-status">
                <span className="about-status-dot" aria-hidden="true" />
                {profile.availability}
              </span>
            </div>

            <dl className="about-meta-grid">
              {meta.map((m) => (
                <div className="about-meta-cell" key={m.dt}>
                  <dt>{m.dt}</dt>
                  <dd>{m.dd}</dd>
                </div>
              ))}
            </dl>

            <div className="about-actions">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                <Icon name="mail" size={16} /> Email Me
              </a>
              <button
                type="button"
                className="text-link"
                onClick={() => scrollToId("work")}
              >
                See my work <Icon name="arrowRight" size={14} />
              </button>
            </div>
          </Reveal>

          {/* ── Bio + highlights ── */}
          <div>
            <Reveal>
              {mode.about.map((para, i) => (
                <p
                  key={i}
                  className="sec-sub"
                  style={{ marginBottom: 18 }}
                >
                  {para}
                </p>
              ))}
            </Reveal>

            <Reveal delay={70}>
              <ul className="highlight-list">
                {mode.highlights.map((h, i) => (
                  <li key={h}>
                    <span className="hl-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hl-text">{h}</span>
                    <span className="hl-check" aria-hidden="true">
                      <Icon name="check" size={11} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
