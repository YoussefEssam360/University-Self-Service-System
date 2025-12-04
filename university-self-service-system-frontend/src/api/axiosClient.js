// src/api/axiosClient.js
import axios from "axios";

// TODO: change this URL to your backend URL (the one you use for Swagger)
const axiosClient = axios.create({
    baseURL: "https://localhost:7013/api", // <-- replace port if different
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
