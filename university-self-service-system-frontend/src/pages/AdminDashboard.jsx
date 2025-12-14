import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    // Fill the entire viewport so the dark background covers the whole screen
    const pageStyle = {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0c", // same dark theme as login
        color: "white",
        padding: "2rem",
        boxSizing: "border-box",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: 1000,
        background: "#0f0f10",
        borderRadius: 12,
        padding: "2.5rem",
        boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
        position: "relative",
        boxSizing: "border-box",
    };

    const titleStyle = {
        margin: 0,
        fontSize: "3rem",
        fontWeight: 700,
        textAlign: "center",
    };

    const subtitleStyle = {
        marginTop: 12,
        color: "#bbb",
        textAlign: "center",
    };

    const logoutStyle = {
        position: "absolute",
        top: 18,
        right: 18,
        background: "#111",
        color: "white",
        border: "1px solid #222",
        padding: "0.5rem 0.8rem",
        borderRadius: 8,
        cursor: "pointer",
    };

    const actionsRow = {
        marginTop: 28,
        display: "flex",
        justifyContent: "center",
        gap: 16,
    };

    const primaryButton = {
        background: "#2b6cff",
        color: "white",
        padding: "0.8rem 1.1rem",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        textDecoration: "none",
        display: "inline-block",
    };

    const neutralButton = {
        background: "#111",
        color: "white",
        padding: "0.8rem 1.1rem",
        borderRadius: 8,
        border: "1px solid #222",
        cursor: "pointer",
        fontWeight: 600,
        textDecoration: "none",
        display: "inline-block",
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <button onClick={logout} style={logoutStyle}>Logout</button>

                <h1 style={titleStyle}>Admin Dashboard</h1>

                <div style={subtitleStyle}>
                    Welcome, <strong style={{ color: "white" }}>{user?.username}</strong>
                </div>

                <div style={actionsRow}>
                    <Link to="/admin/courses" style={primaryButton}>Course Management</Link>
                    <Link to="/admin/professors" style={neutralButton}>Professor Management</Link>
                    <Link to="/admin/students" style={neutralButton}>Student Management</Link>
                </div>
            </div>
        </div>
    );
}