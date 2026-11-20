import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [infoMessage, setInfoMessage] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegistered = (email) => {
    setRegisteredEmail(email);
    setInfoMessage("Registration successful. Please log in.");
    setMode("login");
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif" }}>
      {infoMessage && <p style={{ color: "green" }}>{infoMessage}</p>}

      {mode === "login" ? (
        <LoginForm
          prefillEmail={registeredEmail}
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={() => {
            setInfoMessage("");
            setMode("register");
          }}
        />
      ) : (
        <RegisterForm
          onRegistered={handleRegistered}
          onSwitchToLogin={() => {
            setInfoMessage("");
            setMode("login");
          }}
        />
      )}
    </div>
  );
}