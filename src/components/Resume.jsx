/**
 * Resume — a compact credential strip (focus + status) with the CV
 * opening as a wide preview instead of an instant download.
 */
import { useState } from "react";
import { usePortfolio } from "../PortfolioContext.js";
import Reveal from "./Reveal";
import Icon from "./Icon";
import CvModal from "./CvModal";

export default function Resume() {
  const mode = usePortfolio();
  const [cvOpen, setCvOpen] = useState(false);

  const rows = [
    { icon: "zap",   label: "Focus",  value: mode.chips.join(" · ") },
    { icon: "check", label: "Status", value: mode.roles.join(" · ") },
  ].filter((r) => r.value);

  return (
    <section id="resume" className="section section--rule">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>05</i> Résumé</span>
          <h2 className="sec-title">
            The short <em>version</em>
          </h2>
          <p className="sec-sub">
            Open the CV for the full picture — experience, tools, and
            anything else you'd want on one page before a first call.
          </p>
        </Reveal>

        <Reveal>
          <div className="resume-track">
            {rows.map((r) => (
              <div className="resume-row" key={r.label}>
                <span className="resume-row-label">{r.label}</span>
                <span className="resume-row-value">{r.value}</span>
                <Icon name={r.icon} size={16} style={{ color: "var(--ink-3)" }} />
              </div>
            ))}
            <div className="resume-row">
              <span className="resume-row-label">Full version</span>
              <span className="resume-row-value">PDF · current · ready to send</span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setCvOpen(true)}
              >
                <Icon name="eye" size={14} /> View
              </button>
            </div>
          </div>
        </Reveal>
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