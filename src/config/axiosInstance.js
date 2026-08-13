import axios from "axios";

/**
 * Production Centralized Axios Instance for Admin Frontend.
 * Reads single backend URL from VITE_BACKEND_URL in .env
 */
const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://mantrajyotish-backend.vercel.app";
const baseURL = backendUrl.replace(/\/$/, "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

// Request Interceptor: Automatically attach Admin Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Admin Unauthorized 401. Token expired or invalid.");
    }
    return Promise.reject(error);
  }
);

export default api;
