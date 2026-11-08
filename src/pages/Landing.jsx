/**
 * Landing — the front door.
 *
 * The page is laid out like a printed index: a claim, the two
 * disciplines, a sample of real work, the process, and straight answers.
 * There is no logo wall, no invented metric and no self-playing carousel —
 * on a portfolio, the work is the argument.
 */
import { Link } from "react-router-dom";
import {
  profile, socials, modesList, SOCIAL_KEYS, site, modes, company, coverFor,
} from "../config";
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
  { label: "Work",     id: "work"     },
  { label: "Process",  id: "process"  },
  { label: "FAQ",      id: "faq"      },
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

const TOOLS = [
  "React", "Next.js", "TypeScript", "Tailwind", "Node.js",
  "Python", "CapCut", "DaVinci Resolve", "Figma", "Supabase",
];

const LANDING_STATS = [
  { value: 1,  suffix: "+", label: "Years building"   },
  { value: 11, suffix: "+", label: "Projects shipped" },
  { value: 5,  suffix: "+", label: "Happy clients"    },
  { value: 7,  suffix: "",  label: "Core technologies"},
];

/* One sample from each discipline, interleaved — the point of this list is
   that the same person made all six. Looked up by `study` id rather than by
   array position, so reordering a mode's projects cannot silently swap one
   of these for something unrelated. */
const SELECTED_STUDIES = [
  ["ethio-sunshine-tech-solution", modes.web],
  ["shorts-batch-hooks-captions-b-roll", modes.video],
  ["leadforge-ai", modes.web],
  ["cinematic-travel-cut-graded-for-reels", modes.video],
  ["wolaita-sodo-water-monitor", modes.web],
  ["launch-promo-45s", modes.video],
];

const SELECTED = SELECTED_STUDIES.map(([study, mode]) => ({
  mode,
  project: mode.projects.find((p) => p.study === study),
})).filter(({ project }) => Boolean(project));

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
            <Link to="/blog">Journal</Link>
            <PaletteTrigger />
          </nav>

          <a
            href={socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <Icon name="telegram" size={13} />
            Hire me
          </a>
        </header>

        {/* ── Hero ───────────────────────────────────── */}
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-kicker-line">
              <span className="landing-kicker-dot" aria-hidden="true" />
              {profile.role}
            </div>

            <h1 className="landing-title">
              Websites <em>engineered.</em><br />
              Videos <em>edited.</em>
            </h1>

            <p className="landing-sub">
              I&apos;m {profile.firstName} — founder and CEO of {company.name}.
              Modern websites that turn visitors into customers, and
              short-form video people watch to the last second. One studio,
              two disciplines, no hand-offs.
            </p>

            <div className="landing-hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => scrollToId("services")}
              >
                Choose a direction <Icon name="arrowDown" size={15} />
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
                    <Icon name={key} size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <figure className="landing-portrait">
            <picture>
              <source srcSet="/me.webp" type="image/webp" />
              <img
                src="/me.jpg"
                alt={`${profile.name}, ${profile.role}`}
                width="600"
                height="600"
                loading="eager"
                decoding="async"
              />
            </picture>
            <figcaption>
              <span>{profile.location}</span>
              <span>{profile.initials} / 2026</span>
            </figcaption>
            <span className="landing-portrait-role">{profile.disciplines}</span>
          </figure>
        </section>

        {/* ── Numbers ────────────────────────────────── */}
        <div className="landing-stats" aria-label="At a glance">
          {LANDING_STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}{s.suffix}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Disciplines ────────────────────────────── */}
        <section id="services" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>01</i> What I do</span>
            <h2 className="sec-title">
              Choose a <em>direction</em>
            </h2>
            <p className="sec-sub">
              Two specialisations, one person. Pick the one that matches your
              project — or bring both.
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
                  <span className="landing-card-num">0{i + 1}</span>
                  <span className="landing-card-icon">
                    <Icon name={mode.icon} size={19} />
                  </span>
                  <h3>{mode.label}</h3>
                  <p>{mode.tagline}</p>
                  <div className="landing-card-chips">
                    {mode.chips.map((c) => <span key={c}>{c}</span>)}
                  </div>
                  <span className="landing-card-btn">
                    Explore {mode.shortLabel}
                    <Icon name="arrowRight" size={15} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── The studio ────────────────────────────── */}
        <section className="studio-band" aria-labelledby="studio-title">
          <div className="studio-band-copy">
            <span className="kicker"><i>Studio</i> Where the work happens</span>
            <h2 id="studio-title">
              I run <em>{company.name}</em>
            </h2>
            <p>
              {company.tagline} — {company.location}. Client projects get a
              team behind them, not just one pair of hands.
            </p>
            <a
              className="text-link"
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the studio <Icon name="arrowUpRight" size={13} />
            </a>
          </div>

          <ul className="studio-services" aria-label="What the studio does">
            {company.services.map((service, i) => (
              <li key={service}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {service}
              </li>
            ))}
          </ul>

          <figure className="studio-photo">
            <img
              src="/studio-addis.jpg"
              alt="Addis Abeba skyline"
              width="800"
              height="1000"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>{company.location}</span>
              <span>Est. {company.name}</span>
            </figcaption>
          </figure>
        </section>

        {/* ── Selected work ──────────────────────────── */}
        <section id="work" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>02</i> Selected work</span>
            <h2 className="sec-title">
              Recent <em>proof</em>
            </h2>
            <p className="sec-sub">
              Three projects from each discipline. Every one opens into a
              written case study — the problem, the approach, and what it did.
            </p>
          </Reveal>

          <div className="landing-work">
            {SELECTED.map(({ project, mode }, i) => {
              const thumb = coverFor(project);
              return (
              <Link
                key={`${mode.key}-${project.title}`}
                to={mode.route}
                className="landing-work-row"
              >
                <span className="landing-work-num">{String(i + 1).padStart(2, "0")}</span>
                {thumb && (
                  <img
                    className="landing-work-thumb"
                    src={thumb}
                    alt=""
                    width="1120"
                    height="632"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="landing-work-title">{project.title}</span>
                <span className="landing-work-tags">{project.tags.slice(0, 3).join(" · ")}</span>
                <span className="landing-work-mode">{mode.label}</span>
                <Icon name="arrowUpRight" size={16} className="landing-work-arrow" />
              </Link>
              );
            })}
          </div>
        </section>

        {/* ── Process ────────────────────────────────── */}
        <section id="process" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>03</i> How I work</span>
            <h2 className="sec-title">
              Built to <em>deliver</em>
            </h2>
            <p className="sec-sub">
              Three steps, the same on every project — so you always know
              where things stand and what happens next.
            </p>
          </Reveal>

          <div className="process-grid">
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} delay={i * 70} className="process-step">
                <span className="process-num">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Tools ──────────────────────────────────── */}
        <div className="logo-strip" aria-label="Tools and technologies">
          {TOOLS.map((tool) => (
            <span key={tool} className="logo-chip">{tool}</span>
          ))}
        </div>

        {/* ── Journal teaser ─────────────────────────── */}
        <section className="landing-blog">
          <div>
            <h3>Notes on building &amp; editing</h3>
            <p>
              Essays on React structure, retention editing, and honest craft.
            </p>
          </div>
          <Link to="/blog" className="btn btn-ghost">
            Read the journal <Icon name="arrowRight" size={14} />
          </Link>
        </section>

        {/* ── Words from clients ─────────────────────── */}
        <Testimonials />

        {/* ── FAQ ────────────────────────────────────── */}
        <section id="faq" className="landing-pick">
          <Reveal className="sec-head">
            <span className="kicker"><i>05</i> Common questions</span>
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
                      <Icon name="chevronRight" size={15} className="faq-chevron" />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="faq-aside">
              <span className="landing-card-icon" aria-hidden="true">
                <Icon name="send" size={19} />
              </span>
              <h3>Still have questions?</h3>
              <p>
                Message me on Telegram or email — I tend to reply within a
                few hours during the week.
              </p>
              <div className="landing-cta-actions" style={{ justifyContent: "flex-start", marginTop: 0 }}>
                <a
                  href={socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <Icon name="telegram" size={14} /> Telegram
                </a>
                <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                  <Icon name="mail" size={14} /> Email
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────── */}
        <section id="contact" className="landing-cta">
          <span className="kicker">
            <i>Let&apos;s work together</i>
          </span>
          <h2>
            Have a project in mind? <em>Let&apos;s talk.</em>
          </h2>
          <p>{profile.availability.toLowerCase()}.</p>
          <div className="landing-cta-actions">
            <a
              href={socials.telegram}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-lg"
            >
              <Icon name="telegram" size={15} /> Message on Telegram
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="btn btn-ghost btn-lg"
            >
              <Icon name="mail" size={15} /> Email me
            </a>
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
