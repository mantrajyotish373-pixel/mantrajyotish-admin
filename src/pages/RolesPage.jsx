import React, { useEffect, useState, useCallback } from 'react';
import { apiBase } from '../config/authSession';
import PermissionGrid from '../components/PermissionGrid';

const api = async (path, opts = {}) => {
  const res = await fetch(`${apiBase}/api/admin${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
};

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [editing, setEditing] = useState(null); // null | role object | {} for new
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([api('/roles'), api('/permissions')]);
      setRoles(r.data);
      setCatalog(c.data);
      setError('');
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm({ name: '', description: '', permissions: [] }); setEditing({}); setError(''); };
  const openEdit = (r) => { setForm({ name: r.name, description: r.description || '', permissions: r.permissions || [] }); setEditing(r); setError(''); };

  const save = async () => {
    setSaving(true); setError('');
    try {
      if (editing._id) await api(`/roles/${editing._id}`, { method: 'PUT', body: form });
      else await api('/roles', { method: 'POST', body: form });
      setEditing(null);
      await load();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete role "${r.name}"? Members keep their current permissions.`)) return;
    try { await api(`/roles/${r._id}`, { method: 'DELETE' }); await load(); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Roles & Permissions</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Create named roles (e.g. Support, Finance). A role is a starting template: its permissions are copied to a team member when you create them, and can then be changed per person.</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90">+ New Role</button>
      </div>

      {error && !editing && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-sm font-semibold">{error}</div>}
      {loading ? <p className="text-sm text-slate-400">Loading…</p> : roles.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-sm">No roles yet. Create your first role to get started.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div key={r._id} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{r.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{r.description || 'No description'}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FA5A24] whitespace-nowrap">{r.memberCount} member{r.memberCount === 1 ? '' : 's'}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">{r.permissions.length} permission{r.permissions.length === 1 ? '' : 's'}</p>
              <div className="flex gap-3 mt-3 text-xs font-bold">
                <button onClick={() => openEdit(r)} className="text-[#FA5A24] hover:underline">Edit</button>
                <button onClick={() => remove(r)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{editing._id ? 'Edit role' : 'New role'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Role name (e.g. Support)" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm" />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm" />
            </div>
            <PermissionGrid catalog={catalog} value={form.permissions} onChange={(permissions) => setForm({ ...form, permissions })} />
            {error && <p className="mt-3 text-sm text-red-500 font-semibold">{error}</p>}
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
              <button onClick={save} disabled={saving || !form.name.trim()} className="px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save role'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
