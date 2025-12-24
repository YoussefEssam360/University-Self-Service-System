// src/api/axiosClient.js
import axios from "axios";

// Use Azure API in production, localhost in development
// In development, use HTTP instead of HTTPS to avoid certificate issues
const baseURL = import.meta.env.PROD
    ? "https://university-self-service-api-a9gdfdbqhpdedrfa.uaenorth-01.azurewebsites.net/api"  // Use the FULL URL from Azure
    : "http://localhost:5051/api";  // Use HTTP port in development to avoid SSL certificate issues

const axiosClient = axios.create({
    baseURL: baseURL,
    timeout: 10000, // 10 second timeout
});

// Automatically attach JWT if we have it
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses (expired/invalid tokens)
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 and haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const currentToken = localStorage.getItem("token");
                if (!currentToken) {
                    // No token to refresh, redirect to login
                    window.location.href = "/";
                    return Promise.reject(error);
                }

                // Try to refresh the token
                const refreshResponse = await axios.post(`${baseURL}/Auth/refresh`, {
                    token: currentToken,
                });

                if (refreshResponse.data.success && refreshResponse.data.token) {
                    const { token, expiresAt } = refreshResponse.data;
                    
                    localStorage.setItem("token", token);
                    localStorage.setItem("expiresAt", expiresAt);

                    // Update the authorization header
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    
                    // Retry the original request
                    return axiosClient(originalRequest);
                } else {
                    // Refresh failed, clear storage and redirect
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("role");
                    localStorage.removeItem("expiresAt");
                    window.location.href = "/";
                }
            } catch (refreshError) {
                // Refresh failed, clear storage and redirect
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("expiresAt");
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
