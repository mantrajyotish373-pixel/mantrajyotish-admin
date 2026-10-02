import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi, inr, fmtDateTime, fmtSeconds } from '../config/adminApi';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm';
const input = 'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';

export default function PromoPayoutsPage() {
  const canManage = can('promopayouts.manage');
  const [tab, setTab] = useState('due');
  const [data, setData] = useState(null);
  const [rate, setRate] = useState('');
  const [history, setHistory] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [pay, setPay] = useState(null); // astrologer row being paid
  const [ref, setRef] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try { const r = await adminApi('/promo-payouts'); setData(r.data); setRate(String(r.data.ratePerMinute)); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
  }, []);
  const loadHistory = useCallback(async (page = 1) => {
    try { const r = await adminApi(`/promo-payouts/history?page=${page}&limit=20`); setHistory({ items: r.data, ...r.pagination }); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === 'history') loadHistory(1); }, [tab, loadHistory]);

  const saveRate = async () => {
    setBusy(true); setMsg(null);
    try { await adminApi('/promo-payouts/rate', { method: 'PUT', body: { ratePerMinute: Number(rate) } }); setMsg({ ok: true, text: 'Rate updated. Amounts below are recalculated.' }); await load(); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
    setBusy(false);
  };

  const confirmPay = async () => {
    setBusy(true); setMsg(null);
    try {
      await adminApi(`/promo-payouts/${pay.id}/pay`, { method: 'POST', body: { expectedSeconds: pay.pendingSeconds, reference: ref } });
      setMsg({ ok: true, text: `Marked ${inr(pay.amountDue)} as paid to ${pay.name}. Their free-session time is now 0.` });
      setPay(null); setRef(''); await load();
    } catch (e) { setMsg({ ok: false, text: e.message }); setPay(null); await load(); }
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Promo Payouts</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">When users spend bonus money, astrologers earn free-session time instead of rupees. Pay them here at your promo rate, then mark it paid to reset their time to 0. Astrologers only ever see the time, never the amount.</p>
      </div>

      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>{msg.text}</div>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${card} md:col-span-2 border-[#FA5A24]/40`}>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total to pay now</div>
            <div className="text-4xl font-extrabold text-[#FA5A24] mt-1" style={{ fontFamily: 'Outfit' }}>{inr(data.totals.amountDue)}</div>
            <div className="text-xs text-slate-500 mt-1">{fmtSeconds(data.totals.pendingSeconds)} of free-session time across {data.astrologers.length} astrologer{data.astrologers.length === 1 ? '' : 's'}</div>
          </div>
          <div className={card}>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Rate per minute</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-slate-500">₹</span>
              <input type="number" min={0} step="0.5" className={`${input} w-24`} value={rate} disabled={!canManage} onChange={(e) => setRate(e.target.value)} />
              {canManage && <button className={btn} disabled={busy || Number(rate) === data.ratePerMinute || rate === ''} onClick={saveRate}>Save</button>}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">One rate for everyone. Changing it updates all amounts.</p>
          </div>
          <div className={card}>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Already paid</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{inr(data.totals.paidAmount)}</div>
            <div className="text-xs text-slate-500 mt-1">{fmtSeconds(data.totals.paidSeconds)} in total</div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {[['due', 'To pay'], ['history', 'Payment history']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${tab === id ? 'bg-[#FA5A24] border-[#FA5A24] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{label}</button>
        ))}
      </div>

      {tab === 'due' && (
        <div className={`${card} p-0 overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Astrologer</th><th className="p-3">Free-session time</th><th className="p-3">Amount due</th><th className="p-3 text-right">Action</th></tr></thead>
            <tbody>
              {!data ? <tr><td className="p-4 text-slate-400" colSpan={4}>Loading…</td></tr> : data.astrologers.length === 0 ? (
                <tr><td className="p-6 text-center text-slate-400" colSpan={4}>Nothing to pay right now.</td></tr>
              ) : data.astrologers.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 dark:border-slate-700/40">
                  <td className="p-3"><div className="font-bold text-slate-800 dark:text-slate-100">{a.name}</div><div className="text-xs text-slate-400">{a.phone || a.email}</div></td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{fmtSeconds(a.pendingSeconds)}</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{inr(a.amountDue)}</td>
                  <td className="p-3 text-right">{canManage ? <button className={btn} onClick={() => { setPay(a); setRef(''); setMsg(null); }}>Mark paid</button> : <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-3">
          <div className={`${card} p-0 overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Paid on</th><th className="p-3">Astrologer</th><th className="p-3">Time</th><th className="p-3">Rate</th><th className="p-3">Amount</th><th className="p-3">Reference</th><th className="p-3">Paid by</th></tr></thead>
              <tbody>
                {history.items.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={7}>No payments yet.</td></tr> : history.items.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50 dark:border-slate-700/40">
                    <td className="p-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateTime(p.createdAt)}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{p.astrologer?.name || '—'}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{fmtSeconds(p.seconds)}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">₹{p.ratePerMinute}/min</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{inr(p.amount)}</td>
                    <td className="p-3 text-xs text-slate-500">{p.reference || '—'}</td>
                    <td className="p-3 text-xs text-slate-500">{p.paidByName || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Page {history.page} of {history.pages || 1} · {history.total || 0} payments</span>
            <div className="flex gap-2">
              <button disabled={history.page <= 1} onClick={() => loadHistory(history.page - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold disabled:opacity-40">Previous</button>
              <button disabled={history.page >= history.pages} onClick={() => loadHistory(history.page + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}

      {pay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[4px] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Mark as paid</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Confirm you have already sent <b className="text-slate-800 dark:text-slate-100">{inr(pay.amountDue)}</b> to <b className="text-slate-800 dark:text-slate-100">{pay.name}</b> for {fmtSeconds(pay.pendingSeconds)} at ₹{data.ratePerMinute}/min. Their free-session time will be reset to 0.</p>
            <input className={`${input} w-full mt-4`} placeholder="Payment reference / UTR (optional)" value={ref} onChange={(e) => setRef(e.target.value)} />
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setPay(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500">Cancel</button>
              <button onClick={confirmPay} disabled={busy} className={btn}>{busy ? 'Saving…' : 'Yes, I paid them'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
