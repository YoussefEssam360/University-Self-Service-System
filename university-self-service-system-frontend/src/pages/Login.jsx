// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(username, password);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        // role is stored in localStorage by AuthContext.login
        const role = localStorage.getItem("role") ?? "";

        // route by role (case-sensitive match of stored role)
        if (role === "Admin") {
            navigate("/admin");
        } else if (role === "Student") {
            navigate("/student");
        } else if (role === "Professor") {
            navigate("/professor");
        } else {
            navigate("/"); // fallback
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "3rem auto" }}>
            <h2>Login</h2>

            {error && (
                <div
                    style={{
                        backgroundColor: "#ffe6e6",
                        border: "1px solid #ff8080",
                        padding: "0.5rem 1rem",
                        marginBottom: "1rem",
                    }}
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem" }}
                            required
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem" }}
                            required
                        />
                    </label>
                </div>

                <button type="submit" style={{ padding: "0.5rem 1rem" }}>
                    Login
                </button>
            </form>
        </div>
    );
}
