import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../api/client";

function Navbar() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="nav-logo" onClick={() => navigate("/dashboard")}>
        <span className="logo-dot" />
        <span className="logo-text">Calorie Tracker</span>
      </div>

      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        ☰
      </label>

      <nav className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>

        <button className="btn logout" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
