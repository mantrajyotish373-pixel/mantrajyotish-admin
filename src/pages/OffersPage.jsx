import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi, inr, fmtDate, fmtDateTime } from '../config/adminApi';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm';
const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';
const Label = ({ children, hint }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{children}{hint && <span className="normal-case font-medium text-slate-400"> · {hint}</span>}</label>
);
const Badge = ({ ok, children }) => (
  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${ok ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/40'}`}>{children}</span>
);
const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const limitText = (n) => (n ? n.toLocaleString('en-IN') : 'Unlimited');

// ---------- create / edit modal (coupons and the signup bonus) ----------
function OfferModal({ promo, onClose, onSaved }) {
  const isNew = !promo._id;
  const isSignup = promo.kind === 'signup';
  const [f, setF] = useState({
    name: promo.name || '', code: promo.code || '', amount: promo.amount ?? '', status: promo.status || 'active',
    bonusValidityDays: promo.bonusValidityDays ?? '', maxRedemptions: promo.maxRedemptions ?? '', perUserLimit: promo.perUserLimit ?? 1,
    startsAt: toInput(promo.startsAt), endsAt: toInput(promo.endsAt), description: promo.description || '',
    allowedPhones: (promo.allowedUsers || []).map((u) => u.phone).join('\n')
  });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setBusy(true); setErr('');
    const body = { ...f, amount: Number(f.amount), perUserLimit: Number(f.perUserLimit), bonusValidityDays: f.bonusValidityDays === '' ? null : Number(f.bonusValidityDays), maxRedemptions: f.maxRedemptions === '' ? null : Number(f.maxRedemptions), startsAt: f.startsAt || null, endsAt: f.endsAt || null };
    if (isSignup) { delete body.code; delete body.perUserLimit; delete body.allowedPhones; }
    try {
      if (isNew) await adminApi('/promotions', { method: 'POST', body: { ...body, kind: 'coupon' } });
      else await adminApi(`/promotions/${promo._id}`, { method: 'PUT', body });
      onSaved();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{isNew ? 'New promo code' : isSignup ? 'Edit signup bonus' : `Edit coupon ${promo.code}`}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Name</Label><input className={input} value={f.name} onChange={set('name')} placeholder="e.g. Diwali Offer" /></div>
          {!isSignup && <div><Label hint="users type this">Coupon code</Label><input className={`${input} uppercase`} value={f.code} onChange={set('code')} placeholder="DIWALI100" /></div>}
          <div><Label hint="₹ added as bonus">Bonus amount</Label><input type="number" min={1} className={input} value={f.amount} onChange={set('amount')} /></div>
          <div><Label>Status</Label>
            <select className={input} value={f.status} onChange={set('status')}><option value="active">Active</option><option value="paused">Paused (not given)</option></select>
          </div>
          <div><Label hint="empty = never expires">Bonus stays usable for (days)</Label><input type="number" min={1} className={input} value={f.bonusValidityDays} onChange={set('bonusValidityDays')} placeholder="Unlimited" /></div>
          <div><Label hint="empty = unlimited">Total uses allowed</Label><input type="number" min={1} className={input} value={f.maxRedemptions} onChange={set('maxRedemptions')} placeholder="Unlimited" /></div>
          {!isSignup && <div><Label>Uses per user</Label><input type="number" min={1} className={input} value={f.perUserLimit} onChange={set('perUserLimit')} /></div>}
          <div><Label hint="optional">Offer starts</Label><input type="date" className={input} value={f.startsAt} onChange={set('startsAt')} /></div>
          <div><Label hint="optional">Offer ends</Label><input type="date" className={input} value={f.endsAt} onChange={set('endsAt')} /></div>
          {!isSignup && (
            <div className="md:col-span-2">
              <Label hint="empty = anyone can use this code">Only for these users (private code)</Label>
              <textarea rows={3} className={input} value={f.allowedPhones} onChange={set('allowedPhones')} placeholder={'One phone number per line, exactly as registered\n+919876543210'} />
              <p className="text-[11px] text-slate-400 mt-1">Only these users can redeem the code; everyone else sees “not valid”. To let the same user redeem it more than once, raise “Uses per user”.</p>
            </div>
          )}
          <div className="md:col-span-2"><Label hint="optional, for your team">Notes</Label><input className={input} value={f.description} onChange={set('description')} /></div>
        </div>
        {isSignup && <p className="text-xs text-slate-400 mt-3">The signup bonus is given automatically to every new user while this is Active. Changes apply to new signups only.</p>}
        {err && <p className="mt-3 text-sm text-red-500 font-semibold">{err}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
          <button onClick={save} disabled={busy || !f.name.trim() || f.amount === ''} className={btn}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- payment-page coupon (discount on a wallet top-up) ----------
const METHOD_OPTIONS = [['upi', 'UPI'], ['card', 'Card'], ['netbanking', 'Net Banking'], ['wallet', 'Wallet']];

function DiscountCouponModal({ coupon, onClose, onSaved }) {
  const isNew = !coupon._id;
  const [f, setF] = useState({
    code: coupon.code || '', name: coupon.name || '', description: coupon.description || '',
    discountType: coupon.discountType || 'percent', discountValue: coupon.discountValue ?? '', maxDiscount: coupon.maxDiscount ?? '',
    minAmount: coupon.minAmount || '', allowedMethods: coupon.allowedMethods || [], firstPaymentOnly: !!coupon.firstPaymentOnly,
    maxRedemptions: coupon.maxRedemptions ?? '', perUserLimit: coupon.perUserLimit ?? 1,
    startsAt: toInput(coupon.startsAt), endsAt: toInput(coupon.endsAt), status: coupon.status || 'active'
  });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggleMethod = (m) => setF({ ...f, allowedMethods: f.allowedMethods.includes(m) ? f.allowedMethods.filter((x) => x !== m) : [...f.allowedMethods, m] });
  const used = !isNew && coupon.redemptionCount > 0;

  const save = async () => {
    setBusy(true); setErr('');
    const body = {
      ...f, discountValue: Number(f.discountValue), perUserLimit: Number(f.perUserLimit),
      maxDiscount: f.discountType === 'percent' && f.maxDiscount !== '' ? Number(f.maxDiscount) : null,
      minAmount: f.minAmount === '' ? 0 : Number(f.minAmount),
      maxRedemptions: f.maxRedemptions === '' ? null : Number(f.maxRedemptions), startsAt: f.startsAt || null, endsAt: f.endsAt || null
    };
    if (used) delete body.code;
    try {
      if (isNew) await adminApi('/coupons', { method: 'POST', body });
      else await adminApi(`/coupons/${coupon._id}`, { method: 'PUT', body });
      onSaved();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{isNew ? 'New coupon' : `Edit coupon ${coupon.code}`}</h2>
        <p className="text-xs text-slate-400 mb-4">A coupon gives a <b>discount</b> on the payment page. The user pays less and the wallet is still credited with the full amount. It does not add bonus money (use a Promo Code for that).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Coupon code</Label><input className={`${input} uppercase`} disabled={used} value={f.code} onChange={set('code')} placeholder="UPI10" /></div>
          <div><Label>Name</Label><input className={input} value={f.name} onChange={set('name')} placeholder="e.g. UPI festive discount" /></div>
          <div className="md:col-span-2"><Label hint="shown to users, e.g. “Get 10% off on UPI”">Offer text</Label><input className={input} value={f.description} onChange={set('description')} /></div>
          <div><Label>Discount type</Label>
            <select className={input} value={f.discountType} onChange={set('discountType')}><option value="percent">Percent (%) off</option><option value="flat">Flat ₹ off</option></select>
          </div>
          <div><Label hint={f.discountType === 'percent' ? '% off' : '₹ off'}>Discount value</Label><input type="number" min={1} className={input} value={f.discountValue} onChange={set('discountValue')} /></div>
          {f.discountType === 'percent' && <div><Label hint="₹, empty = no cap">Maximum discount</Label><input type="number" min={1} className={input} value={f.maxDiscount} onChange={set('maxDiscount')} placeholder="No cap" /></div>}
          <div><Label hint="₹, empty = any amount">Minimum recharge</Label><input type="number" min={0} className={input} value={f.minAmount} onChange={set('minAmount')} placeholder="No minimum" /></div>
          <div className="md:col-span-2">
            <Label hint="none selected = all payment methods">Works only with</Label>
            <div className="flex gap-2 flex-wrap">
              {METHOD_OPTIONS.map(([m, l]) => (
                <button type="button" key={m} onClick={() => toggleMethod(m)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${f.allowedMethods.includes(m) ? 'bg-[#FA5A24] border-[#FA5A24] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{l}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 md:col-span-2"><input type="checkbox" checked={f.firstPaymentOnly} onChange={(e) => setF({ ...f, firstPaymentOnly: e.target.checked })} /> First payment only (users who have never added money)</label>
          <div><Label hint="empty = unlimited">Total uses allowed</Label><input type="number" min={1} className={input} value={f.maxRedemptions} onChange={set('maxRedemptions')} placeholder="Unlimited" /></div>
          <div><Label>Uses per user</Label><input type="number" min={1} className={input} value={f.perUserLimit} onChange={set('perUserLimit')} /></div>
          <div><Label hint="optional">Starts</Label><input type="date" className={input} value={f.startsAt} onChange={set('startsAt')} /></div>
          <div><Label hint="optional">Ends</Label><input type="date" className={input} value={f.endsAt} onChange={set('endsAt')} /></div>
          <div><Label>Status</Label>
            <select className={input} value={f.status} onChange={set('status')}><option value="active">Active</option><option value="paused">Paused</option></select>
          </div>
        </div>
        {err && <p className="mt-3 text-sm text-red-500 font-semibold">{err}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
          <button onClick={save} disabled={busy || !f.code.trim() || !f.name.trim() || f.discountValue === ''} className={btn}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- give bonus to one user ----------
function GiveBonusModal({ onClose, onSaved }) {
  const [f, setF] = useState({ phone: '', amount: '', reason: '', validityDays: '' });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => {
    setBusy(true); setErr('');
    try { await adminApi('/bonus-grants', { method: 'POST', body: { phone: f.phone.trim(), amount: Number(f.amount), reason: f.reason, validityDays: f.validityDays === '' ? null : Number(f.validityDays) } }); onSaved(); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Give bonus to a user</h2>
        <div className="space-y-3">
          <div><Label hint="exactly as registered, e.g. +91…">User phone</Label><input className={input} value={f.phone} onChange={set('phone')} /></div>
          <div><Label>Bonus amount (₹)</Label><input type="number" min={1} className={input} value={f.amount} onChange={set('amount')} /></div>
          <div><Label>Reason</Label><input className={input} value={f.reason} onChange={set('reason')} placeholder="e.g. Compensation for a failed call" /></div>
          <div><Label hint="empty = never expires">Valid for (days)</Label><input type="number" min={1} className={input} value={f.validityDays} onChange={set('validityDays')} placeholder="Unlimited" /></div>
        </div>
        {err && <p className="mt-3 text-sm text-red-500 font-semibold">{err}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
          <button onClick={save} disabled={busy || !f.phone.trim() || !f.amount} className={btn}>{busy ? 'Giving…' : 'Give bonus'}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- bonus history (all, or one offer) ----------
function GrantsTable({ promotionId = 'all', title }) {
  const [rows, setRows] = useState([]); const [pg, setPg] = useState({ page: 1, pages: 1, total: 0 }); const [source, setSource] = useState(''); const [err, setErr] = useState('');
  const load = useCallback(async (page = 1) => {
    try {
      const r = await adminApi(`/promotions/${promotionId}/grants?page=${page}&limit=20${source ? `&source=${source}` : ''}`);
      setRows(r.data); setPg(r.pagination); setErr('');
    } catch (e) { setErr(e.message); }
  }, [promotionId, source]);
  useEffect(() => { load(1); }, [load]);
  const srcLabel = { signup: 'Signup bonus', coupon: 'Coupon', admin: 'Given by admin', migration: 'Converted balance' };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        {title && <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>}
        {promotionId === 'all' && (
          <select className={`${input} w-52`} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All sources</option><option value="signup">Signup bonus</option><option value="coupon">Coupons</option><option value="admin">Given by admin</option><option value="migration">Converted balance</option>
          </select>
        )}
      </div>
      {err && <p className="text-sm text-red-500 font-semibold">{err}</p>}
      <div className={`${card} p-0 overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">When</th><th className="p-3">User</th><th className="p-3">Offer</th><th className="p-3">Given</th><th className="p-3">Unspent</th><th className="p-3">Status</th><th className="p-3">Expires</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={7}>Nothing here yet.</td></tr> : rows.map((g) => (
              <tr key={g._id} className="border-b border-slate-50 dark:border-slate-700/40">
                <td className="p-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateTime(g.createdAt)}</td>
                <td className="p-3"><div className="font-semibold text-slate-800 dark:text-slate-100">{g.user?.name || '—'}</div><div className="text-xs text-slate-400">{g.user?.phone}</div></td>
                <td className="p-3 text-xs text-slate-600 dark:text-slate-300">{g.promotion?.code || g.promotion?.name || srcLabel[g.source] || g.source}{g.reason && g.source === 'admin' ? <div className="text-slate-400">{g.reason}</div> : null}</td>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{inr(g.amount)}</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">{inr(g.remaining)}</td>
                <td className="p-3"><Badge ok={g.status === 'active'}>{g.status}</Badge></td>
                <td className="p-3 text-xs text-slate-500">{g.expiresAt ? fmtDate(g.expiresAt) : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Page {pg.page} of {pg.pages || 1} · {pg.total || 0} entries</span>
        <div className="flex gap-2">
          <button disabled={pg.page <= 1} onClick={() => load(pg.page - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold disabled:opacity-40">Previous</button>
          <button disabled={pg.page >= pg.pages} onClick={() => load(pg.page + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const canManage = can('promotions.manage');
  const [tab, setTab] = useState('signup');
  const [discounts, setDiscounts] = useState([]);
  const [promos, setPromos] = useState([]); const [totals, setTotals] = useState({ totalGranted: 0, totalUnspent: 0 });
  const [modal, setModal] = useState(null); // { promo } | 'give'
  const [viewUsers, setViewUsers] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try {
      const [r, d] = await Promise.all([adminApi('/promotions'), adminApi('/coupons')]);
      setPromos(r.data); setTotals(r.totals); setDiscounts(d.data);
    }
    catch (e) { setMsg({ ok: false, text: e.message }); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const signup = promos.find((p) => p.kind === 'signup');
  const coupons = promos.filter((p) => p.kind === 'coupon');
  const flash = (text, ok = true) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 4000); };
  const toggle = async (p) => {
    try { await adminApi(`/promotions/${p._id}`, { method: 'PUT', body: { status: p.status === 'active' ? 'paused' : 'active' } }); await load(); }
    catch (e) { flash(e.message, false); }
  };
  const remove = async (p) => {
    if (!window.confirm(`Delete coupon ${p.code}?`)) return;
    try { await adminApi(`/promotions/${p._id}`, { method: 'DELETE' }); flash('Coupon deleted'); await load(); } catch (e) { flash(e.message, false); }
  };
  const toggleDiscount = async (c) => {
    try { await adminApi(`/coupons/${c._id}`, { method: 'PUT', body: { status: c.status === 'active' ? 'paused' : 'active' } }); await load(); }
    catch (e) { flash(e.message, false); }
  };
  const removeDiscount = async (c) => {
    if (!window.confirm(`Delete coupon ${c.code}?`)) return;
    try { await adminApi(`/coupons/${c._id}`, { method: 'DELETE' }); flash('Coupon deleted'); await load(); } catch (e) { flash(e.message, false); }
  };
  const saved = async (text) => { setModal(null); flash(text); await load(); };

  const window_ = (p) => (p.startsAt || p.endsAt ? `${p.startsAt ? fmtDate(p.startsAt) : 'Now'} → ${p.endsAt ? fmtDate(p.endsAt) : 'No end'}` : 'Always');
  const tabs = [['signup', 'Signup Bonus'], ['coupons', `Promo Codes (${coupons.length})`], ['discounts', `Coupons (${discounts.length})`], ['history', 'Bonus History']];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Offers & Bonus</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Promo Codes add bonus money to a wallet (for one or many users). Coupons give a discount on the payment page. Bonus money shows in the user's wallet like normal money, is spent first, and never earns the astrologer rupees (they get free-session time, paid from Promo Payouts).</p>
        </div>
        {canManage && <button className={`${btn} whitespace-nowrap`} onClick={() => setModal('give')}>Give bonus to a user</button>}
      </div>

      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>{msg.text}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={card}><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total bonus given</div><div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{inr(totals.totalGranted)}</div></div>
        <div className={card}><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Unspent bonus in wallets</div><div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{inr(totals.totalUnspent)}</div></div>
        <div className={card}><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Active offers</div><div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{promos.filter((p) => p.status === 'active').length}</div></div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border ${tab === id ? 'bg-[#FA5A24] border-[#FA5A24] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{label}</button>
        ))}
      </div>

      {tab === 'signup' && signup && (
        <div className={card}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2"><h3 className="font-bold text-slate-800 dark:text-slate-100">{signup.name}</h3><Badge ok={signup.status === 'active'}>{signup.status === 'active' ? 'Active' : 'Paused'}</Badge></div>
              <p className="text-xs text-slate-400 mt-1">Given automatically to every new user when they sign up.</p>
            </div>
            {canManage && (
              <div className="flex gap-3 text-xs font-bold">
                <button onClick={() => toggle(signup)} className="text-amber-600 hover:underline">{signup.status === 'active' ? 'Pause' : 'Resume'}</button>
                <button onClick={() => setModal({ promo: signup })} className="text-[#FA5A24] hover:underline">Edit</button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
            {[['Bonus per signup', inr(signup.amount)], ['Bonus stays usable', signup.bonusValidityDays ? `${signup.bonusValidityDays} days` : 'Unlimited'], ['Total signups allowed', limitText(signup.maxRedemptions)], ['Given so far', `${signup.redemptionCount.toLocaleString('en-IN')} users`], ['Total given', inr(signup.totalGranted)]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3"><div className="text-[11px] text-slate-400">{k}</div><div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{v}</div></div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">Offer window: {window_(signup)}</p>
        </div>
      )}

      {tab === 'coupons' && (
        <div className="space-y-3">
          {canManage && <div className="flex justify-end"><button className={btn} onClick={() => setModal({ promo: { kind: 'coupon' } })}>+ New Promo Code</button></div>}
          <div className={`${card} p-0 overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Coupon</th><th className="p-3">Bonus</th><th className="p-3">Used</th><th className="p-3">Per user</th><th className="p-3">Offer window</th><th className="p-3">Bonus lasts</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
              <tbody>
                {coupons.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={8}>No coupons yet. Create one to give users bonus money with a code.</td></tr> : coupons.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50 dark:border-slate-700/40">
                    <td className="p-3"><div className="font-mono font-bold text-[#FA5A24]">{p.code}</div><div className="text-xs text-slate-400">{p.name}</div>{p.allowedUsers?.length > 0 && <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950/40" title={p.allowedUsers.map((u) => u.name || u.phone).join(', ')}>Private · {p.allowedUsers.length} user{p.allowedUsers.length > 1 ? 's' : ''}</span>}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{inr(p.amount)}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{p.redemptionCount.toLocaleString('en-IN')} / {limitText(p.maxRedemptions)}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{p.perUserLimit}</td>
                    <td className="p-3 text-xs text-slate-500">{window_(p)}</td>
                    <td className="p-3 text-xs text-slate-500">{p.bonusValidityDays ? `${p.bonusValidityDays} days` : 'Unlimited'}</td>
                    <td className="p-3"><Badge ok={p.status === 'active'}>{p.status === 'active' ? 'Active' : 'Paused'}</Badge></td>
                    <td className="p-3 text-right whitespace-nowrap text-xs font-bold">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setViewUsers(p)} className="text-slate-500 hover:underline">Users</button>
                        {canManage && <button onClick={() => setModal({ promo: p })} className="text-[#FA5A24] hover:underline">Edit</button>}
                        {canManage && <button onClick={() => toggle(p)} className="text-amber-600 hover:underline">{p.status === 'active' ? 'Pause' : 'Resume'}</button>}
                        {canManage && p.redemptionCount === 0 && <button onClick={() => remove(p)} className="text-red-500 hover:underline">Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'discounts' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Coupons are shown to users on the payment page and give a <b>discount</b> on a wallet top-up. The user pays less; the wallet still gets the full amount. They never add bonus money.</p>
          {canManage && <div className="flex justify-end"><button className={btn} onClick={() => setModal({ discount: {} })}>+ New Coupon</button></div>}
          <div className={`${card} p-0 overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Coupon</th><th className="p-3">Discount</th><th className="p-3">Rules</th><th className="p-3">Used</th><th className="p-3">Discount given</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
              <tbody>
                {discounts.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={7}>No coupons yet. Create one to offer discounts on the payment page.</td></tr> : discounts.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 dark:border-slate-700/40">
                    <td className="p-3"><div className="font-mono font-bold text-[#FA5A24]">{c.code}</div><div className="text-xs text-slate-400">{c.name}</div></td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{c.discountType === 'percent' ? `${c.discountValue}% off` : `${inr(c.discountValue)} off`}{c.discountType === 'percent' && c.maxDiscount ? <div className="text-xs font-medium text-slate-400">up to {inr(c.maxDiscount)}</div> : null}</td>
                    <td className="p-3 text-xs text-slate-500 space-y-0.5">
                      <div>{c.minAmount ? `Min ${inr(c.minAmount)}` : 'Any amount'}</div>
                      <div>{c.allowedMethods?.length ? c.allowedMethods.map((m) => m.toUpperCase()).join(' / ') + ' only' : 'All payment methods'}</div>
                      {c.firstPaymentOnly && <div className="font-semibold text-violet-600">First payment only</div>}
                      <div>{window_(c)} · {c.perUserLimit}× per user</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{c.redemptionCount.toLocaleString('en-IN')} / {limitText(c.maxRedemptions)}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{inr(c.totalDiscount)}</td>
                    <td className="p-3"><Badge ok={c.status === 'active'}>{c.status === 'active' ? 'Active' : 'Paused'}</Badge></td>
                    <td className="p-3 text-right whitespace-nowrap text-xs font-bold">
                      {canManage && (
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setModal({ discount: c })} className="text-[#FA5A24] hover:underline">Edit</button>
                          <button onClick={() => toggleDiscount(c)} className="text-amber-600 hover:underline">{c.status === 'active' ? 'Pause' : 'Resume'}</button>
                          {c.redemptionCount === 0 && <button onClick={() => removeDiscount(c)} className="text-red-500 hover:underline">Delete</button>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'history' && <GrantsTable />}

      {modal && modal.discount && <DiscountCouponModal coupon={modal.discount} onClose={() => setModal(null)} onSaved={() => saved('Saved')} />}
      {modal === 'give' && <GiveBonusModal onClose={() => setModal(null)} onSaved={() => saved('Bonus given')} />}
      {modal && modal !== 'give' && modal.promo && <OfferModal promo={modal.promo} onClose={() => setModal(null)} onSaved={() => saved('Saved')} />}
      {viewUsers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
            <GrantsTable promotionId={viewUsers._id} title={`Users who used ${viewUsers.code}`} />
            <div className="flex justify-end mt-4"><button onClick={() => setViewUsers(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
