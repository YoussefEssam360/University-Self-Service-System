// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // Refresh token 5 minutes before expiry

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        token: null,
        username: null,
        role: null,
        expiresAt: null,
    });

    const inactivityTimerRef = useRef(null);
    const tokenCheckIntervalRef = useRef(null);

    // Check if token is expired or about to expire
    const isTokenExpired = useCallback(() => {
        const expiresAt = localStorage.getItem("expiresAt");
        if (!expiresAt) return true;
        
        const expiryTime = new Date(expiresAt).getTime();
        const now = Date.now();
        
        return now >= expiryTime;
    }, []);

    const shouldRefreshToken = useCallback(() => {
        const expiresAt = localStorage.getItem("expiresAt");
        if (!expiresAt) return false;
        
        const expiryTime = new Date(expiresAt).getTime();
        const now = Date.now();
        
        // Refresh if within threshold of expiration
        return (expiryTime - now) <= TOKEN_REFRESH_THRESHOLD && (expiryTime - now) > 0;
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            const currentToken = localStorage.getItem("token");
            if (!currentToken) return false;

            const res = await axiosClient.post("/Auth/refresh", {
                token: currentToken,
            });

            const data = res.data;

            if (data.success && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("expiresAt", data.expiresAt);
                
                setUser(prev => ({
                    ...prev,
                    token: data.token,
                    expiresAt: data.expiresAt,
                }));
                
                return true;
            }
            return false;
        } catch (err) {
            console.error("Token refresh failed:", err);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("lastActivity");
        
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        if (tokenCheckIntervalRef.current) {
            clearInterval(tokenCheckIntervalRef.current);
        }
        
        setUser({ token: null, username: null, role: null, expiresAt: null });
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (!user.token) return;

        // Clear existing timer
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        // Update last activity timestamp
        localStorage.setItem("lastActivity", Date.now().toString());

        // Set new timer
        inactivityTimerRef.current = setTimeout(() => {
            console.log("Session expired due to inactivity");
            logout();
            // You could show a notification here
            alert("Your session has expired due to inactivity. Please log in again.");
        }, INACTIVITY_TIMEOUT);
    }, [user.token, logout]);

    // Monitor user activity
    useEffect(() => {
        if (!user.token) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        
        const handleActivity = () => {
            resetInactivityTimer();
        };

        // Set up event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        // Initialize timer
        resetInactivityTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [user.token, resetInactivityTimer]);

    // Check token expiration periodically
    useEffect(() => {
        if (!user.token) return;

        // Check immediately
        if (isTokenExpired()) {
            console.log("Token expired");
            logout();
            alert("Your session has expired. Please log in again.");
            return;
        }

        // Set up periodic check (every minute)
        tokenCheckIntervalRef.current = setInterval(async () => {
            if (isTokenExpired()) {
                console.log("Token expired during interval check");
                logout();
                alert("Your session has expired. Please log in again.");
            } else if (shouldRefreshToken()) {
                console.log("Attempting to refresh token");
                const refreshed = await refreshToken();
                if (!refreshed) {
                    console.log("Token refresh failed, logging out");
                    logout();
                    alert("Your session could not be renewed. Please log in again.");
                }
            }
        }, 60 * 1000); // Check every minute

        return () => {
            if (tokenCheckIntervalRef.current) {
                clearInterval(tokenCheckIntervalRef.current);
            }
        };
    }, [user.token, isTokenExpired, shouldRefreshToken, refreshToken, logout]);

    // load from localStorage on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const expiresAt = localStorage.getItem("expiresAt");

        if (token && role) {
            // Check if token is expired before setting user
            const expiryTime = expiresAt ? new Date(expiresAt).getTime() : 0;
            const now = Date.now();
            
            if (expiryTime > now) {
                setUser({ token, username, role, expiresAt });
            } else {
                // Clean up expired session
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("expiresAt");
            }
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

            const { token, role, username: returnedUsername, expiresAt } = data;

            localStorage.setItem("token", token);
            localStorage.setItem("username", returnedUsername);
            localStorage.setItem("role", role);
            localStorage.setItem("expiresAt", expiresAt);
            localStorage.setItem("lastActivity", Date.now().toString());

            setUser({ token, username: returnedUsername, role, expiresAt });

            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message };
        }
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
