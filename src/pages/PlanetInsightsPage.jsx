import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi } from '../config/adminApi';
import ImageUploadField from '../components/ImageUploadField';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm';
const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';
const Label = ({ children, hint }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{children}{hint && <span className="normal-case font-medium"> · {hint}</span>}</label>
);

const COLORS = [
  ['bg-orange-200', 'Orange'], ['bg-sky-200', 'Blue'], ['bg-red-200', 'Red'], ['bg-green-200', 'Green'],
  ['bg-yellow-200', 'Yellow'], ['bg-pink-200', 'Pink'], ['bg-gray-300', 'Grey'], ['bg-purple-200', 'Purple'], ['bg-cyan-200', 'Cyan']
];

function InsightModal({ item, onClose, onSaved }) {
  const isNew = !item._id;
  const [f, setF] = useState({
    title: item.title || '', description: item.description || '', details: item.details || '',
    image: item.image || '', bgColor: item.bgColor || 'bg-orange-200', status: item.status || 'active'
  });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setBusy(true); setErr('');
    try {
      if (isNew) await adminApi('/planet-insights', { method: 'POST', body: f });
      else await adminApi(`/planet-insights/${item._id}`, { method: 'PUT', body: f });
      onSaved(isNew ? 'Insight added' : 'Insight updated');
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{isNew ? 'Add planetary insight' : 'Edit planetary insight'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label hint={item.key ? 'leave empty to keep the built-in picture' : ''}>Image</Label>
            <ImageUploadField value={f.image} onChange={(v) => setF({ ...f, image: v })} hint="Shown in a round frame — use a square image" />
          </div>
          <div className="md:col-span-2"><Label hint="emoji + name">Title</Label><input className={input} value={f.title} onChange={set('title')} placeholder="☀️ Sun (Surya)" /></div>
          <div className="md:col-span-2"><Label hint="shown on the card, max 200 characters">Short description</Label><input className={input} maxLength={200} value={f.description} onChange={set('description')} /></div>
          <div className="md:col-span-2"><Label hint="shown when the user taps the card">Full details</Label><textarea rows={5} className={input} value={f.details} onChange={set('details')} /></div>
          <div><Label>Card colour</Label>
            <select className={input} value={f.bgColor} onChange={set('bgColor')}>{COLORS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </div>
          <div><Label>Status</Label>
            <select className={input} value={f.status} onChange={set('status')}><option value="active">Visible in app</option><option value="hidden">Hidden</option></select>
          </div>
        </div>
        {err && <p className="mt-3 text-sm text-red-500 font-semibold">{err}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
          <button onClick={save} disabled={busy || !f.title.trim() || !f.description.trim()} className={btn}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

export default function PlanetInsightsPage() {
  const canManage = can('planets.manage');
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); const [msg, setMsg] = useState(null);

  const flash = (text, ok = true) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 4000); };
  const load = useCallback(async () => {
    try { const r = await adminApi('/planet-insights'); setRows(r.data); }
    catch (e) { flash(e.message, false); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (p) => {
    try { await adminApi(`/planet-insights/${p._id}`, { method: 'PUT', body: { status: p.status === 'active' ? 'hidden' : 'active' } }); await load(); }
    catch (e) { flash(e.message, false); }
  };
  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.title}"?`)) return;
    try { await adminApi(`/planet-insights/${p._id}`, { method: 'DELETE' }); flash('Insight removed'); await load(); } catch (e) { flash(e.message, false); }
  };
  const move = async (i, dir) => {
    const a = rows[i], b = rows[i + dir];
    if (!a || !b) return;
    try {
      await Promise.all([
        adminApi(`/planet-insights/${a._id}`, { method: 'PUT', body: { sortOrder: i + dir } }),
        adminApi(`/planet-insights/${b._id}`, { method: 'PUT', body: { sortOrder: i } })
      ]);
      await load();
    } catch (e) { flash(e.message, false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Planetary Insights</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">The planet cards shown on the user app home page. Changes appear in the app on its next refresh.</p>
        </div>
        {canManage && <button className={`${btn} whitespace-nowrap`} onClick={() => setModal({})}>+ Add insight</button>}
      </div>

      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>{msg.text}</div>}

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Planet</th><th className="p-3">Short description</th><th className="p-3">Status</th>{canManage && <th className="p-3 text-right">Actions</th>}</tr></thead>
          <tbody>
            {loading ? <tr><td className="p-6 text-center text-slate-400" colSpan={4}>Loading…</td></tr>
              : rows.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={4}>No insights yet.</td></tr>
              : rows.map((p, i) => (
                <tr key={p._id} className="border-b border-slate-50 dark:border-slate-700/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-900/40 overflow-hidden shrink-0 flex items-center justify-center text-[9px] text-slate-400">{p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : 'default'}</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{p.title}</div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-slate-500 max-w-sm">{p.description}</td>
                  <td className="p-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/40'}`}>{p.status === 'active' ? 'Visible' : 'Hidden'}</span></td>
                  {canManage && (
                    <td className="p-3 text-right whitespace-nowrap text-xs font-bold">
                      <div className="flex justify-end gap-3">
                        <button disabled={i === 0} onClick={() => move(i, -1)} className="text-slate-500 disabled:opacity-30" title="Move earlier">↑</button>
                        <button disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="text-slate-500 disabled:opacity-30" title="Move later">↓</button>
                        <button onClick={() => setModal(p)} className="text-[#FA5A24] hover:underline">Edit</button>
                        <button onClick={() => toggle(p)} className="text-amber-600 hover:underline">{p.status === 'active' ? 'Hide' : 'Show'}</button>
                        <button onClick={() => remove(p)} className="text-red-500 hover:underline">Remove</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modal && <InsightModal item={modal} onClose={() => setModal(null)} onSaved={(t) => { setModal(null); flash(t); load(); }} />}
    </div>
  );
}
