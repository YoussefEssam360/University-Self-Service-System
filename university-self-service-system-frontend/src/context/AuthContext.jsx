// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        token: null,
        username: null,
        role: null,
    });

    // load from localStorage on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");

        if (token && role) {
            setUser({ token, username, role });
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axiosClient.post("/Auth/login", {
                username,
                password,
            });

            const data = res.data;

            if (!data.success) {
                throw new Error(
                    data.errors?.[0] ?? "Login failed. Please check your credentials."
                );
            }

            const { token, role, username: returnedUsername } = data;

            localStorage.setItem("token", token);
            localStorage.setItem("username", returnedUsername);
            localStorage.setItem("role", role);

            setUser({ token, username: returnedUsername, role });

            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setUser({ token: null, username: null, role: null });
    };

    const isAuthenticated = !!user.token;
    const isAdmin = user.role === "Admin";

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, isAdmin, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
