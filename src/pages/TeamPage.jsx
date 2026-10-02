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

const emptyForm = { name: '', email: '', password: '', roleId: '', permissions: [], status: 'active' };

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', member } | { mode: 'password', member }
  const [form, setForm] = useState(emptyForm);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, r, c] = await Promise.all([api('/team'), api('/roles'), api('/permissions')]);
      setTeam(t.data); setRoles(r.data); setCatalog(c.data); setError('');
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 4000); };

  const openCreate = () => { setForm(emptyForm); setModal({ mode: 'create' }); setError(''); };
  const openEdit = (m) => {
    setForm({ name: m.name, email: m.email, password: '', roleId: m.roleId || '', permissions: m.permissions || [], status: m.status });
    setModal({ mode: 'edit', member: m }); setError('');
  };

  // Picking a role pre-fills the grid; the permissions can still be adjusted for this person.
  const pickRole = (roleId) => {
    const role = roles.find((r) => r._id === roleId);
    setForm((f) => ({ ...f, roleId, permissions: role ? role.permissions : f.permissions }));
  };

  const save = async () => {
    setSaving(true); setError('');
    try {
      const body = { name: form.name, email: form.email, roleId: form.roleId || null, permissions: form.permissions };
      if (modal.mode === 'create') {
        await api('/team', { method: 'POST', body: { ...body, password: form.password } });
        flash('Team member created');
      } else {
        await api(`/team/${modal.member._id}`, { method: 'PUT', body: { ...body, status: form.status } });
        flash('Team member updated. Permission changes apply immediately.');
      }
      setModal(null); await load();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const toggleStatus = async (m) => {
    const next = m.status === 'active' ? 'disabled' : 'active';
    if (next === 'disabled' && !window.confirm(`Disable ${m.name}? They will be logged out immediately.`)) return;
    try { await api(`/team/${m._id}`, { method: 'PUT', body: { status: next } }); flash(`${m.name} ${next === 'active' ? 'enabled' : 'disabled'}`); await load(); } catch (e) { setError(e.message); }
  };

  const remove = async (m) => {
    if (!window.confirm(`Permanently delete ${m.name} (${m.email})? This cannot be undone.`)) return;
    try { await api(`/team/${m._id}`, { method: 'DELETE' }); flash('Team member deleted'); await load(); } catch (e) { setError(e.message); }
  };

  const resetPassword = async () => {
    setSaving(true); setError('');
    try {
      await api(`/team/${modal.member._id}/reset-password`, { method: 'POST', body: { password: newPassword } });
      flash('Password reset. The member was logged out everywhere.');
      setModal(null); setNewPassword('');
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const input = 'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm w-full';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Team Members</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Only you (super admin) can add sub-admins and decide what each one can see or do.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 whitespace-nowrap">+ Add Sub-admin</button>
      </div>

      {notice && <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-sm font-semibold">{notice}</div>}
      {error && !modal && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-sm font-semibold">{error}</div>}

      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60">
              <th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Access</th><th className="p-3">Status</th><th className="p-3">Last login</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4 text-slate-400" colSpan={6}>Loading…</td></tr> : team.map((m) => (
              <tr key={m._id} className="border-b border-slate-50 dark:border-slate-700/40">
                <td className="p-3"><div className="font-bold text-slate-800 dark:text-slate-100">{m.name}</div><div className="text-xs text-slate-400">{m.email}</div></td>
                <td className="p-3 text-slate-600 dark:text-slate-300">{m.roleName}</td>
                <td className="p-3 text-xs text-slate-500">{m.role === 'superadmin' ? 'Everything' : `${m.permissions.length} permissions`}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${m.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-red-50 text-red-500 dark:bg-red-950/40'}`}>{m.status === 'active' ? 'Active' : 'Disabled'}</span>
                </td>
                <td className="p-3 text-xs text-slate-500">{m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleString('en-IN') : 'Never'}</td>
                <td className="p-3 text-right whitespace-nowrap text-xs font-bold">
                  {m.role === 'superadmin' ? <span className="text-slate-400">Protected</span> : (
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(m)} className="text-[#FA5A24] hover:underline">Edit</button>
                      <button onClick={() => { setModal({ mode: 'password', member: m }); setNewPassword(''); setError(''); }} className="text-slate-500 hover:underline">Reset password</button>
                      <button onClick={() => toggleStatus(m)} className="text-amber-600 hover:underline">{m.status === 'active' ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => remove(m)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && modal.mode !== 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{modal.mode === 'create' ? 'Add sub-admin' : `Edit ${modal.member.name}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input className={input} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={input} placeholder="Email (login)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {modal.mode === 'create' && <input className={input} type="password" placeholder="Temporary password (min 8 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
              <select className={input} value={form.roleId} onChange={(e) => pickRole(e.target.value)}>
                <option value="">Role: none (custom permissions)</option>
                {roles.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
              {modal.mode === 'edit' && (
                <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option><option value="disabled">Disabled</option>
                </select>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">Choosing a role fills in its permissions. You can then tick or untick anything (including delete users / delete astrologers) for just this person.</p>
            <PermissionGrid catalog={catalog} value={form.permissions} onChange={(permissions) => setForm({ ...form, permissions })} />
            {error && <p className="mt-3 text-sm text-red-500 font-semibold">{error}</p>}
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
              <button onClick={save} disabled={saving || !form.name.trim() || !form.email.trim() || (modal.mode === 'create' && form.password.length < 8)} className="px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.mode === 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Reset password</h2>
            <p className="text-xs text-slate-400 mb-4">{modal.member.name} will be logged out everywhere and must use the new password.</p>
            <input className={input} type="password" placeholder="New password (min 8 characters)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            {error && <p className="mt-3 text-sm text-red-500 font-semibold">{error}</p>}
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
              <button onClick={resetPassword} disabled={saving || newPassword.length < 8} className="px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Reset password'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
