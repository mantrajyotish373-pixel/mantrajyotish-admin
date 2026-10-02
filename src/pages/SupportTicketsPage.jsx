import React, { useCallback, useEffect, useState } from 'react';
import { can } from '../config/authSession';
import { adminApi, inr, fmtDateTime } from '../config/adminApi';
import { subscribeSupport } from '../config/realtime';

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm';
const input = 'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm';
const btn = 'px-3 py-1.5 rounded-lg bg-[#FA5A24] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50';
const ghost = 'px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 disabled:opacity-50';

const STATUS = {
  open: ['Open', 'bg-red-50 text-red-600 dark:bg-red-950/40'],
  in_progress: ['In progress', 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'],
  resolved: ['Resolved', 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'],
  rejected: ['Rejected', 'bg-slate-100 text-slate-500 dark:bg-slate-700/40']
};
const CATEGORY = {
  money_deducted_not_added: 'Money deducted, not added',
  payment_failed: 'Payment failed / stuck',
  wrong_amount: 'Wrong amount',
  session_billing: 'Chat / call billing',
  bonus_missing: 'Bonus missing',
  refund_request: 'Refund request',
  other: 'Other'
};
// Older records may hold Razorpay's raw JSON error; show it as a short readable line
const readable = (raw) => {
  const t = String(raw || '').trim();
  if (!t.startsWith('{')) return t;
  try {
    const e = (JSON.parse(t) || {}).error || {};
    const d = String(e.description || '').trim();
    if (d && d.toLowerCase() !== 'undefined' && d.toLowerCase() !== 'null') return d;
    const why = String(e.reason || e.code || '').replace(/_/g, ' ').toLowerCase();
    const step = String(e.step || '').replace(/_/g, ' ').toLowerCase();
    return `Payment failed${step ? ` at ${step}` : ''}${why ? ` (${why})` : ''}`;
  } catch { return 'Payment failed'; }
};
const Pill = ({ s }) => <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${STATUS[s]?.[1]}`}>{STATUS[s]?.[0] || s}</span>;

function Detail({ id, canManage, canRecheck, onClose, onChanged, refreshKey }) {
  const [t, setT] = useState(null); const [err, setErr] = useState(''); const [msg, setMsg] = useState(null);
  const [text, setText] = useState(''); const [internal, setInternal] = useState(false);
  const [agents, setAgents] = useState([]); const [busy, setBusy] = useState(false);
  const [closing, setClosing] = useState(null); const [note, setNote] = useState('');

  const load = useCallback(async () => {
    try { const r = await adminApi(`/support-tickets/${id}`); setT(r.data); setErr(''); } catch (e) { setErr(e.message); }
  }, [id]);
  useEffect(() => { load(); }, [load, refreshKey]);
  useEffect(() => { adminApi('/support-agents').then((r) => setAgents(r.data)).catch(() => {}); }, []);

  const act = async (fn, ok) => {
    setBusy(true); setMsg(null);
    try { await fn(); if (ok) setMsg({ ok: true, text: ok }); await load(); onChanged(); } catch (e) { setMsg({ ok: false, text: e.message }); }
    setBusy(false);
  };
  const send = () => act(async () => {
    await adminApi(`/support-tickets/${id}/reply`, { method: 'POST', body: { text, internal } });
    setText(''); setInternal(false);
  });
  const update = (body, ok) => act(() => adminApi(`/support-tickets/${id}`, { method: 'PUT', body }), ok);
  const closeIt = () => act(async () => {
    await adminApi(`/support-tickets/${id}`, { method: 'PUT', body: { status: closing, resolution: note } });
    setClosing(null); setNote('');
  }, 'Saved. The customer can see your note.');
  const recheck = () => act(async () => {
    const r = await adminApi(`/payments/${t.payment._id}/recheck`, { method: 'POST' });
    setMsg({ ok: true, text: `Razorpay says: ${r.data.status}${r.data.creditedAmount ? ` (₹${r.data.creditedAmount} credited)` : ''}` });
  });

  const closed = t && (t.status === 'resolved' || t.status === 'rejected');
  const p = t?.payment;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/40 backdrop-blur-[2px]" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 overflow-y-auto overflow-x-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {!t ? <div className="p-8 text-sm text-slate-400">{err || 'Loading…'}</div> : (
          <div className="p-6 space-y-5 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">{t.number}</h2>
                  <Pill s={t.status} />
                  {t.priority === 'high' && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-600 text-white">HIGH</span>}
                </div>
                <p className="text-xs text-slate-400 mt-1">{CATEGORY[t.category]} · raised {fmtDateTime(t.createdAt)}</p>
              </div>
              <button onClick={onClose} className="text-slate-400 text-xl leading-none">✕</button>
            </div>

            {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.ok ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-red-50 text-red-600 dark:bg-red-950/40'}`}>{msg.text}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`${card} p-4`}>
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Customer</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{t.user?.name || '—'}</div>
                <div className="text-xs text-slate-500">{t.user?.phone}</div>
                {t.user?.walletBalance != null && <div className="text-xs text-slate-400 mt-1">Wallet now: {inr(t.user.walletBalance)}</div>}
              </div>
              <div className={`${card} p-4`}>
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Transaction</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{t.ref.title}</div>
                <div className="text-xs text-slate-500">{inr(t.ref.amount)} · {t.ref.status} · {t.ref.date ? fmtDateTime(t.ref.date) : ''}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 break-all">{t.ref.transactionId}</div>
              </div>
            </div>

            {p && (
              <div className={`${card} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Payment record</div>
                  {canRecheck && p.paymentGateway === 'Razorpay' && <button className={ghost} disabled={busy} onClick={recheck}>Re-check with Razorpay</button>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div><div className="text-slate-400">Status</div><div className="font-bold text-slate-800 dark:text-slate-100">{p.paymentStatus}{p.needsReview ? ' (review)' : ''}</div></div>
                  <div><div className="text-slate-400">Charged</div><div className="font-bold text-slate-800 dark:text-slate-100">{inr(p.amount)}</div></div>
                  <div><div className="text-slate-400">Wallet credit</div><div className="font-bold text-slate-800 dark:text-slate-100">{inr(p.walletCredit ?? p.amount)}</div></div>
                  <div><div className="text-slate-400">GST / discount</div><div className="font-bold text-slate-800 dark:text-slate-100">{inr(p.gstAmount || 0)} / {inr(p.discountAmount || 0)}</div></div>
                </div>
                {p.failureReason && <div className="text-xs text-red-500 mt-2 break-words">Failure: {readable(p.failureReason)}</div>}
                {p.reviewReason && <div className="text-xs text-amber-600 mt-1 break-words">Review: {p.reviewReason}</div>}
                {p.creditPending && <div className="text-xs text-amber-600 mt-1">Paid but wallet credit not finished yet.</div>}
                {t.events?.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-xs font-bold text-slate-500 cursor-pointer">Payment trail ({t.events.length} steps)</summary>
                    <ul className="mt-2 space-y-1">
                      {t.events.map((e) => (
                        <li key={e._id} className="text-[11px] text-slate-500 flex gap-2"><span className="text-slate-400 whitespace-nowrap">{fmtDateTime(e.createdAt)}</span><span className={`font-mono ${e.level === 'error' ? 'text-red-500' : e.level === 'warn' ? 'text-amber-600' : ''}`}>{e.type}</span><span className="truncate">{e.message}</span></li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}

            {canManage && (
              <div className="flex flex-wrap items-center gap-2">
                <select className={input} value={t.assignedTo?._id || ''} disabled={busy} onChange={(e) => update({ assignedTo: e.target.value || null }, 'Assignment updated')}>
                  <option value="">Unassigned</option>
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {!closed && t.status === 'open' && <button className={ghost} disabled={busy} onClick={() => update({ status: 'in_progress' }, 'Marked in progress')}>Start working</button>}
                {!closed && <button className={btn} onClick={() => setClosing('resolved')}>Resolve…</button>}
                {!closed && <button className={ghost} onClick={() => setClosing('rejected')}>Reject…</button>}
                {closed && <button className={ghost} disabled={busy} onClick={() => update({ status: 'in_progress' }, 'Reopened')}>Reopen</button>}
              </div>
            )}

            {closing && (
              <div className={`${card} p-4 space-y-2`}>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{closing === 'resolved' ? 'Resolve this complaint' : 'Reject this complaint'}</div>
                <p className="text-xs text-slate-400">The customer will see this note, so explain in plain words.</p>
                <textarea rows={3} className={`${input} w-full`} placeholder={closing === 'resolved' ? 'e.g. We checked with Razorpay: the amount was added to your wallet.' : 'e.g. This payment was not completed, so no money was deducted.'} value={note} onChange={(e) => setNote(e.target.value)} />
                {note.trim().length < 5 && <p className="text-[11px] text-amber-600">Write at least 5 characters so the customer knows what happened.</p>}
                <div className="flex gap-2 justify-end">
                  <button className={ghost} onClick={() => { setClosing(null); setNote(''); }}>Cancel</button>
                  <button className={btn} disabled={busy || note.trim().length < 5} onClick={closeIt}>{closing === 'resolved' ? 'Mark resolved' : 'Reject'}</button>
                </div>
              </div>
            )}

            {t.resolution && closed && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-slate-700 dark:text-slate-300"><b>Resolution:</b> {t.resolution}{t.resolvedBy?.name ? ` — ${t.resolvedBy.name}` : ''}</div>
            )}

            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">Conversation</div>
              <div className="space-y-2">
                {t.messages.map((m) => (
                  <div key={m._id} className={`flex ${m.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.internal ? 'bg-amber-50 dark:bg-amber-950/30 border border-dashed border-amber-300 text-amber-900 dark:text-amber-200' : m.from === 'user' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100' : m.from === 'system' ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 italic' : 'bg-[#FA5A24] text-white'}`}>
                      <div className="text-[10px] opacity-70 mb-0.5">{m.internal ? '🔒 Internal note · ' : ''}{m.authorName || m.from} · {fmtDateTime(m.createdAt)}</div>
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {canManage && (!closed || internal) && (
              <div className="space-y-2">
                <textarea rows={3} className={`${input} w-full`} placeholder={internal ? 'Internal note (only your team can see this)' : 'Reply to the customer'} value={text} onChange={(e) => setText(e.target.value)} />
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} /> Internal note (hidden from customer)</label>
                  <button className={btn} disabled={busy || !text.trim()} onClick={send}>{internal ? 'Add note' : 'Send reply'}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupportTicketsPage() {
  const canManage = can('support.manage');
  const canRecheck = can('payments.manage');
  const [rows, setRows] = useState([]); const [counts, setCounts] = useState({});
  const [pg, setPg] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('active'); const [q, setQ] = useState(''); const [applied, setApplied] = useState('');
  const [mine, setMine] = useState(false); const [open, setOpen] = useState(null); const [err, setErr] = useState('');
  const [liveTick, setLiveTick] = useState(0); // bumped by a live update for the open complaint
  const openRef = React.useRef(null);
  openRef.current = open;

  const load = useCallback(async (page = 1) => {
    try {
      const r = await adminApi(`/support-tickets?page=${page}&limit=20&status=${status}${applied ? `&q=${encodeURIComponent(applied)}` : ''}${mine ? '&mine=1' : ''}`);
      setRows(r.data); setPg(r.pagination); setCounts(r.counts); setErr('');
    } catch (e) { setErr(e.message); }
  }, [status, applied, mine]);
  useEffect(() => { load(1); }, [load]);

  // Live updates: a customer wrote, a colleague replied, or a status changed
  const loadRef = React.useRef(load);
  loadRef.current = load;
  useEffect(() => subscribeSupport((e) => {
    loadRef.current(1);
    if (openRef.current && openRef.current === e.ticketId) setLiveTick((n) => n + 1);
  }), []);

  const TABS = [['active', `Needs action (${(counts.open || 0) + (counts.in_progress || 0)})`], ['open', `Open (${counts.open || 0})`], ['in_progress', `In progress (${counts.in_progress || 0})`], ['resolved', `Resolved (${counts.resolved || 0})`], ['rejected', `Rejected (${counts.rejected || 0})`]];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit' }}>Customer Complaints</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">Complaints customers raise from a transaction in the app ("Need help with this transaction?"). Reply, assign, and close them here.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setStatus(id)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${status === id ? 'bg-[#FA5A24] border-[#FA5A24] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{label}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setApplied(q.trim()); }}>
          <input className={`${input} w-72`} placeholder="Complaint no. (MJ-…), transaction id or user id" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className={btn}>Search</button>
          {applied && <button type="button" className="text-xs font-bold text-slate-500" onClick={() => { setQ(''); setApplied(''); }}>Clear</button>}
        </form>
        <label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> Assigned to me</label>
      </div>

      {err && <p className="text-sm text-red-500 font-semibold">{err}</p>}

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700/60"><th className="p-3">Complaint</th><th className="p-3">Customer</th><th className="p-3">Transaction</th><th className="p-3">Issue</th><th className="p-3">Status</th><th className="p-3">Assigned</th><th className="p-3">Last activity</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={7}>No complaints here.</td></tr> : rows.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 dark:border-slate-700/40 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-900/20" onClick={() => setOpen(t.id)}>
                <td className="p-3"><div className="font-mono font-bold text-[#FA5A24] text-xs flex items-center gap-1">{t.adminUnread && <span className="w-2 h-2 rounded-full bg-red-500 inline-block" title="New message" />}{t.number}{t.priority === 'high' && <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">HIGH</span>}</div><div className="text-[11px] text-slate-400 max-w-[200px] truncate">{t.preview}</div></td>
                <td className="p-3"><div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">{t.user?.name || '—'}</div><div className="text-[11px] text-slate-400">{t.user?.phone}</div></td>
                <td className="p-3"><div className="text-xs text-slate-700 dark:text-slate-200">{t.ref.title}</div><div className="text-[11px] text-slate-400">{inr(t.ref.amount)}</div></td>
                <td className="p-3 text-xs text-slate-500">{CATEGORY[t.category]}</td>
                <td className="p-3"><Pill s={t.status} /></td>
                <td className="p-3 text-xs text-slate-500">{t.assignedTo?.name || '—'}</td>
                <td className="p-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateTime(t.lastActivityAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Page {pg.page} of {pg.pages || 1} · {pg.total || 0} complaints</span>
        <div className="flex gap-2">
          <button disabled={pg.page <= 1} onClick={() => load(pg.page - 1)} className={ghost}>Previous</button>
          <button disabled={pg.page >= pg.pages} onClick={() => load(pg.page + 1)} className={ghost}>Next</button>
        </div>
      </div>

      {open && <Detail id={open} refreshKey={liveTick} canManage={canManage} canRecheck={canRecheck} onClose={() => setOpen(null)} onChanged={() => load(pg.page)} />}
    </div>
  );
}
