import Reveal from "./Reveal";

const TESTIMONIALS = [
  {
    text: "The website he built for us turned browsers into actual customers. Fast, clean, and exactly what we described — no surprises.",
    name: "Sarah K.",
    role: "Founder, Ethio-Sunshine Tech",
  },
  {
    text: "I send him raw footage and get back Reels that keep people watching. The captions and pacing are noticeably better than what we were doing in-house.",
    name: "Daniel T.",
    role: "Content Creator",
  },
  {
    text: "Honest about timelines, clean about code. The hospital dashboard he delivered is already saving our admin team hours every week.",
    name: "Dr. Lami B.",
    role: "Operations Lead",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <Reveal className="sec-head">
          <span className="kicker"><i>04</i> Testimonials</span>
          <h2 className="sec-title">
            Trusted by <em>clients</em>
          </h2>
          <p className="sec-sub">
            A small selection of what people say after working together.
          </p>
        </Reveal>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <div className="testimonial-card">
                <p className="testimonial-text">“{t.text}”</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar" aria-hidden="true">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <span>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
