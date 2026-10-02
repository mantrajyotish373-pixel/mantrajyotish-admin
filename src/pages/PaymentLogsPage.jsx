import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi, inr, fmtDateTime } from '../config/adminApi';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm';
const input = 'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-3 py-1.5 rounded-lg bg-[#FA5A24] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50';
const LEVEL = {
  info: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300',
  warn: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40',
  error: 'bg-red-50 text-red-600 dark:bg-red-950/40'
};

function Attention({ canManage, onChanged }) {
  const [rows, setRows] = useState([]); const [busy, setBusy] = useState(''); const [msg, setMsg] = useState(null);
  const load = useCallback(async () => {
    try { const r = await adminApi('/payments-attention'); setRows(r.data); } catch (e) { setMsg({ ok: false, text: e.message }); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const recheck = async (p) => {
    setBusy(p._id);
    try {
      const r = await adminApi(`/payments/${p._id}/recheck`, { method: 'POST' });
      setMsg({ ok: true, text: `${p.orderId}: ${r.data.status}${r.data.creditedAmount ? ` (₹${r.data.creditedAmount} credited)` : ''}` });
      await load(); onChanged && onChanged();
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    setBusy('');
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Payments that are held for review, paid but not yet in the wallet, or still pending after 10 minutes. “Re-check” asks Razorpay what really happened and fixes our record. The system also does this automatically every minute.</p>
      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-red-50 text-red-600 dark:bg-red-950/40'}`}>{msg.text}</div>}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">When</th><th className="p-3">User</th><th className="p-3">Order</th><th className="p-3">Amount</th><th className="p-3">Why it is here</th>{canManage && <th className="p-3 text-right">Action</th>}</tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={6}>Nothing needs attention. 🎉</td></tr> : rows.map((p) => (
              <tr key={p._id} className="border-b border-slate-50 dark:border-slate-700/40">
                <td className="p-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateTime(p.createdAt)}</td>
                <td className="p-3"><div className="font-semibold text-slate-800 dark:text-slate-100">{p.user?.name || '—'}</div><div className="text-xs text-slate-400">{p.user?.phone}</div></td>
                <td className="p-3 font-mono text-xs text-slate-500">{p.orderId}</td>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{inr(p.amount)}</td>
                <td className="p-3 text-xs text-amber-700 dark:text-amber-400">{p.attentionReason}</td>
                {canManage && <td className="p-3 text-right"><button className={btn} disabled={busy === p._id} onClick={() => recheck(p)}>{busy === p._id ? 'Checking…' : 'Re-check with Razorpay'}</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventLog() {
  const [rows, setRows] = useState([]); const [pg, setPg] = useState({ page: 1, pages: 1, total: 0 });
  const [level, setLevel] = useState(''); const [q, setQ] = useState(''); const [applied, setApplied] = useState(''); const [err, setErr] = useState('');
  const [open, setOpen] = useState(null);
  const load = useCallback(async (page = 1) => {
    try {
      const r = await adminApi(`/payment-events?page=${page}&limit=30${level ? `&level=${level}` : ''}${applied ? `&q=${encodeURIComponent(applied)}` : ''}`);
      setRows(r.data); setPg(r.pagination); setErr('');
    } catch (e) { setErr(e.message); }
  }, [level, applied]);
  useEffect(() => { load(1); }, [load]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select className={input} value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All levels</option><option value="error">Errors</option><option value="warn">Warnings</option><option value="info">Info</option>
        </select>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setApplied(q.trim()); }}>
          <input className={`${input} w-72`} placeholder="Order id (order_…), payment id (pay_…) or user id" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className={btn}>Search</button>
          {applied && <button type="button" className="text-xs font-bold text-slate-500" onClick={() => { setQ(''); setApplied(''); }}>Clear</button>}
        </form>
      </div>
      {err && <p className="text-sm text-red-500 font-semibold">{err}</p>}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">When</th><th className="p-3">Event</th><th className="p-3">User</th><th className="p-3">Order / payment</th><th className="p-3">Source</th><th className="p-3">Details</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={6}>No events.</td></tr> : rows.map((e) => (
              <React.Fragment key={e._id}>
                <tr className="border-b border-slate-50 dark:border-slate-700/40 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-900/20" onClick={() => setOpen(open === e._id ? null : e._id)}>
                  <td className="p-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateTime(e.createdAt)}</td>
                  <td className="p-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-full mr-2 ${LEVEL[e.level]}`}>{e.level}</span><span className="font-mono text-xs text-slate-700 dark:text-slate-200">{e.type}</span></td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300">{e.user?.name || e.user?.phone || '—'}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500"><div>{e.orderId}</div><div>{e.paymentId}</div></td>
                  <td className="p-3 text-xs text-slate-500">{e.source}</td>
                  <td className="p-3 text-xs text-slate-500 max-w-xs truncate">{e.message}</td>
                </tr>
                {open === e._id && (
                  <tr className="bg-slate-50 dark:bg-slate-900/40"><td colSpan={6} className="p-3"><pre className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{JSON.stringify({ message: e.message, details: e.details, ip: e.ip, paymentRecord: e.payment, webhookEventId: e.webhookEventId }, null, 2)}</pre></td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Page {pg.page} of {pg.pages || 1} · {pg.total || 0} events</span>
        <div className="flex gap-2">
          <button disabled={pg.page <= 1} onClick={() => load(pg.page - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold disabled:opacity-40">Previous</button>
          <button disabled={pg.page >= pg.pages} onClick={() => load(pg.page + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentLogsPage() {
  const canManage = can('payments.manage');
  const [tab, setTab] = useState('attention');
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Payment Logs</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">A permanent, tamper-proof trail of every payment step: order created, signature checks, webhooks from Razorpay, wallet credits and any mismatch.</p>
      </div>
      <div className="flex gap-2">
        {[['attention', 'Needs attention'], ['events', 'Event log']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${tab === id ? 'bg-[#FA5A24] border-[#FA5A24] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{label}</button>
        ))}
      </div>
      {tab === 'attention' ? <Attention canManage={canManage} onChanged={() => setKey((k) => k + 1)} /> : <EventLog key={key} />}
    </div>
  );
}
