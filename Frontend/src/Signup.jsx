import "./AuthPage.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import server from "./environment.js";

const GemStar = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <defs>
      <linearGradient id="gSg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8ab4f8" />
        <stop offset="33%"  stopColor="#c58af9" />
        <stop offset="66%"  stopColor="#f8a8c8" />
        <stop offset="100%" stopColor="#fdd663" />
      </linearGradient>
    </defs>
    <path d="M18 2C18 2 20 13 27 18C20 23 18 34 18 34C18 34 16 23 9 18C16 13 18 2 18 2Z" fill="url(#gSg)" />
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${server}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.message || "Signup failed. Try again."); return; }

      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      setError("Could not connect to server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ea4335", "#fdd663", "#34a853"];

  return (
    <div className="auth-page">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <button className="auth-back" onClick={() => navigate("/")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-star"><GemStar /></div>
          <span className="auth-logo-text">AskNova</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start chatting with AskNova for free.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text" name="name" placeholder="Joyita Bhattacharjee"
                value={form.name} onChange={handleChange} autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                type="password" name="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} autoComplete="new-password"
              />
            </div>
            {form.password.length > 0 && (
              <div className="strength-row">
                <div className="strength-bar">
                  <div className="strength-fill" style={{ width: `${(strength/3)*100}%`, background: strengthColor[strength] }} />
                </div>
                <span className="strength-label" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm password</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <input
                type="password" name="confirm" placeholder="Repeat password"
                value={form.confirm} onChange={handleChange} autoComplete="new-password"
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}