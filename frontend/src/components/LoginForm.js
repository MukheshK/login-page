import React, { useState, useEffect } from "react";
import { loginUser } from "../services/api";

export default function LoginForm({ prefillEmail = "", onLoginSuccess, onSwitchToRegister }) {
  const [form, setForm] = useState({ email: prefillEmail, password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefillEmail) {
      setForm((prev) => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { ok, data } = await loginUser(form);
      if (!ok) {
        setError(data.message || "Invalid email or password");
        return;
      }
      onLoginSuccess(data.token, data.user);
    } catch {
      setError("Cannot connect to backend server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <button type="button" onClick={onSwitchToRegister}>
          Need an account? Register
        </button>
      </div>
    </div>
  );
}