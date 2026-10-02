import { apiBase } from './authSession';

// Calls /api/admin/* with the session handling from authSession (token attach + silent refresh).
export const adminApi = async (path, opts = {}) => {
  const res = await fetch(`${apiBase}/api/admin${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
};

export const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const fmtSeconds = (s) => {
  s = Math.max(0, Math.round(Number(s) || 0));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return `${h ? `${h}h ` : ''}${m}m ${r}s`;
};
