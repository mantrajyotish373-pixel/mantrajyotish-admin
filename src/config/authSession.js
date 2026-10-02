const BASE = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://api.mantrajyotish.com").replace(/\/$/, "");

const K = { access: "authToken", refresh: "refreshToken", user: "user", flag: "isAuthenticated" };
const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } };
const drop = (k) => { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } };

export const SESSION_EXPIRED_EVENT = "admin-session-expired";

export const getAccessToken = () => read(K.access);
export const hasSession = () => !!read(K.refresh);

export const saveSession = ({ token, refreshToken, admin }) => {
  if (token) write(K.access, token);
  if (refreshToken) write(K.refresh, refreshToken);
  if (admin) write(K.user, JSON.stringify(admin));
  write(K.flag, "true");
};

export const clearSession = () => {
  [K.access, K.refresh, K.user, K.flag, "token"].forEach(drop);
};

const isAuthEndpoint = (url) => /\/api\/admin\/(login|refresh|logout)(\?|$)/.test(url);

let refreshing = null;
export const refreshAccessToken = () => {
  if (refreshing) return refreshing;
  const refreshToken = read(K.refresh);
  if (!refreshToken) return Promise.resolve(false);

  refreshing = window.__nativeFetch(`${BASE}/api/admin/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  })
    .then(async (res) => {
      if (res.status === 401 || res.status === 403) return "invalid";
      if (!res.ok) return "unavailable";
      const json = await res.json();
      if (!json.success || !json.data?.token) return "invalid";
      write(K.access, json.data.token);
      if (json.data.admin) write(K.user, JSON.stringify(json.data.admin));
      return "ok";
    })
    .catch(() => "unavailable")
    .finally(() => { refreshing = null; });
  return refreshing;
};

const expire = () => {
  clearSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

export const logout = async () => {
  const refreshToken = read(K.refresh);
  try {
    if (refreshToken) {
      await window.__nativeFetch(`${BASE}/api/admin/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
    }
  } catch { /* offline: local logout still proceeds */ }
  clearSession();
};

// Every call to our backend gets the admin token attached; a 401 triggers one silent
// token refresh and a retry. Only a rejected refresh token ends the session.
export const installAuthFetch = () => {
  if (window.__nativeFetch) return;
  window.__nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    if (!url.startsWith(BASE) || isAuthEndpoint(url)) return window.__nativeFetch(input, init);

    const withAuth = () => {
      const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return { ...init, headers };
    };

    let res = await window.__nativeFetch(input, withAuth());
    if (res.status !== 401) return res;

    const outcome = await refreshAccessToken();
    if (outcome === "ok") return window.__nativeFetch(input, withAuth());
    if (outcome === "invalid" || !hasSession()) expire();
    return res;
  };
};

export const apiBase = BASE;
