import "./AuthPage.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import server from "./environment.js";

const GemStar = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <defs>
      <linearGradient id="gLg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8ab4f8" />
        <stop offset="33%"  stopColor="#c58af9" />
        <stop offset="66%"  stopColor="#f8a8c8" />
        <stop offset="100%" stopColor="#fdd663" />
      </linearGradient>
    </defs>
    <path d="M18 2C18 2 20 13 27 18C20 23 18 34 18 34C18 34 16 23 9 18C16 13 18 2 18 2Z" fill="url(#gLg)" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${server}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.message || "Invalid email or password."); return; }

      // Store token however your backend returns it
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      setError("Could not connect to server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      {/* Back to landing */}
      <button className="auth-back" onClick={() => navigate("/")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back
      </button>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-star"><GemStar /></div>
          <span className="auth-logo-text">AskNova</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue your conversations.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
                type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}