import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./StudentLayout.css";

export default function StudentLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="student-root">
      <header className="student-header">
        <div className="brand">University Self-Service</div>

        <nav className="student-nav" aria-label="Student navigation">
          <NavLink to="/student" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Registration
          </NavLink>
          <NavLink to="grades" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Grades
          </NavLink>
        </nav>

        <div className="user-actions">
          <span className="user-name">{user?.username ?? user?.name ?? "Student"}</span>
          <button type="button" className="btn-logout" onClick={() => logout?.()}>
            Logout
          </button>
        </div>
      </header>

      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}