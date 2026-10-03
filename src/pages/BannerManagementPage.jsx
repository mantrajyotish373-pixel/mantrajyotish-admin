import React, { useCallback, useEffect, useRef, useState } from 'react';
import { can, apiBase } from '../config/authSession';
import { adminApi, fmtDate } from '../config/adminApi';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm';
const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';
const btnGhost = 'px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/40 disabled:opacity-50';
const Label = ({ children, hint }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{children}{hint && <span className="normal-case font-medium"> · {hint}</span>}</label>
);

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;
// Screens in the user app a banner can open when tapped
const ROUTES = [
  { value: '', label: 'Do nothing' },
  { value: 'Wallet', label: 'Wallet / Add money' },
  { value: 'Chat', label: 'Chat with astrologers' },
  { value: 'Pooja', label: 'Pooja' },
  { value: 'AstroStore', label: 'Astro Store' }
];

const toLocalInput = (d) => {
  if (!d) return '';
  const x = new Date(d);
  return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const kb = (n) => `${Math.max(1, Math.round((n || 0) / 1024))} KB`;
const isLive = (b) => {
  const now = Date.now();
  return b.status === 'active' && (!b.startsAt || new Date(b.startsAt) <= now) && (!b.endsAt || new Date(b.endsAt) >= now);
};

const emptyForm = { name: '', route: '', order: '', status: 'active', startsAt: '', endsAt: '' };

export default function BannerManagementPage() {
  const canManage = can('banners.manage');
  const [banners, setBanners] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | banner
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  const flash = (text, ok = true) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 5000); };
  const load = useCallback(async () => {
    try { setBanners((await adminApi('/banners')).data); } catch (e) { setBanners([]); flash(e.message, false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const openNew = () => {
    setEditing('new'); setForm({ ...emptyForm, order: (banners?.length || 0) + 1 }); setFile(null); setPreview('');
  };
  const openEdit = (b) => {
    setEditing(b);
    setForm({ name: b.name, route: b.route || '', order: b.order, status: b.status, startsAt: toLocalInput(b.startsAt), endsAt: toLocalInput(b.endsAt) });
    setFile(null); setPreview(b.imageUrl);
  };
  const close = () => { setEditing(null); setFile(null); setPreview(''); };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ACCEPT.includes(f.type)) { flash('Please choose a JPG, JPEG, PNG or WebP image', false); e.target.value = ''; return; }
    if (f.size > MAX_MB * 1024 * 1024) { flash(`Image is too large (max ${MAX_MB} MB)`, false); e.target.value = ''; return; }
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  // Multipart upload; the global fetch wrapper adds the admin token
  const send = async (url, method, fields, imageFile) => {
    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => body.append(k, v ?? ''));
    if (imageFile) body.append('image', imageFile);
    const res = await fetch(`${apiBase}/api/admin${url}`, { method, body });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) throw new Error(json.message || `Request failed (${res.status})`);
    return json;
  };

  const fieldsOf = () => ({
    name: form.name.trim(), route: form.route, order: form.order === '' ? '' : Number(form.order), status: form.status,
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '', endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : ''
  });

  const save = async () => {
    if (!form.name.trim()) return flash('Give the banner a name', false);
    if (editing === 'new' && !file) return flash('Choose a banner image', false);
    setBusy(true);
    try {
      if (editing === 'new') await send('/banners', 'POST', fieldsOf(), file);
      else await send(`/banners/${editing._id}`, 'PUT', fieldsOf(), file);
      flash('Banner saved. Users see it the next time they open the app.');
      close(); await load();
    } catch (e) { flash(e.message, false); }
    setBusy(false);
  };

  const toggle = async (b) => {
    try { await adminApi(`/banners/${b._id}`, { method: 'PUT', body: { status: b.status === 'active' ? 'paused' : 'active' } }); await load(); }
    catch (e) { flash(e.message, false); }
  };
  const remove = async (b) => {
    if (!window.confirm(`Delete banner "${b.name}"? This cannot be undone.`)) return;
    try { await adminApi(`/banners/${b._id}`, { method: 'DELETE' }); flash('Banner deleted'); await load(); }
    catch (e) { flash(e.message, false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Banner Management</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Banners on the app's home screen. Upload a JPG, JPEG or PNG; it is converted to a small WebP automatically.</p>
        </div>
        {canManage && <button className={`${btn} whitespace-nowrap`} onClick={openNew}>+ Add banner</button>}
      </div>

      {msg && <div className={`text-sm font-semibold rounded-xl px-4 py-2.5 ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{msg.text}</div>}

      {banners === null ? <div className="text-sm text-slate-400">Loading…</div> : banners.length === 0 ? (
        <div className={`${card} text-sm text-slate-400`}>No banners yet. The app shows its built-in banners until you add one.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b._id} className={card}>
              <img src={b.imageUrl} alt={b.name} className="w-full rounded-xl aspect-[2.35/1] object-cover bg-slate-100" loading="lazy" />
              <div className="flex items-start justify-between gap-3 mt-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 dark:text-slate-100 truncate">{b.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Order {b.order} · WebP {b.width}×{b.height} · {kb(b.imageBytes)} · Opens: {ROUTES.find((r) => r.value === b.route)?.label || b.route || 'nothing'}
                  </div>
                  <div className="text-xs text-slate-400">Schedule: {b.startsAt ? fmtDate(b.startsAt) : 'now'} → {b.endsAt ? fmtDate(b.endsAt) : 'no end'}</div>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full whitespace-nowrap ${isLive(b) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {b.status === 'paused' ? 'Paused' : isLive(b) ? 'Live' : 'Scheduled / expired'}
                </span>
              </div>
              {canManage && (
                <div className="flex gap-2 mt-3">
                  <button className={btnGhost} onClick={() => openEdit(b)}>Edit</button>
                  <button className={btnGhost} onClick={() => toggle(b)}>{b.status === 'active' ? 'Pause' : 'Activate'}</button>
                  <button className={`${btnGhost} text-rose-600`} onClick={() => remove(b)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && !busy && close()}>
          <div className={`${card} w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4`}>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{editing === 'new' ? 'Add banner' : 'Edit banner'}</h2>

            <div>
              <Label hint={`JPG, JPEG, PNG or WebP · max ${MAX_MB} MB · shown at 2.35 : 1`}>Banner image</Label>
              <div
                className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 aspect-[2.35/1] flex items-center justify-center overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-900/30"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400 font-semibold">Click to choose an image</span>}
              </div>
              <input ref={fileRef} type="file" accept={ACCEPT.join(',')} className="hidden" onChange={pickFile} />
              {file && <p className="text-[11px] text-slate-400 mt-1">{file.name} · {kb(file.size)} — will be resized and converted to WebP on save.</p>}
            </div>

            <div><Label>Name</Label><input className={input} value={form.name} onChange={set('name')} maxLength={80} placeholder="e.g. Diwali recharge offer" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label hint="when tapped">Opens screen</Label>
                <select className={input} value={form.route} onChange={set('route')}>
                  {ROUTES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div><Label hint="1 = first">Order</Label><input type="number" className={input} value={form.order} onChange={set('order')} /></div>
              <div><Label hint="optional">Show from</Label><input type="datetime-local" className={input} value={form.startsAt} onChange={set('startsAt')} /></div>
              <div><Label hint="optional">Hide after</Label><input type="datetime-local" className={input} value={form.endsAt} onChange={set('endsAt')} /></div>
            </div>
            <div>
              <Label>Status</Label>
              <select className={input} value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button className={btnGhost} onClick={close} disabled={busy}>Cancel</button>
              <button className={btn} onClick={save} disabled={busy}>{busy ? 'Converting & uploading…' : 'Save banner'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
