import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi, inr } from '../config/adminApi';
import ImageUploadField from '../components/ImageUploadField';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm';
const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';
const Label = ({ children, hint }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{children}{hint && <span className="normal-case font-medium"> · {hint}</span>}</label>
);

const CATEGORIES = ['Mala & Beads', 'Gemstones', 'Yantras', 'Pooja Items', 'Idols', 'Other'];

function ProductModal({ product, onClose, onSaved }) {
  const isNew = !product._id;
  const [f, setF] = useState({
    title: product.title || '', category: product.category || CATEGORIES[0], description: product.description || '',
    price: product.price ?? '', oldPrice: product.oldPrice || '', rating: product.rating ?? 4.5,
    image: product.image || '', popular: !!product.popular, status: product.status || 'active'
  });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setBusy(true); setErr('');
    const body = { ...f, price: Number(f.price), oldPrice: f.oldPrice === '' ? 0 : Number(f.oldPrice), rating: Number(f.rating) };
    try {
      if (isNew) await adminApi('/store-products', { method: 'POST', body });
      else await adminApi(`/store-products/${product._id}`, { method: 'PUT', body });
      onSaved(isNew ? 'Product added' : 'Product updated');
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{isNew ? 'Add product' : 'Edit product'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><Label>Product image</Label><ImageUploadField value={f.image} onChange={(v) => setF({ ...f, image: v })} /></div>
          <div className="md:col-span-2"><Label>Title</Label><input className={input} value={f.title} onChange={set('title')} placeholder="e.g. 5 Mukhi Rudraksha Mala" /></div>
          <div><Label>Category</Label>
            <input className={input} list="store-cats" value={f.category} onChange={set('category')} />
            <datalist id="store-cats">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div><Label>Status</Label>
            <select className={input} value={f.status} onChange={set('status')}><option value="active">Visible in app</option><option value="hidden">Hidden</option></select>
          </div>
          <div><Label hint="₹ customers pay">Selling price</Label><input type="number" min={0} className={input} value={f.price} onChange={set('price')} /></div>
          <div><Label hint="₹ struck through, optional">Old price (MRP)</Label><input type="number" min={0} className={input} value={f.oldPrice} onChange={set('oldPrice')} /></div>
          <div><Label hint="0 – 5">Rating</Label><input type="number" min={0} max={5} step={0.1} className={input} value={f.rating} onChange={set('rating')} /></div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mt-6"><input type="checkbox" checked={f.popular} onChange={(e) => setF({ ...f, popular: e.target.checked })} /> Show “Bestseller” badge</label>
          <div className="md:col-span-2"><Label hint="optional">Description</Label><textarea rows={3} className={input} value={f.description} onChange={set('description')} /></div>
        </div>
        {err && <p className="mt-3 text-sm text-red-500 font-semibold">{err}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
          <button onClick={save} disabled={busy || !f.title.trim() || !f.category.trim() || f.price === ''} className={btn}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  const canManage = can('store.manage');
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); const [msg, setMsg] = useState(null);

  const flash = (text, ok = true) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 4000); };
  const load = useCallback(async () => {
    try { const r = await adminApi('/store-products'); setRows(r.data); }
    catch (e) { flash(e.message, false); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (p) => {
    try { await adminApi(`/store-products/${p._id}`, { method: 'PUT', body: { status: p.status === 'active' ? 'hidden' : 'active' } }); await load(); }
    catch (e) { flash(e.message, false); }
  };
  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.title}" from the store?`)) return;
    try { await adminApi(`/store-products/${p._id}`, { method: 'DELETE' }); flash('Product removed'); await load(); } catch (e) { flash(e.message, false); }
  };
  const move = async (i, dir) => {
    const a = rows[i], b = rows[i + dir];
    if (!a || !b) return;
    try {
      await Promise.all([
        adminApi(`/store-products/${a._id}`, { method: 'PUT', body: { sortOrder: i + dir } }),
        adminApi(`/store-products/${b._id}`, { method: 'PUT', body: { sortOrder: i } })
      ]);
      await load();
    } catch (e) { flash(e.message, false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Astro Store</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Products shown in the Astro Store on the user app. Changes appear in the app on its next refresh.</p>
        </div>
        {canManage && <button className={`${btn} whitespace-nowrap`} onClick={() => setModal({})}>+ Add product</button>}
      </div>

      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>{msg.text}</div>}

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Rating</th><th className="p-3">Status</th>{canManage && <th className="p-3 text-right">Actions</th>}</tr></thead>
          <tbody>
            {loading ? <tr><td className="p-6 text-center text-slate-400" colSpan={6}>Loading…</td></tr>
              : rows.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={6}>No products yet.</td></tr>
              : rows.map((p, i) => (
                <tr key={p._id} className="border-b border-slate-50 dark:border-slate-700/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900/40 overflow-hidden shrink-0">{p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}</div>
                      <div><div className="font-semibold text-slate-800 dark:text-slate-100">{p.title}</div>{p.popular && <span className="text-[10px] font-bold text-[#FA5A24]">BESTSELLER</span>}</div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-slate-500">{p.category}</td>
                  <td className="p-3"><div className="font-bold text-slate-800 dark:text-slate-100">{inr(p.price)}</div>{p.oldPrice > p.price && <div className="text-xs text-slate-400 line-through">{inr(p.oldPrice)}</div>}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.rating}</td>
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

      {modal && <ProductModal product={modal} onClose={() => setModal(null)} onSaved={(t) => { setModal(null); flash(t); load(); }} />}
    </div>
  );
}
