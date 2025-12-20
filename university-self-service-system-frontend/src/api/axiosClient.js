// src/api/axiosClient.js
import axios from "axios";

// Use Azure API in production, localhost in development
const baseURL = import.meta.env.PROD
    ? "https://university-self-service-api.azurewebsites.net/api"
    : "https://localhost:7013/api";

const axiosClient = axios.create({
    baseURL: baseURL,
});

// Automatically attach JWT if we have it
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
