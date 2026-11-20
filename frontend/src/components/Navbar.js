import React from "react";

export default function Navbar({ username, onLogout }) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2>Home</h2>
        <p style={{ margin: 0 }}>Welcome, {username || "User"}</p>
      </div>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
}