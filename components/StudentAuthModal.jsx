"use client";

import { useState } from "react";
import { login, register } from "./studentAuth";

// Login / Sign-up popup used before buying a paid mock test.
export default function StudentAuthModal({ reason, onClose, onDone }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && form.password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    try {
      const user = mode === "login" ? await login(form.email.trim(), form.password) : await register({ ...form, email: form.email.trim() });
      onDone(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sa-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="sa-modal" onSubmit={submit}>
        <button type="button" className="sa-close" onClick={onClose} aria-label="Close"><i className="fas fa-times"></i></button>
        <h3>{mode === "login" ? "Log in to continue" : "Create your account"}</h3>
        {reason && <p className="sa-reason">{reason}</p>}

        <div className="sa-tabs">
          <button type="button" className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setError(""); }}>Log in</button>
          <button type="button" className={mode === "register" ? "on" : ""} onClick={() => { setMode("register"); setError(""); }}>Sign up</button>
        </div>

        {mode === "register" && (
          <>
            <label>Full name<input required value={form.name} onChange={set("name")} autoComplete="name" /></label>
            <label>Mobile number<input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" /></label>
          </>
        )}
        <label>Email<input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
        <label>Password<input required type="password" value={form.password} onChange={set("password")} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>

        {error && <div className="sa-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

        <button className="sa-submit" disabled={busy}>
          {busy ? <i className="fas fa-spinner fa-spin"></i> : null} {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
