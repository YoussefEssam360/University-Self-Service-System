import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axiosClient from "../api/axiosClient";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Signup modal state
    const [showSignup, setShowSignup] = useState(false);
    const [signUpForm, setSignUpForm] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "", // no default selection
        phoneNumber: "",
        department: "",
        major: "",
        dateOfBirth: "" // ISO string from <input type="date">
    });
    const [signupError, setSignupError] = useState("");
    const [signingUp, setSigningUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(username, password);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        const role = localStorage.getItem("role") ?? "";
        if (role === "Admin") navigate("/admin");
        else if (role === "Student") navigate("/student");
        else if (role === "Professor") navigate("/professor");
        else navigate("/");
    };

    const openSignup = () => {
        setSignupError("");
        setShowSignup(true);
    };

    const closeSignup = () => {
        setShowSignup(false);
        setSignUpForm({
            username: "",
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "", // no default selection
            phoneNumber: "",
            department: "",
            major: "",
            dateOfBirth: "" // ISO string from <input type="date">
        });
        setSigningUp(false);
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignUpForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupError("");

        if (!signUpForm.username || !signUpForm.fullName || !signUpForm.email || !signUpForm.password) {
            setSignupError("Please fill all required fields.");
            return;
        }
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setSignupError("Passwords do not match.");
            return;
        }
        if (!signUpForm.role) {
            setSignupError("Please select an account type (Student or Professor).");
            return;
        }
        if (signUpForm.role === "Student") {
            if (!signUpForm.phoneNumber?.trim() || !signUpForm.major?.trim() || !signUpForm.dateOfBirth) {
                setSignupError("Phone Number, Major, and Date of Birth are required for students.");
                return;
            }
        }
        if (signUpForm.role === "Professor") {
            if (!signUpForm.department?.trim() || !signUpForm.phoneNumber?.trim()) {
                setSignupError("Department and Phone Number are required for professors.");
                return;
            }
        }

        setSigningUp(true);

        try {
            const payload = {
                username: signUpForm.username,
                fullName: signUpForm.fullName,
                email: signUpForm.email,
                password: signUpForm.password,
                role: signUpForm.role,
                phoneNumber: signUpForm.phoneNumber,
                major: signUpForm.role === "Student" ? signUpForm.major : null,
                dateOfBirth: signUpForm.role === "Student" ? signUpForm.dateOfBirth : null,
                department: signUpForm.role === "Professor" ? signUpForm.department : null
            };

            await axiosClient.post("/Auth/register", payload);
            await login(signUpForm.username, signUpForm.password);

            if (signUpForm.role === "Student") navigate("/student");
            else if (signUpForm.role === "Professor") navigate("/professor");
            else navigate("/");

            closeSignup();
        } catch (err) {
            console.error(err);
            setSignupError(
                err?.response?.data?.errors?.[0] ??
                err?.response?.data?.message ??
                "Sign up failed. Check the data or server logs."
            );
        } finally {
            setSigningUp(false);
        }
    };

    const pageStyle = {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0c",
        color: "white",
        padding: "1rem",
        boxSizing: "border-box",
    };

    const panelPadding = "2rem";

    const boxStyle = {
        width: "100%",
        maxWidth: 420,
        background: "#0f0f10",
        padding: panelPadding,
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
        boxSizing: "border-box",
    };

    const modalStyle = {
        width: "100%",
        maxWidth: 520,
        background: "#0c0c0d",
        padding: panelPadding,
        borderRadius: 8,
        color: "white",
        boxSizing: "border-box",
    };

    const fieldWrapStyle = {
        marginBottom: "0.75rem",
        display: "block",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 6,
        fontSize: 14,
    };

    const inputStyle = {
        width: "100%",
        padding: "0.55rem 0.6rem",
        marginTop: 0,
        boxSizing: "border-box",
        borderRadius: 4,
        border: "1px solid #333",
        background: "#222",
        color: "white",
    };

    const rowStyle = {
        display: "flex",
        gap: "0.5rem",
        marginTop: "1rem",
    };

    const twoColRow = {
        display: "flex",
        gap: 8,
    };

    const radioRow = {
        display: "flex",
        gap: 20,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
    };

    const buttonStyle = {
        padding: "0.6rem 0.8rem",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
    };

    const primaryButton = {
        ...buttonStyle,
        background: "#2b6cff",
        color: "white",
    };

    const neutralButton = {
        ...buttonStyle,
        background: "#111",
        color: "white",
        border: "1px solid #222",
    };

    return (
        <div style={pageStyle}>
            <div style={boxStyle}>
                <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>Sign in</h2>

                {error && (
                    <div style={{ background: "#ffe6e6", color: "#900", padding: "0.5rem", marginBottom: "1rem" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={fieldWrapStyle}>
                        <label style={labelStyle}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={fieldWrapStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={rowStyle}>
                        <button type="submit" style={{ ...neutralButton, flex: 1 }}>
                            Login
                        </button>

                        <button
                            type="button"
                            style={{ ...primaryButton, flex: 1 }}
                            onClick={openSignup}
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>

            {showSignup && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000 }} onClick={closeSignup} role="dialog" aria-modal="true">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                            <h3 style={{ marginTop: 0 }}>Create an account</h3>

                            {signupError && (
                                <div style={{ background: "#ffe6e6", color: "#900", padding: "0.5rem", marginBottom: "1rem" }}>
                                    {signupError}
                                </div>
                            )}

                            <form onSubmit={handleSignup}>
                                <div style={fieldWrapStyle}>
                                    <label style={labelStyle}>Username</label>
                                    <input
                                        name="username"
                                        value={signUpForm.username}
                                        onChange={handleSignupChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={fieldWrapStyle}>
                                    <label style={labelStyle}>Full Name</label>
                                    <input
                                        name="fullName"
                                        value={signUpForm.fullName}
                                        onChange={handleSignupChange}
                                        style={inputStyle}
                                        placeholder="e.g. John Smith"
                                        required
                                    />
                                </div>

                                <div style={fieldWrapStyle}>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        name="email"
                                        value={signUpForm.email}
                                        onChange={handleSignupChange}
                                        style={inputStyle}
                                        type="email"
                                        required
                                    />
                                </div>

                                <div style={twoColRow}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Password</label>
                                        <input
                                            name="password"
                                            value={signUpForm.password}
                                            onChange={handleSignupChange}
                                            style={inputStyle}
                                            type="password"
                                            required
                                        />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Confirm</label>
                                        <input
                                            name="confirmPassword"
                                            value={signUpForm.confirmPassword}
                                            onChange={handleSignupChange}
                                            style={inputStyle}
                                            type="password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={radioRow}>
                                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Student"
                                            checked={signUpForm.role === "Student"}
                                            onChange={handleSignupChange}
                                        />
                                        Student
                                    </label>

                                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Professor"
                                            checked={signUpForm.role === "Professor"}
                                            onChange={handleSignupChange}
                                        />
                                        Professor
                                    </label>
                                </div>

                                {signUpForm.role === "Professor" && (
                                    <>
                                        <div style={fieldWrapStyle}>
                                            <label style={labelStyle}>Phone Number</label>
                                            <input
                                                name="phoneNumber"
                                                value={signUpForm.phoneNumber}
                                                onChange={handleSignupChange}
                                                style={inputStyle}
                                                placeholder="e.g. +1 234 567 8901"
                                                required
                                            />
                                        </div>

                                        <div style={fieldWrapStyle}>
                                            <label style={labelStyle}>Department</label>
                                            <select
                                                name="department"
                                                value={signUpForm.department}
                                                onChange={handleSignupChange}
                                                style={{ ...inputStyle, appearance: "none" }}
                                                required
                                            >
                                                <option value="">Select department</option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Business">Business</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {signUpForm.role === "Student" && (
                                    <>
                                        <div style={fieldWrapStyle}>
                                            <label style={labelStyle}>Phone Number</label>
                                            <input
                                                name="phoneNumber"
                                                value={signUpForm.phoneNumber}
                                                onChange={handleSignupChange}
                                                style={inputStyle}
                                                placeholder="e.g. +1 234 567 8901"
                                                required
                                            />
                                        </div>

                                        <div style={fieldWrapStyle}>
                                            <label style={labelStyle}>Major</label>
                                            <select
                                                name="major"
                                                value={signUpForm.major}
                                                onChange={handleSignupChange}
                                                style={{ ...inputStyle, appearance: "none" }}
                                                required
                                            >
                                                <option value="">Select major</option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Business">Business</option>
                                            </select>
                                        </div>

                                        <div style={fieldWrapStyle}>
                                            <label style={labelStyle}>Date of Birth</label>
                                            <input
                                                name="dateOfBirth"
                                                value={signUpForm.dateOfBirth}
                                                onChange={handleSignupChange}
                                                style={inputStyle}
                                                type="date"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div style={{ marginTop: "1rem" }}>
                                    <button
                                        type="submit"
                                        style={{ ...primaryButton, width: "100%" }}
                                        disabled={signingUp}
                                    >
                                        {signingUp ? "Signing up..." : "Create Account"}
                                    </button>
                                </div>
                            </form>

                            <div style={{ marginTop: "1rem", textAlign: "center", fontSize: 14, color: "#ccc" }}>
                                By signing up, you agree to our <a href="/terms" style={{ color: "#2b6cff" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#2b6cff" }}>Privacy Policy</a>.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}