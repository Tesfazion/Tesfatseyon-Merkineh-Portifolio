/**
 * Contact — direct channels plus a form that composes an email.
 *
 * There is no backend on a static site, so the form does the honest thing:
 * it validates properly, then hands a fully composed message to the
 * visitor's mail client. It never claims a message was "sent" — the
 * success panel tells the truth about what just happened, because a fake
 * confirmation is worse than no confirmation.
 */
import { useState } from "react";
import { profile, socials, SOCIAL_KEYS } from "../config";
import { usePortfolio } from "../PortfolioContext.js";
import Reveal from "./Reveal";
import Icon from "./Icon";

/* Deliberately permissive: the only thing worse than a false rejection is
   blocking a valid address that happens to be unusual. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (f) => {
  const errors = {};
  if (!f.name.trim()) errors.name = "Tell me who you are.";
  if (!f.email.trim()) errors.email = "I need an address to reply to.";
  else if (!EMAIL.test(f.email.trim())) errors.email = "That address doesn't look right.";
  if (f.message.trim().length < 12) {
    errors.message = "A sentence or two about the project helps me reply usefully.";
  }
  return errors;
};

export default function Contact() {
  const mode = usePortfolio();
  const [status, setStatus] = useState("idle"); // idle | ready | sent
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState({
    name: "", email: "", topic: mode.formTopics[0], message: "",
  });

  const channels = [
    { icon: "telegram", label: "Telegram", value: "@Zizo1616", href: socials.telegram, external: true },
    { icon: "mail", label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: profile.email },
    {
      icon: "phone", label: "Phone / WhatsApp", value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
  ];

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    // Clear a field's error as soon as it is edited, rather than making
    // the visitor submit again to find out whether the fix worked.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "sent") setStatus("idle");
  };

  const onBlur = (e) => {
    const { name } = e.target;
    const found = validate(fields);
    if (found[name]) setErrors((prev) => ({ ...prev, [name]: found[name] }));
  };

  const composeMailto = () => {
    const subject = encodeURIComponent(`[Portfolio] ${fields.topic} — from ${fields.name}`);
    const body = encodeURIComponent(
      `Name: ${fields.name}\nEmail: ${fields.email}\nTopic: ${fields.topic}\n\n${fields.message}`
    );
    return `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader
      // users are not left wondering why nothing happened.
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    window.location.href = composeMailto();
    setStatus("sent");
  };

  const copyEmail = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>06</i> Contact</span>
          <h2 className="sec-title">
            Let&apos;s build something{" "}
            <em>together</em>
          </h2>
          <p className="sec-sub">
            Telegram is the fastest way to reach me — or fill in the form and
            your email client will open with it ready to send. I usually
            respond within a few hours during the week.
          </p>
        </Reveal>

        <div className="contact-grid">
          {/* ── Info ── */}
          <Reveal className="contact-info">
            {channels.map((c) => (
              <div key={c.label} className="contact-channel-row">
                <a
                  href={c.href}
                  className="contact-channel"
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="contact-icon" aria-hidden="true">
                    <Icon name={c.icon} size={18} />
                  </span>
                  <span className="contact-channel-text">
                    <span className="contact-label">{c.label}</span>
                    <span className="contact-value">{c.value}</span>
                  </span>
                  {c.external && <Icon name="external" size={14} className="contact-ext" />}
                </a>
                {c.copy && (
                  <button
                    type="button"
                    className="contact-copy"
                    onClick={() => copyEmail(c.copy)}
                    aria-label={`Copy ${c.copy} to the clipboard`}
                  >
                    <Icon name={copied ? "check" : "copy"} size={14} />
                    <span className="sr-only">
                      {copied ? "Copied" : "Copy email address"}
                    </span>
                  </button>
                )}
              </div>
            ))}

            <div className="contact-response-badge">
              <span className="pulse-dot" aria-hidden="true" />
              Usually replies within 2 hours
            </div>

            <div className="contact-socials">
              <p>Find me online</p>
              <div className="hero-socials">
                {SOCIAL_KEYS.map((key) => (
                  <a
                    key={key}
                    href={socials[key]}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={key}
                  >
                    <Icon name={key} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Form ── */}
          <Reveal delay={100}>
            {status === "sent" ? (
              <div className="form-success" role="status">
                <span className="form-success-icon">
                  <Icon name="check" size={24} />
                </span>
                <h3>Your email client should be open</h3>
                <p>
                  Nothing has been sent yet — the message is sitting in a draft
                  waiting for you to press send. If nothing opened, copy this
                  address and email me directly: <strong>{profile.email}</strong>
                </p>
                <div className="form-success-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => window.location.href = composeMailto()}
                  >
                    <Icon name="send" size={14} /> Open it again
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => copyEmail(profile.email)}
                  >
                    <Icon name="copy" size={14} /> {copied ? "Copied" : "Copy address"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setStatus("idle");
                      setFields({ name: "", email: "", topic: mode.formTopics[0], message: "" });
                    }}
                  >
                    Write another
                  </button>
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name" name="name" type="text"
                      placeholder="John Doe"
                      value={fields.name} onChange={onChange} onBlur={onBlur}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "cf-name-err" : undefined}
                      required autoComplete="name"
                      className={errors.name ? "form-field--error" : ""}
                    />
                    {errors.name && (
                      <span className="form-error" id="cf-name-err" role="alert">{errors.name}</span>
                    )}
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email" name="email" type="email"
                      placeholder="john@example.com"
                      value={fields.email} onChange={onChange} onBlur={onBlur}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "cf-email-err" : undefined}
                      required autoComplete="email"
                      className={errors.email ? "form-field--error" : ""}
                    />
                    {errors.email && (
                      <span className="form-error" id="cf-email-err" role="alert">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-topic">What do you need?</label>
                  <select
                    id="cf-topic" name="topic" value={fields.topic} onChange={onChange}
                    className={errors.topic ? "form-field--error" : ""}
                  >
                    {mode.formTopics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message" name="message" rows="5"
                    placeholder="Tell me about your project, timeline, and budget range…"
                    value={fields.message} onChange={onChange} onBlur={onBlur}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "cf-message-err" : undefined}
                    required
                    className={errors.message ? "form-field--error" : ""}
                  />
                  {errors.message && (
                    <span className="form-error" id="cf-message-err" role="alert">{errors.message}</span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  <Icon name="send" size={16} /> Send Message
                </button>

                <p className="form-hint">
                  Opens your email client with the message pre-filled — you
                  press send, I reply within 2 hours on weekdays.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
