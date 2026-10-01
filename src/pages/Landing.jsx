/**
 * Landing — the front door. Two modes, honest framing, a real process.
 * The old "trusted by" logo wall is gone: it implied clients we don't
 * have, and a portfolio that leads with claims invites the wrong call.
 */
import { Link } from "react-router-dom";
import { profile, socials, modesList, SOCIAL_KEYS, site, modes } from "../config";
import { scrollToId } from "../hooks";
import Seo from "../components/Seo";
import { personSchema } from "../lib/schema";
import Icon from "../components/Icon";
import FabControls from "../components/FabControls";
import PaletteTrigger from "../components/PaletteTrigger";
import StickyCTA from "../components/StickyCTA";
import Reveal from "../components/Reveal";
import Testimonials from "../components/Testimonials";

const NAV_ITEMS = [
  { label: "Services", id: "services" },
  { label: "Process",  id: "process"  },
  { label: "FAQ",      id: "faq"      },
  { label: "Contact",  id: "contact"  },
];

const PROCESS = [
  {
    title: "We define the outcome",
    body:  "A clear brief before any pixels: what the project must achieve, how we'll know it worked, and what you need from me.",
  },
  {
    title: "I build it in the open",
    body:  "Real code or a real cut — you see progress as it happens, not a reveal at the end. Iteration is cheap, surprises are not.",
  },
  {
    title: "You own it after",
    body:  "Handover is part of the job: organised files, documented structure, and everything built so you or your team can take it forward.",
  },
];

const FAQ = [
  {
    q: "Are you taking on new projects right now?",
    a: "Usually yes. The honest way to find out is to message me — if I'm booked up I'll tell you when I'm free, rather than over-promising a timeline.",
  },
  {
    q: "How fast can you start?",
    a: "Web projects typically kick off within a few days of the brief. A short-form edit is normally turned around within 48 hours of receiving the footage.",
  },
  {
    q: "What do you need from me to begin?",
    a: "A short brief: what you're trying to achieve, who it's for, and any references or existing code you like. You don't need a spec document — we shape it together.",
  },
  {
    q: "Do you work on retainers or ongoing projects?",
    a: "Yes. I take on one-off projects and monthly arrangements — site maintenance, iterative updates, or a steady stream of edits. Pricing is per-project or per-month.",
  },
  {
    q: "Can you handle web and video in the same project?",
    a: "That's the idea. A landing page plus the social cut that drives traffic to it is a common combo, and two specialisations mean you deal with one person throughout.",
  },
];

const MARQUEE = [
  "Web Development", "Short-Form Video", "React", "CapCut",
  "UI Design", "Color Grading", "Next.js", "Retention Editing",
  "SEO", "DaVinci Resolve",
];

const TOOLS = [
  "React", "Next.js", "TypeScript", "Tailwind", "Node.js",
  "Python", "CapCut", "DaVinci Resolve", "Figma", "Supabase",
];

const LANDING_STATS = [
  { value: 1,  suffix: "+", label: "Years Building"  },
  { value: 11, suffix: "+", label: "Projects Shipped" },
  { value: 5,  suffix: "+", label: "Happy Clients"    },
  { value: 7,  suffix: "",  label: "Core Technologies" },
];

export default function Landing() {
  return (
    <div className="landing">
      <Seo
        title={site.seo.title}
        description={site.seo.description}
        path="/"
        jsonLd={personSchema(profile, socials)}
      />

      <div className="landing-inner">
        {/* ── Header ─────────────────────────────────── */}
        <header className="landing-header">
          <Link to="/" className="brand" aria-label="Home">
            <span className="brand-mark">{profile.initials}</span>
            <span className="brand-name">{profile.firstName}<em>.</em></span>
          </Link>

          <nav className="landing-nav" aria-label="Page sections">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} type="button" onClick={() => scrollToId(item.id)}>
                {item.label}
              </button>
            ))}
            <Link to="/blog" style={{ padding: "7px 13px", fontSize: "0.86rem", color: "var(--ink-2)" }}>
              Blog
            </Link>
            <PaletteTrigger />
          </nav>

          <a
            href={socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Icon name="telegram" size={15} />
            Hire Me
          </a>
        </header>

        {/* ── Hero ───────────────────────────────────── */}
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-kicker-line">
              <span className="landing-kicker-dot" aria-hidden="true">●</span>
              Web &amp; short-form video
            </div>

            <h1 className="landing-title">
              Websites <em>engineered.</em><br />
              Videos <em>edited.</em>
            </h1>

            <p className="landing-sub">
              Modern websites that convert visitors into customers — and
              short-form videos people actually watch to the very end.
            </p>

            <div className="landing-hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => scrollToId("services")}
              >
                See what I do <Icon name="arrowDown" size={16} />
              </button>
              <a
                href={socials.telegram}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <Icon name="telegram" size={16} /> Let's Talk
              </a>
            </div>

            <div className="landing-socials">
              <span className="landing-socials-label">Find me online</span>
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
          </div>
        </section>

        {/* ── Stats — social proof strip ────────────── */}
        <div className="landing-stats" aria-label="Stats">
          {LANDING_STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}{s.suffix}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marquee — the continuous hook ribbon ── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={i} className={`marquee-word${i % 2 ? " marquee-word--alt" : ""}`}>
              {word}
              <Icon name="sparkle" size={14} />
            </span>
          ))}
        </div>
      </div>

      <div className="landing-inner">
        {/* ── Service Cards — choose a direction ── */}
        <section id="services" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>01</i> What do you need?</span>
            <h2 className="sec-title">
              Choose a <em>direction</em>
            </h2>
            <p className="sec-sub">
              Two specialisations, one person. Pick the one that matches
              your project — or bring both.
            </p>
          </Reveal>

          <div className="landing-cards">
            {modesList.map((mode, i) => (
              <Reveal key={mode.key} delay={i * 70}>
                <Link
                  to={mode.route}
                  aria-label={`Explore ${mode.label}`}
                  className="landing-card"
                  style={{ "--acc": `rgb(${mode.accent})` }}
                >
                  <span className="landing-card-icon">
                    <Icon name={mode.icon} size={20} />
                  </span>
                  <h3>{mode.label}</h3>
                  <p>{mode.tagline}</p>
                  <div className="landing-card-chips">
                    {mode.chips.map((c) => <span key={c}>{c}</span>)}
                  </div>
                  <span className="landing-card-btn">
                    Explore {mode.shortLabel}
                    <Icon name="arrowRight" size={16} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Process — honest replacement for logo walls ── */}
        <section id="process" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>02</i> How I work</span>
            <h2 className="sec-title">
              Built to <em>deliver</em>
            </h2>
          </Reveal>

          <div className="process-grid">
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} delay={i * 70} className="card process-step">
                <span className="process-num">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Tools — stack I work with ─────────────── */}
        <div className="logo-strip" aria-label="Tools and technologies">
          {TOOLS.map((tool) => (
            <span key={tool} className="logo-chip">{tool}</span>
          ))}
        </div>

        {/* ── Blog teaser ──────────────────────────── */}
        <section style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
              borderTop: "1px solid var(--hairline)",
              paddingTop: 28,
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Notes on building &amp; editing</h3>
              <p style={{ color: "var(--ink-2)", fontSize: "0.9rem" }}>
                Essays on React structure, retention editing, and honest craft.
              </p>
            </div>
            <Link to="/blog" className="btn btn-ghost">
              Read the blog <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </section>

        {/* ── Testimonials — client quotes ──────────── */}
        <Testimonials />

        {/* ── FAQ — straight answers, no pressure ─── */}
        <section id="faq" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>03</i> Common questions</span>
            <h2 className="sec-title">
              Asked <em>often</em>
            </h2>
            <p className="sec-sub">
              Straight answers about availability, timelines and process —
              no reading between the lines.
            </p>
          </Reveal>

          <div className="faq-grid">
            <Reveal>
              <div className="faq-list">
                {FAQ.map((f) => (
                  <details key={f.q} className="faq-item">
                    <summary>
                      <span>{f.q}</span>
                      <Icon name="chevronRight" size={16} className="faq-chevron" />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="faq-aside">
              <span className="landing-card-icon" aria-hidden="true">
                <Icon name="send" size={20} />
              </span>
              <h3>Still have questions?</h3>
              <p>
                Message me on Telegram or email — I tend to reply within a
                few hours during the week.
              </p>
              <div className="landing-cta-actions" style={{ justifyContent: "flex-start" }}>
                <a
                  href={socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <Icon name="telegram" size={15} /> Telegram
                </a>
                <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                  <Icon name="mail" size={15} /> Email
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────── */}
        <section id="contact" className="landing-cta">
          <div>
            <span className="kicker" style={{ justifyContent: "center", display: "flex" }}>
              <i>Let's work together</i>
            </span>
            <h2>
              Have a project in mind? <em>Let's talk.</em>
            </h2>
            <p>{profile.availability.toLowerCase()}.</p>
            <div className="landing-cta-actions">
              <a
                href={socials.telegram}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg"
              >
                <Icon name="telegram" size={16} /> Message on Telegram
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="btn btn-ghost btn-lg"
              >
                <Icon name="mail" size={16} /> Email Me
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────── */}
        <footer className="landing-footer">
          <Link to="/" className="brand" aria-label="Home">
            <span className="brand-mark">{profile.initials}</span>
            <span className="brand-name">{profile.firstName}<em>.</em></span>
          </Link>

          <div className="hero-socials">
            {SOCIAL_KEYS.map((key) => (
              <a
                key={key}
                href={socials[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={key}
              >
                <Icon name={key} size={15} />
              </a>
            ))}
          </div>

          <p>© {new Date().getFullYear()} {profile.name}</p>
        </footer>
      </div>

      <FabControls />
      <StickyCTA />
    </div>
  );
}