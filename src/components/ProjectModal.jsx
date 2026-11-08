/**
 * ProjectModal — full case study for a single project.
 *
 * The cards in the rail are summaries; a hiring manager needs the actual
 * scope. This opens the detail in a focus-trapped dialog rather than a
 * new route, so the reader keeps their place in the grid and the URL
 * stays clean. The body scroll is locked and the trigger gets focus back
 * on close.
 */
import { useEffect, useRef } from "react";
import { useFocusTrap } from "../hooks";
import { caseStudies } from "../content/case-studies";
import { coverFor } from "../config";
import Icon from "./Icon";

/**
 * Builds the labelled fact rows at the top of the case study.
 *
 * The narrative lives in content/case-studies.js, keyed by the project's
 * `study` id, and is merged in here. Every field is optional, so a project
 * can be added with just a title and a summary; rows for absent fields are
 * skipped rather than rendered empty. `stack` falls back to `tags`, which
 * already carries the technology list, so no project renders a "Tech"
 * heading over an empty list.
 */
const facts = (p) => {
  const s = caseStudies[p.study] || {};
  const rows = [];
  if (s.role) rows.push({ label: "My role", value: s.role });
  if (s.problem) rows.push({ label: "The problem", value: s.problem });
  if (s.approach) rows.push({ label: "Approach", value: s.approach });
  if (s.outcome) rows.push({ label: "Outcome", value: s.outcome });
  const stack = s.stack?.length ? s.stack : p.tags;
  if (stack?.length) rows.push({ label: "Stack", value: stack.join(" · ") });
  if (s.duration) rows.push({ label: "Timeline", value: s.duration });
  return rows;
};

export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null);

  useFocusTrap(true, panelRef, onClose);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!project) return null;

  const [a, b] = project.gradient || [project.accent, project.accent];
  const study = caseStudies[project.study] || null;
  const rows = facts(project);
  const cover = coverFor(project);

  return (
    <div
      className="pm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pm-title"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="pm"
        onClick={(e) => e.stopPropagation()}
        style={{ "--pm-a": a, "--pm-b": b, "--pm-accent": project.accent }}
      >
        <div className={`pm-cover${cover ? " has-cover" : ""}`}>
          {cover && (
            <img
              className="pm-cover-img"
              src={cover}
              alt=""
              width="1120"
              height="632"
              decoding="async"
            />
          )}
          <span className="project-cat">{project.category}</span>
          <h2 id="pm-title">{project.title}</h2>
          <button
            type="button"
            className="pm-close"
            onClick={onClose}
            aria-label="Close project details"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="pm-body">
          <p className="pm-lede">{project.desc}</p>

          {rows.length > 0 && (
            <dl className="pm-facts">
              {rows.map((r) => (
                <div className="pm-fact" key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {study?.highlights?.length > 0 && (
            <div className="pm-section">
              <h3>What I did</h3>
              <ul className="pm-list">
                {study.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" size={13} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {study?.learned && (
            <div className="pm-section">
              <h3>What I'd do differently</h3>
              <p className="pm-note">{study.learned}</p>
            </div>
          )}

          {project.tags?.length > 0 && (
            <div className="project-tags pm-tags">
              {project.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          )}

          <div className="pm-actions">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Icon name="external" size={15} /> Live project
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <Icon name="github" size={15} /> View source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
