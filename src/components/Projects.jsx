/**
 * Projects — filterable case-study carousel.
 *
 * Presentation is a single-row rail that slides on desktop (and wraps
 * naturally on small screens): you can drag it, arrow through it, or let
 * it glide between cards on a timer. The timer pauses whenever the pointer
 * or keyboard focus is on the rail, and is switched off entirely for
 * prefers-reduced-motion, so content never moves underneath a reader.
 *
 * Cards expand into a detail modal rather than navigating away, so the
 * rail keeps its position. The filter is announced politely because the
 * rail re-renders with a different set of results and a screen-reader
 * user otherwise has no idea the click did anything.
 */
import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "../PortfolioContext.js";
import { usePrefersReducedMotion } from "../hooks";
import Reveal from "./Reveal";
import Icon from "./Icon";
import ProjectModal from "./ProjectModal";

const GAP = 22;

export default function Projects() {
  const mode = usePortfolio();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const reduced = usePrefersReducedMotion();

  const shown = mode.projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  const railRef = useRef(null);      // the scrolling grid
  const shellRef = useRef(null);     // controls + grid, for focus/pause
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncRail = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 4);
    setProgress(max > 4 ? Math.min(1, el.scrollLeft / max) : 0);
  };

  /* A new filter resets the rail to its origin. */
  useEffect(() => {
    const el = railRef.current;
    if (el) el.scrollLeft = 0;
    syncRail();
  }, [filter, shown.length]);

  /* ── Drag to slide ─────────────────────────────────────── */
  const beginDrag = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = railRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 };
    el.classList.add("is-dragging");
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const moveDrag = (e) => {
    const d = drag.current;
    const el = railRef.current;
    if (!d.active || !el) return;
    el.scrollLeft = d.startLeft - (e.clientX - d.startX);
    d.moved = Math.max(d.moved, Math.abs(e.clientX - d.startX));
  };

  const endDrag = (e) => {
    const el = railRef.current;
    if (drag.current.active) {
      const moved = drag.current.moved;
      drag.current = { active: false, startX: 0, startLeft: 0, moved };
      el?.classList.remove("is-dragging");
      // A real drag ends in a click on whichever card was grabbed last.
      // Give that release click a moment, then forget so the NEXT genuine
      // click is never swallowed.
      if (moved > 8) {
        setTimeout(() => { drag.current.moved = 0; }, 160);
      }
    }
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch { /* noop */ }
  };

  /* After a real drag the pointerup also triggers a click on whichever
     card got grabbed last — swallow it so a slide never opens a modal. */
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const guard = (e) => {
      if (drag.current.moved > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    el.addEventListener("click", guard, true);
    return () => el.removeEventListener("click", guard, true);
  }, []);

  /* ── Auto-glide, paused on hover/focus, off for reduced motion ── */
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || reduced || shown.length < 2 || open) return;

    let timer = 0;
    const canMove = () => {
      const el = railRef.current;
      return el ? el.scrollWidth > el.clientWidth + 8 : false;
    };
    const glide = () => {
      const el = railRef.current;
      const card = el?.querySelector(".project-card");
      if (!el || !card || !canMove()) return;
      const step = card.getBoundingClientRect().width + GAP;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - step) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    };
    const start = () => { if (!timer) timer = setInterval(glide, 4800); };
    const stop = () => { if (timer) { clearInterval(timer); timer = 0; } };
    const onEnter = () => stop();
    const onLeave = () => start();
    const onFocusIn = () => stop();
    const onFocusOut = (e) => {
      if (!shell.contains(e.relatedTarget)) start();
    };

    start();
    shell.addEventListener("pointerenter", onEnter);
    shell.addEventListener("pointerleave", onLeave);
    shell.addEventListener("focusin", onFocusIn);
    shell.addEventListener("focusout", onFocusOut);
    return () => {
      stop();
      shell.removeEventListener("pointerenter", onEnter);
      shell.removeEventListener("pointerleave", onLeave);
      shell.removeEventListener("focusin", onFocusIn);
      shell.removeEventListener("focusout", onFocusOut);
    };
  }, [reduced, shown.length, open]);

  /* ── Subtle 3D tilt on each card ───────────────────────── */
  const tilt = (e) => {
    if (reduced || drag.current.moved) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-rx", (-py * 5).toFixed(2));
    el.style.setProperty("--tilt-ry", (px * 5).toFixed(2));
  };
  const untilt = (e) => {
    e.currentTarget.style.setProperty("--tilt-rx", "0");
    e.currentTarget.style.setProperty("--tilt-ry", "0");
  };

  const scrollRail = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector(".project-card");
    const step = (card ? card.getBoundingClientRect().width : 350) + GAP;
    el.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="work" className="section section--rule">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>05</i> Work</span>
          <h2 className="sec-title">
            Selected <em>projects</em>
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
          <Reveal className="projects-rail" >
            <div
              className="projects-rail-shell"
              ref={shellRef}
              role="region"
              aria-label="Project carousel"
            >
              <div
                className="projects-grid"
                ref={railRef}
                onScroll={syncRail}
                onPointerDown={beginDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                {shown.map((p, i) => {
                  const [a, b] = p.gradient || [p.accent, p.accent];
                  return (
                    <Reveal
                      key={p.title}
                      delay={(i % 2) * 70}
                      className="project-item"
                    >
                      <article
                        className="project-card"
                        style={{ "--tag-accent": p.accent }}
                        onPointerMove={tilt}
                        onPointerLeave={untilt}
                      >
                        <div
                          className="project-cover"
                          style={{ "--cover-a": a, "--cover-b": b }}
                        >
                          <span
                            className="project-num"
                            aria-hidden="true"
                          >{String(i + 1).padStart(2, "0")}</span>
                          <span className="project-sheen" aria-hidden="true" />

                          <div className="project-cover-inner">
                            <span className="project-cat">{p.category}</span>
                            <h3>{p.title}</h3>
                          </div>

                          <div className="project-cover-actions">
                            {p.link && (
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open the live ${p.title}`}
                                className="cover-btn"
                              >
                                <Icon name="external" size={15} />
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
                                <Icon name="github" size={15} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setOpen(p)}
                              className="cover-btn"
                              aria-label={`Read the ${p.title} case study`}
                            >
                              <Icon name="arrowUpRight" size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="project-body">
                          <h3>{p.title}</h3>
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
                            Case study <Icon name="arrowUpRight" size={13} />
                          </button>
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                            >
                              <Icon name="external" size={13} /> Live
                            </a>
                          )}
                          {p.github && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                            >
                              <Icon name="github" size={13} /> Code
                            </a>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>

              <div className="projects-rail-controls">
                <button
                  type="button"
                  onClick={() => scrollRail(-1)}
                  disabled={atStart}
                  aria-label="Slide projects left"
                >
                  <Icon name="arrowLeft" size={16} />
                </button>

                <div className="projects-rail-meta">
                  <span className="projects-rail-hint" aria-hidden="true">
                    Drag to slide
                  </span>
                  <span className="projects-rail-track" aria-hidden="true">
                    <i style={{ transform: `scaleX(${progress})` }} />
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => scrollRail(1)}
                  disabled={atEnd}
                  aria-label="Slide projects right"
                >
                  <Icon name="arrowRight" size={16} />
                </button>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}