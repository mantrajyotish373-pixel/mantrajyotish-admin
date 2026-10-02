import React, { useEffect, useState, useCallback } from 'react';
import { apiBase } from '../config/authSession';

const MODULES = ['auth', 'team', 'users', 'astrologers', 'kyc', 'interviews', 'bookings', 'payments', 'finance', 'withdrawals', 'coupons', 'banners', 'dashboard'];

const statusClass = (code) =>
  code >= 500 ? 'bg-red-50 text-red-500' : code >= 400 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600';

export default function AuditLogPage() {
  const [items, setItems] = useState([]);
  const [team, setTeam] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ q: '', module: '', actorId: '', from: '', to: '' });
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '50' });
    Object.entries(filters).forEach(([k, v]) => {
      if (!v) return;
      params.set(k, k === 'to' ? new Date(`${v}T23:59:59`).toISOString() : k === 'from' ? new Date(`${v}T00:00:00`).toISOString() : v);
    });
    try {
      const res = await fetch(`${apiBase}/api/admin/audit-logs?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load audit log');
      setItems(json.data); setPage(json.pagination.page); setPages(json.pagination.pages); setTotal(json.pagination.total); setError('');
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(1); }, [load]);
  useEffect(() => {
    fetch(`${apiBase}/api/admin/team`).then((r) => r.json()).then((j) => j.success && setTeam(j.data)).catch(() => {});
  }, []);

  const input = 'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Audit Log</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">Every login, change and denied attempt by admins. Passwords are never stored here. {total.toLocaleString('en-IN')} entries.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input className={`${input} w-56`} placeholder="Search name, email, action…" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className={input} value={filters.actorId} onChange={(e) => setFilters({ ...filters, actorId: e.target.value })}>
          <option value="">All people</option>
          {team.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <select className={input} value={filters.module} onChange={(e) => setFilters({ ...filters, module: e.target.value })}>
          <option value="">All modules</option>
          {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="date" className={input} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" className={input} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-sm font-semibold">{error}</div>}

      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60">
              <th className="p-3">When</th><th className="p-3">Who</th><th className="p-3">Action</th><th className="p-3">Details</th><th className="p-3">Result</th><th className="p-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4 text-slate-400" colSpan={6}>Loading…</td></tr> : items.length === 0 ? (
              <tr><td className="p-6 text-center text-slate-400" colSpan={6}>No entries match.</td></tr>
            ) : items.map((x) => (
              <React.Fragment key={x._id}>
                <tr onClick={() => setOpen(open === x._id ? null : x._id)} className="border-b border-slate-50 dark:border-slate-700/40 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-700/20">
                  <td className="p-3 whitespace-nowrap text-xs text-slate-500">{new Date(x.createdAt).toLocaleString('en-IN')}</td>
                  <td className="p-3"><div className="font-semibold text-slate-800 dark:text-slate-100">{x.actorName || '—'}</div><div className="text-[11px] text-slate-400">{x.actorEmail}</div></td>
                  <td className="p-3"><span className="text-[11px] font-mono font-bold text-[#FA5A24]">{x.action}</span></td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300 max-w-md truncate">{x.summary}</td>
                  <td className="p-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusClass(x.statusCode)}`}>{x.statusCode || '—'}</span></td>
                  <td className="p-3 text-xs text-slate-400">{x.ip}</td>
                </tr>
                {open === x._id && (
                  <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                    <td colSpan={6} className="p-3">
                      <pre className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all">{JSON.stringify({ method: x.method, path: x.path, userAgent: x.userAgent, details: x.details }, null, 2)}</pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400 text-xs">Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40">Previous</button>
          <button disabled={page >= pages} onClick={() => load(page + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
