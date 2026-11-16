/**
 * Services — a numbered ledger of what I can do. Numbered on the left,
 * honest description, icon on the right.
 */
import { usePortfolio } from "../PortfolioContext.js";
import Reveal from "./Reveal";
import Icon from "./Icon";

export default function Services() {
  const mode = usePortfolio();
  const isWeb = mode.key === "web";

  return (
    <section id="services" className="section section--rule">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>03</i> {isWeb ? "Engineering strengths" : "Services"}</span>
          <h2 className="sec-title">
            {isWeb ? <>How I contribute <em>to a team</em></> : <>What I can <em>do for you</em></>}
          </h2>
          <p className="sec-sub">
            {isWeb
              ? "I work across product interfaces, backend workflows, data, and delivery—following each capability through to a working, reviewable implementation."
              : "Clear scope, reliable delivery, and work built to last and grow. Pick the one that matches your project — or bring the whole lot."}
          </p>
        </Reveal>

        <Reveal>
          <div className="services-list">
            {mode.services.map((s, i) => (
              <div className="service-item" key={s.title}>
                <span className="service-item-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                <span className="service-item-icon" aria-hidden="true">
                  <Icon name={s.icon} size={19} />
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}