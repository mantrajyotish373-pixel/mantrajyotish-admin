import axios from "axios";
import { getAccessToken, refreshAccessToken, hasSession, clearSession, SESSION_EXPIRED_EVENT } from "./authSession";

/**
 * Production Centralized Axios Instance for Admin Frontend.
 * Reads single backend URL from VITE_BACKEND_URL in .env
 */
const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://api.mantrajyotish.com";
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
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: on 401 refresh the access token once and retry; end the session only if refresh is rejected.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && original && !original._retried) {
      original._retried = true;
      const outcome = await refreshAccessToken();
      if (outcome === "ok") {
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return api(original);
      }
      if (outcome === "invalid" || !hasSession()) {
        clearSession();
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
