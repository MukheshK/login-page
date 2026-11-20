import React, { useState } from "react";
import { registerUser } from "../services/api";

export default function RegisterForm({ onRegistered, onSwitchToLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { ok, data } = await registerUser(form);
      if (!ok) {
        setError(data.message || "Registration failed");
        return;
      }
      onRegistered(form.email);
      setForm({ username: "", email: "", password: "" });
    } catch {
      setError("Cannot connect to backend server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>User Register</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
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
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <button type="button" onClick={onSwitchToLogin}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}