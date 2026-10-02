import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi, inr } from '../config/adminApi';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm';
const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';
const Label = ({ children, hint }) => (
  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{children}{hint && <span className="normal-case font-medium"> · {hint}</span>}</label>
);

export default function AddMoneySettingsPage() {
  const canManage = can('addmoney.manage');
  const [cfg, setCfg] = useState(null);
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const flash = (text, ok = true) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 4000); };
  const load = useCallback(async () => {
    try {
      const r = await adminApi('/add-money-settings');
      const d = { ...r.data, extraValidityDays: r.data.extraValidityDays ?? '' };
      setCfg(d); setSaved(JSON.stringify(d));
    } catch (e) { flash(e.message, false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!cfg) return <div className="text-sm text-slate-400">{msg ? msg.text : 'Loading…'}</div>;

  const dirty = JSON.stringify(cfg) !== saved;
  const setField = (k) => (e) => setCfg({ ...cfg, [k]: e.target.value });
  const setPreset = (i, k, v) => setCfg({ ...cfg, presets: cfg.presets.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)) });
  const addPreset = () => setCfg({ ...cfg, presets: [...cfg.presets, { amount: '', extraAmount: 0, label: '' }] });
  const removePreset = (i) => setCfg({ ...cfg, presets: cfg.presets.filter((_, idx) => idx !== i) });
  const move = (i, dir) => {
    const list = [...cfg.presets];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setCfg({ ...cfg, presets: list });
  };

  const save = async () => {
    setBusy(true);
    try {
      const body = {
        minAmount: Number(cfg.minAmount), maxAmount: Number(cfg.maxAmount),
        extraValidityDays: cfg.extraValidityDays === '' ? null : Number(cfg.extraValidityDays),
        gstPercent: cfg.gstPercent === '' ? 0 : Number(cfg.gstPercent),
        presets: cfg.presets.map((p) => ({ amount: Number(p.amount), extraAmount: Number(p.extraAmount) || 0, label: p.label }))
      };
      const r = await adminApi('/add-money-settings', { method: 'PUT', body });
      const d = { ...r.data, extraValidityDays: r.data.extraValidityDays ?? '' };
      setCfg(d); setSaved(JSON.stringify(d));
      flash('Add Money settings saved. The app shows them on its next open.');
    } catch (e) { flash(e.message, false); }
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Add Money Settings</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Control the quick-select amounts on the app's Add Money page and the extra bonus users get on them.</p>
        </div>
        {canManage && <button className={`${btn} whitespace-nowrap`} onClick={save} disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save changes'}</button>}
      </div>

      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>{msg.text}</div>}

      <div className={card}>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Limits & tax</h3>
        <p className="text-xs text-slate-400 mb-3">GST is added on top of the amount the user adds (after any coupon discount). The wallet still receives the full amount; the user pays amount + GST.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><Label hint="₹">Minimum amount</Label><input type="number" min={1} className={input} disabled={!canManage} value={cfg.minAmount} onChange={setField('minAmount')} /></div>
          <div><Label hint="₹">Maximum amount</Label><input type="number" min={1} className={input} disabled={!canManage} value={cfg.maxAmount} onChange={setField('maxAmount')} /></div>
          <div><Label hint="added on top; 0 = none">GST (%)</Label><input type="number" min={0} max={100} step={0.5} className={input} disabled={!canManage} value={cfg.gstPercent} onChange={setField('gstPercent')} /></div>
          <div><Label hint="empty = never expires">Extra bonus stays usable (days)</Label><input type="number" min={1} className={input} disabled={!canManage} value={cfg.extraValidityDays} onChange={setField('extraValidityDays')} placeholder="Never expires" /></div>
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Quick-select amounts</h3>
          {canManage && cfg.presets.length < 20 && <button onClick={addPreset} className="text-xs font-bold text-[#FA5A24] hover:underline">+ Add amount</button>}
        </div>
        <p className="text-xs text-slate-400 mb-4">Users see these in this order. The <b>extra</b> is bonus money added on top when the user adds exactly that amount. It is promotional balance, not cash. Leave it 0 for no extra.</p>

        <div className="space-y-3">
          {cfg.presets.map((p, i) => {
            const amt = Number(p.amount) || 0; const extra = Number(p.extraAmount) || 0;
            return (
              <div key={i} className="grid grid-cols-12 gap-3 items-end rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3">
                <div className="col-span-6 md:col-span-3"><Label hint="₹ user pays">Amount</Label><input type="number" min={1} className={input} disabled={!canManage} value={p.amount} onChange={(e) => setPreset(i, 'amount', e.target.value)} /></div>
                <div className="col-span-6 md:col-span-3"><Label hint="₹ bonus">Extra</Label><input type="number" min={0} className={input} disabled={!canManage} value={p.extraAmount} onChange={(e) => setPreset(i, 'extraAmount', e.target.value)} /></div>
                <div className="col-span-6 md:col-span-2"><Label hint="optional">Tag</Label><input className={input} disabled={!canManage} maxLength={20} value={p.label} onChange={(e) => setPreset(i, 'label', e.target.value)} placeholder="Popular" /></div>
                <div className="col-span-6 md:col-span-3 text-xs text-slate-500 pb-2">
                  {amt > 0 ? <>User pays <b>{inr(amt)}</b>{extra > 0 ? <> and gets <b className="text-emerald-600">{inr(amt + extra)}</b> <span className="text-slate-400">({inr(extra)} bonus)</span></> : ' and gets the same amount'}</> : '—'}
                </div>
                {canManage && (
                  <div className="col-span-12 md:col-span-1 flex md:flex-col gap-2 justify-end text-xs font-bold pb-1">
                    <button disabled={i === 0} onClick={() => move(i, -1)} className="text-slate-500 disabled:opacity-30">↑</button>
                    <button disabled={i === cfg.presets.length - 1} onClick={() => move(i, 1)} className="text-slate-500 disabled:opacity-30">↓</button>
                    <button onClick={() => removePreset(i)} className="text-red-500">✕</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
