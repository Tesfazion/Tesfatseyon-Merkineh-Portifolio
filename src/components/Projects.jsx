/**
 * Projects — a printed index of selected work.
 *
 * This was a drag-and-glide carousel with 3D tilt. It looked impressive
 * in a screen recording and was worse to use: half the projects were
 * off-screen, the rail moved on its own, and a drag could be mistaken for
 * a click. A responsive grid shows everything at once, works with a
 * keyboard, and lets the cases be read in the order they are written.
 *
 * Cards open the full case study in a focus-trapped dialog rather than
 * navigating away, so the grid keeps its scroll position.
 */
import { useState } from "react";
import { usePortfolio } from "../PortfolioContext.js";
import { coverFor } from "../config";
import Reveal from "./Reveal";
import Icon from "./Icon";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const mode = usePortfolio();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  const shown = mode.projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  return (
    <section id="work" className="section section--rule">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>01</i> Selected work</span>
          <h2 className="sec-title">
            Work you can <em>check</em>
          </h2>
          <p className="sec-sub">{mode.workNote}</p>
        </Reveal>

        <Reveal className="filter-bar" role="group" aria-label="Filter projects">
          {mode.projectCategories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-btn${filter === c ? " active" : ""}`}
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <p className="sr-only" role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "project" : "projects"} shown
          {filter !== "All" ? ` in ${filter}` : ""}.
        </p>

        {shown.length === 0 ? (
          <p className="empty-state">No projects in this category yet.</p>
        ) : (
          <div className="projects-grid">
            {shown.map((p, i) => {
              const cover = coverFor(p);
              return (
              <Reveal
                key={p.title}
                delay={(i % 3) * 60}
                className="project-item"
              >
                <article
                  className="project-card"
                  style={{ "--cover-a": p.accent }}
                >
                  <div className={`project-cover${cover ? " has-cover" : ""}`}>
                    {cover && (
                      <img
                        className="project-cover-img"
                        src={cover}
                        alt=""
                        width="1120"
                        height="632"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className="project-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="project-cover-actions">
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open the live ${p.title}`}
                          className="cover-btn"
                        >
                          <Icon name="external" size={14} />
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.title} on GitHub`}
                          className="cover-btn"
                        >
                          <Icon name="github" size={14} />
                        </a>
                      )}
                    </div>

                    <div className="project-cover-inner">
                      <span className="project-cat">{p.category}</span>
                      <h3>{p.title}</h3>
                    </div>
                  </div>

                  <div className="project-body">
                    <p>{p.desc}</p>
                    <div className="project-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="project-footer">
                    <button
                      type="button"
                      className="project-link primary"
                      onClick={() => setOpen(p)}
                    >
                      Case study <Icon name="arrowUpRight" size={12} />
                    </button>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <Icon name="external" size={12} /> Live
                      </a>
                    )}
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <Icon name="github" size={12} /> Code
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
