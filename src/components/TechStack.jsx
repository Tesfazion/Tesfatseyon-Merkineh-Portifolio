/**
 * TechStack — two counter-rolling marquee rows of the real tech, using
 * brand icons loaded from the Simple Icons CDN, plus grouped skill cards.
 *
 * Icons are small monochrome images in the brand colour. If the network
 * fails (offline, blocked), each badge falls back to a plain colour dot
 * so the row still reads. The marquee is decorative (aria-hidden) — the
 * same list is re-rendered as an sr-only enumeration, and it is never
 * replayed for prefers-reduced-motion so nothing moves for a reader who
 * has asked for calm. No self-assigned percentage bars.
 */
import { usePortfolio } from "../PortfolioContext.js";
import Reveal from "./Reveal";
import Icon from "./Icon";

function TechIcon({ tech }) {
  const nameMap = {
    capcut: "capcut",
    "adobe premiere pro": "premierepro",
    "adobe after effects": "aftereffects",
    photoshop: "photoshop",
    audition: "audition",
  };

  const iconName = nameMap[tech.name.toLowerCase()];

  if (!iconName) {
    return (
      <span className="tech-dot" style={{ background: tech.color }} aria-hidden="true" />
    );
  }

  return (
    <span className="tech-icon" aria-hidden="true">
      <Icon name={iconName} size={20} style={{ color: tech.color }} />
    </span>
  );
}

/* One row of the marquee. Content is duplicated once so the -50% loop
   keyframe wraps without a visible jump. */
function TickerTrack({ items }) {
  const seq = [...items, ...items];
  return (
    <div className="ticker-track">
      {seq.map((t, i) => (
        <span key={`${t.name}-${i}`} className="ticker-item">
          <TechIcon tech={t} />
          {t.name}
        </span>
      ))}
    </div>
  );
}

export default function TechStack() {
  const mode = usePortfolio();

  return (
    <section id="skills" className="section section--rule">
      <div className="container">

        <Reveal className="sec-head">
          <span className="kicker"><i>03</i> Skills &amp; Tools</span>
          <h2 className="sec-title">
            What I work <em>with</em>
          </h2>
          <p className="sec-sub">{mode.shortBio}</p>
        </Reveal>

        {mode.techStack?.length > 0 && (
          <Reveal className="ticker" aria-hidden="true">
            <div className="ticker-row">
              <TickerTrack items={mode.techStack} />
            </div>
            <div className="ticker-row ticker-row--reverse">
              <TickerTrack items={mode.techStack} />
            </div>
          </Reveal>
        )}

        <ul className="sr-only">
          {mode.techStack.map((t) => <li key={t.name}>{t.name}</li>)}
        </ul>

        <div className="skill-grid">
          {mode.skills.map((group, i) => (
            <Reveal key={group.title} delay={i * 70} className="card skill-card">
              <div className="skill-card-head">
                <h3>{group.title}</h3>
                <span className="skill-card-num">{group.num || `0${i + 1}`}</span>
              </div>
              <ul className="skill-list-plain">
                {group.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={13} className="skill-check" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}