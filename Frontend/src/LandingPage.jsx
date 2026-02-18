import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const GemStar = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <defs>
      <linearGradient id="gL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8ab4f8" />
        <stop offset="33%"  stopColor="#c58af9" />
        <stop offset="66%"  stopColor="#f8a8c8" />
        <stop offset="100%" stopColor="#fdd663" />
      </linearGradient>
    </defs>
    <path d="M18 2C18 2 20 13 27 18C20 23 18 34 18 34C18 34 16 23 9 18C16 13 18 2 18 2Z" fill="url(#gL)" />
  </svg>
);

const FEATURES = [
  { icon: "⚡", title: "Lightning Fast", desc: "Responses in milliseconds. No waiting, no lag — just instant answers." },
  { icon: "🧠", title: "Deeply Intelligent", desc: "Powered by state-of-the-art language models trained on vast knowledge." },
  { icon: "💻", title: "Code & Debug", desc: "Write, review, and debug code in any language with syntax highlighting." },
  { icon: "🔒", title: "Private & Secure", desc: "Your conversations are yours. End-to-end security on every message." },
  { icon: "🌐", title: "Multilingual", desc: "Communicate naturally in over 50 languages without missing a beat." },
  { icon: "🎯", title: "Context Aware", desc: "Remembers your conversation flow for natural, coherent dialogue." },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Software Engineer", text: "AskNova replaced half my Stack Overflow searches. It's like having a senior dev on call 24/7.", avatar: "P" },
  { name: "Rohan M.", role: "CS Student", text: "I use it every single day for assignments, debugging, and understanding concepts. Absolute game changer.", avatar: "R" },
  { name: "Ananya K.", role: "Product Manager", text: "From writing PRDs to summarizing meetings — AskNova handles it all beautifully.", avatar: "A" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo">
            <div className="land-logo-star"><GemStar size={32} /></div>
            <span className="land-logo-text">AskNova</span>
          </div>
          <div className="land-nav-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className="land-nav-actions">
            <button className="btn-ghost" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>Get started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-badge">
          <span className="badge-dot" />
          Now with AskNova 1.5 Pro
        </div>

        <h1 className="hero-title">
          The AI that thinks<br />
          <span className="hero-grad">with you.</span>
        </h1>

        <p className="hero-sub">
          AskNova is your intelligent companion for coding, writing, research,<br />
          and every hard question in between.
        </p>

        <div className="hero-actions">
          <button className="btn-primary btn-lg" onClick={() => navigate("/signup")}>
            Start for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <button className="btn-ghost btn-lg" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>

        {/* Floating chat preview card */}
        <div className="hero-card">
          <div className="hero-card-msg ai">
            <div className="hc-avatar">✦</div>
            <div className="hc-bubble">
              Hi! I'm AskNova. Ask me anything — from debugging code to explaining black holes.
            </div>
          </div>
          <div className="hero-card-msg user">
            <div className="hc-bubble user">
              Explain recursion like I'm 5.
            </div>
            <div className="hc-avatar user">Y</div>
          </div>
          <div className="hero-card-msg ai">
            <div className="hc-avatar">✦</div>
            <div className="hc-bubble typing">
              Imagine you're looking for your toy in a box. If it's not there, you look inside a smaller box inside it — and keep going until you find it! That's recursion.
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="section-label">Why AskNova</div>
          <h2 className="section-title">Everything you need,<br /><span className="grad-text">nothing you don't.</span></h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-inner">
          <div className="section-label">People love it</div>
          <h2 className="section-title">Trusted by students<br /><span className="grad-text">and professionals.</span></h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="t-stars">{"★".repeat(5)}</div>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">
                  <div className="t-avatar">{t.avatar}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="section-inner cta-inner">
          <div className="cta-star"><GemStar size={52} /></div>
          <h2 className="cta-title">Ready to ask<br /><span className="hero-grad">anything?</span></h2>
          <p className="cta-sub">Join thousands of users already chatting with AskNova.</p>
          <button className="btn-primary btn-lg" onClick={() => navigate("/signup")}>
            Create free account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-logo">
            <div className="land-logo-star"><GemStar size={22} /></div>
            <span className="land-logo-text" style={{fontSize:"16px"}}>AskNova</span>
          </div>
          <p className="footer-copy">© 2025 AskNova · Built by Joyita Bhattacharjee</p>
        </div>
      </footer>

    </div>
  );
}