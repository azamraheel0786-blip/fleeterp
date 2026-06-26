import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────── */
const T = {
  navy:    "#0A0F1E",
  navy2:   "#111827",
  blue:    "#2563EB",
  blueHov: "#1D4ED8",
  blueGlow:"rgba(37,99,235,0.18)",
  slate:   "#64748B",
  slateL:  "#94A3B8",
  border:  "#E2E8F0",
  bg:      "#F8FAFC",
  white:   "#FFFFFF",
  success: "#16A34A",
  successBg:"#F0FDF4",
  error:   "#DC2626",
  errorBg: "#FEF2F2",
  errorBorder:"#FECACA",
};

/* ─── KEYFRAMES injected once ────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lf-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #EEF2FF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -20%, rgba(37,99,235,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(99,102,241,0.10) 0%, transparent 60%);
  }

  .lf-card {
    display: flex;
    width: 100%;
    max-width: 900px;
    min-height: 560px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(10,15,30,0.18), 0 4px 16px rgba(10,15,30,0.08);
    animation: lf-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes lf-rise {
    from { opacity: 0; transform: translateY(24px) scale(0.985); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  /* LEFT */
  .lf-left {
    width: 42%;
    background: ${T.navy};
    padding: 44px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .lf-left-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .lf-left-orb-1 {
    width: 280px; height: 280px;
    border: 48px solid rgba(255,255,255,0.04);
    top: -90px; right: -80px;
  }
  .lf-left-orb-2 {
    width: 180px; height: 180px;
    border: 32px solid rgba(255,255,255,0.04);
    bottom: 20px; left: -60px;
  }
  .lf-left-orb-3 {
    width: 120px; height: 120px;
    background: rgba(37,99,235,0.15);
    bottom: 140px; right: -30px;
    filter: blur(24px);
  }

  .lf-logo-wrap {
    position: relative; z-index: 1;
  }
  .lf-logo-icon {
    width: 48px; height: 48px;
    background: rgba(37,99,235,0.25);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
    backdrop-filter: blur(8px);
  }
  .lf-brand-name {
    font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .lf-brand-sub {
    font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6;
  }

  .lf-features { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; }
  .lf-feature {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 12px 14px;
    transition: background 0.2s, border-color 0.2s;
  }
  .lf-feature:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.16); }
  .lf-feat-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(37,99,235,0.30);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .lf-feat-label { font-size: 13px; font-weight: 600; color: #fff; }
  .lf-feat-sub   { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  /* RIGHT */
  .lf-right {
    flex: 1;
    background: ${T.white};
    display: flex; align-items: center; justify-content: center;
    padding: 48px 44px;
  }
  .lf-form-wrap { width: 100%; max-width: 340px; }

  .lf-eyebrow {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; color: ${T.blue};
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  .lf-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: ${T.blue};
    animation: lf-pulse 2s ease-in-out infinite;
  }
  @keyframes lf-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(0.8); }
  }

  .lf-title { font-size: 26px; font-weight: 700; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 6px; }
  .lf-subtitle { font-size: 14px; color: ${T.slateL}; margin-bottom: 28px; }

  .lf-alert {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 10px; margin-bottom: 20px;
    font-size: 13px; font-weight: 500;
    animation: lf-shake 0.35s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes lf-shake {
    10%,90%  { transform: translate3d(-1px,0,0); }
    20%,80%  { transform: translate3d(2px,0,0); }
    30%,50%,70% { transform: translate3d(-3px,0,0); }
    40%,60%  { transform: translate3d(3px,0,0); }
  }
  .lf-alert-error {
    background: ${T.errorBg}; color: ${T.error}; border: 1px solid ${T.errorBorder};
  }

  .lf-field { margin-bottom: 16px; }
  .lf-label {
    display: block; font-size: 11px; font-weight: 700; color: #64748B;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px;
  }
  .lf-input-wrap { position: relative; }
  .lf-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: #CBD5E1; pointer-events: none;
    display: flex; align-items: center;
  }
  .lf-input {
    width: 100%; padding: 11px 14px 11px 38px;
    border: 1.5px solid ${T.border}; border-radius: 10px;
    font-size: 14px; font-family: 'Inter', sans-serif;
    color: #0F172A; background: ${T.bg};
    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .lf-input::placeholder { color: #CBD5E1; }
  .lf-input:focus {
    border-color: ${T.blue};
    box-shadow: 0 0 0 3px ${T.blueGlow};
    background: ${T.white};
  }
  .lf-input:focus + .lf-input-icon,
  .lf-input-wrap:focus-within .lf-input-icon { color: ${T.blue}; }

  .lf-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #94A3B8;
    display: flex; padding: 4px;
    transition: color 0.15s;
  }
  .lf-pw-toggle:hover { color: #475569; }

  .lf-btn {
    width: 100%; padding: 12px;
    border: none; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    margin-top: 4px;
  }
  .lf-btn-primary {
    background: ${T.blue}; color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
  }
  .lf-btn-primary:hover:not(:disabled) {
    background: ${T.blueHov};
    box-shadow: 0 6px 20px rgba(37,99,235,0.45);
    transform: translateY(-1px);
  }
  .lf-btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.99); }
  .lf-btn-primary:disabled { background: #94A3B8; box-shadow: none; cursor: not-allowed; }

  @keyframes lf-spin { to { transform: rotate(360deg); } }
  .lf-spinner { animation: lf-spin 0.7s linear infinite; }

  .lf-hint {
    display: flex; align-items: center; gap: 8px;
    margin-top: 18px; padding: 10px 14px;
    background: ${T.bg}; border: 1px solid ${T.border}; border-radius: 10px;
    font-size: 12px; color: ${T.slateL};
  }
  .lf-hint strong { color: #475569; }

  /* SUCCESS */
  .lf-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 16px;
    animation: lf-rise 0.4s ease both;
  }
  .lf-success-ring {
    width: 72px; height: 72px; border-radius: 50%;
    background: ${T.successBg}; border: 2px solid rgba(22,163,74,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .lf-success-check { stroke-dasharray: 28; stroke-dashoffset: 28; animation: lf-draw 0.5s ease 0.1s forwards; }
  @keyframes lf-draw { to { stroke-dashoffset: 0; } }
  .lf-success-title { font-size: 20px; font-weight: 700; color: #0F172A; }
  .lf-success-sub   { font-size: 13px; color: ${T.slateL}; }

  /* RESPONSIVE */
  @media (max-width: 640px) {
    .lf-left  { display: none; }
    .lf-right { padding: 36px 28px; }
    .lf-card  { border-radius: 16px; }
  }
`;

export default function Loginform() {
  const navigate = useNavigate();
  const [fields, setFields]           = useState({ username: "", password: "" });
  const [error, setError]             = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!fields.username || !fields.password) { setError("Please fill in all fields."); return false; }
    if (fields.username !== "admin" || fields.password !== "1234") {
      setError("Invalid username or password.");
      setFields(f => ({ ...f, password: "" }));
      return false;
    }
    return true;
  };

 const handleSubmit = async () => {
  if(!fields.username || !fields.password) {
    setError("Please fill in all fields.");
    return;
  }
  setLoading(true);
  setError("");

  const result = await login(fields.username, fields.password);

  if(result.success) {
    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 1200);
  } else {
    setError(result.message || "Invalid username or password.");
    setFields(f => ({ ...f, password: "" }));
    setLoading(false);
  }
};

  const features = [
    { icon: "🚚", label: "Delivery Orders", sub: "Real-time track & manage" },
    { icon: "📍", label: "Vehicle Tracking", sub: "Live GPS fleet visibility" },
    { icon: "📊", label: "Reports & Analytics", sub: "Data-driven decisions" },
  ];

  return (
    <div className="lf-root">
      <div className="lf-card">

        {/* ── LEFT ── */}
        <div className="lf-left">
          <div className="lf-left-orb lf-left-orb-1" />
          <div className="lf-left-orb lf-left-orb-2" />
          <div className="lf-left-orb lf-left-orb-3" />

          <div className="lf-logo-wrap">
            <div className="lf-logo-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 21V10l5-3v3l5-3v3l5-3v11M9 21v-4h6v4" />
              </svg>
            </div>
            <div className="lf-brand-name">FleetERP</div>
            <div className="lf-brand-sub">
              Manage delivery orders, track vehicles and generate reports — all in one place.
            </div>
          </div>

          <div className="lf-features">
            {features.map(f => (
              <div className="lf-feature" key={f.label}>
                <div className="lf-feat-icon">
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                </div>
                <div>
                  <div className="lf-feat-label">{f.label}</div>
                  <div className="lf-feat-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="lf-right">
          {success ? (
            <div className="lf-success">
              <div className="lf-success-ring">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path className="lf-success-check" d="M5 13l4 4L19 7"
                    stroke="#16A34A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="lf-success-title">Signed in successfully</div>
                <div className="lf-success-sub">Redirecting to dashboard…</div>
              </div>
            </div>
          ) : (
            <div className="lf-form-wrap">
              <div className="lf-eyebrow">
                <span className="lf-eyebrow-dot" />
                Secure Access
              </div>
              <div className="lf-title">Welcome back</div>
              <div className="lf-subtitle">Sign in to your ERP account to continue</div>

              {error && (
                <div className="lf-alert lf-alert-error">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Username */}
              <div className="lf-field">
                <label className="lf-label">Username</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    className="lf-input"
                    type="text" name="username"
                    value={fields.username} onChange={handleChange}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lf-field">
                <label className="lf-label">Password</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    className="lf-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={fields.password} onChange={handleChange}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    className="lf-pw-toggle" type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                className="lf-btn lf-btn-primary"
                onClick={handleSubmit} disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="lf-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <div className="lf-hint">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
              
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}