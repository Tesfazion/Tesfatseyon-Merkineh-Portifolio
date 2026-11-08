/**
 * TechStack — the toolkit, as an index rather than a marquee.
 *
 * Two counter-rolling ticker rows were doing the job of a list while also
 * moving text under the reader's eyes. This is a ruled grid: every tool
 * visible at once, in the brand colour, with the grouped capabilities
 * below it.
 */
import { usePortfolio } from "../PortfolioContext.js";
import Reveal from "./Reveal";
import Icon from "./Icon";

function TechItem({ tech }) {
  return (
    <li className="tech-item">
      <span
        className="tech-dot"
        style={{ background: tech.color }}
        aria-hidden="true"
      />
      {tech.name}
    </li>
  );
}

export default function TechStack() {
  const mode = usePortfolio();

  return (
    <section id="skills" className="section section--rule">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>04</i> Skills &amp; tools</span>
          <h2 className="sec-title">
            The <em>toolkit</em>
          </h2>
          <p className="sec-sub">{mode.shortBio}</p>
        </Reveal>

        {mode.techStack?.length > 0 && (
          <Reveal>
            <ul className="tech-index" aria-label="Tools I use">
              {mode.techStack.map((t) => (
                <TechItem key={t.name} tech={t} />
              ))}
            </ul>
          </Reveal>
        )}

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
                    <Icon name="check" size={12} className="skill-check" />
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
