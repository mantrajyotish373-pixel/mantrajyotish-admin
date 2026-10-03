import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiBase, getAdmin, isSuperAdmin, refreshProfile, PROFILE_UPDATED_EVENT } from '../config/authSession';

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

const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
const fmtUptime = (s) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return `${d ? `${d}d ` : ''}${h}h ${m}m`; };
const device = (ua = '') => {
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown device';
  return `${browser} on ${os}`;
};

const card = 'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm';
const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm disabled:opacity-60';
const btn = 'px-4 py-2 rounded-xl bg-[#FA5A24] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50';
const Label = ({ children }) => <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{children}</label>;
const Msg = ({ m }) => (m ? <p className={`text-sm font-semibold ${m.ok ? 'text-emerald-600' : 'text-red-500'}`}>{m.text}</p> : null);

// ---------------- Profile ----------------
function ProfileTab({ admin }) {
  const [name, setName] = useState(admin.name || '');
  const [phone, setPhone] = useState(admin.phone || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const save = async () => {
    setBusy(true); setMsg(null);
    try { await api('/profile', { method: 'PUT', body: { name, phone } }); await refreshProfile(); setMsg({ ok: true, text: 'Profile saved.' }); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
    setBusy(false);
  };

  return (
    <div className={card}>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FA5A24] flex items-center justify-center text-xl font-bold">{(admin.name || 'A').charAt(0).toUpperCase()}</div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{admin.name}</h3>
          <span className="text-[10px] font-extrabold text-[#FA5A24] bg-orange-50 dark:bg-orange-500/10 rounded-md px-2 py-0.5 uppercase tracking-wider">{admin.roleName}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div><Label>Full name</Label><input className={input} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Phone</Label><input className={input} value={phone} placeholder="+91 …" onChange={(e) => setPhone(e.target.value)} /></div>
        <div><Label>Login email</Label><input className={input} value={admin.email} disabled /><p className="text-[11px] text-slate-400 mt-1">Your login email can only be changed by the super admin.</p></div>
        <div><Label>Role</Label><input className={input} value={admin.roleName} disabled /></div>
        <div><Label>Member since</Label><input className={input} value={fmtDate(admin.createdAt)} disabled /></div>
        <div><Label>Last login</Label><input className={input} value={fmtDate(admin.lastLoginAt)} disabled /></div>
      </div>
      <div className="flex items-center gap-4 mt-5"><button className={btn} disabled={busy || !name.trim()} onClick={save}>{busy ? 'Saving…' : 'Save profile'}</button><Msg m={msg} /></div>
    </div>
  );
}

// ---------------- My access (super admin only) ----------------
function AccessTab({ admin }) {
  const navigate = useNavigate();
  return (
    <div className={card}>
      <h3 className="font-bold text-slate-800 dark:text-slate-100">{admin.roleName}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        You are the super admin: full access to every section and all data (including earnings), plus team, roles, platform settings and the audit log, which only you can use.
      </p>
      <div className="flex flex-wrap gap-2 mt-3 text-xs font-bold">
        <button className={btn} onClick={() => navigate('/team')}>Team members</button>
        <button className={btn} onClick={() => navigate('/roles')}>Roles & permissions</button>
        <button className={btn} onClick={() => navigate('/audit-log')}>Audit log</button>
      </div>
    </div>
  );
}

// ---------------- Security: password + sessions ----------------
function SecurityTab({ admin }) {
  const [cur, setCur] = useState(''); const [next, setNext] = useState(''); const [again, setAgain] = useState('');
  const [pwBusy, setPwBusy] = useState(false); const [pwMsg, setPwMsg] = useState(null);
  const [sessions, setSessions] = useState([]); const [sMsg, setSMsg] = useState(null);
  const refreshToken = localStorage.getItem('refreshToken');

  const loadSessions = useCallback(async () => {
    try { setSessions((await api('/sessions', { method: 'POST', body: { refreshToken } })).data); }
    catch (e) { setSMsg({ ok: false, text: e.message }); }
  }, [refreshToken]);
  useEffect(() => { loadSessions(); }, [loadSessions]);

  const changePw = async () => {
    setPwMsg(null);
    if (next !== again) return setPwMsg({ ok: false, text: 'New passwords do not match.' });
    setPwBusy(true);
    try {
      await api('/password', { method: 'PUT', body: { currentPassword: cur, newPassword: next, refreshToken } });
      setCur(''); setNext(''); setAgain('');
      setPwMsg({ ok: true, text: 'Password changed. Other devices were signed out.' });
      await Promise.all([refreshProfile(), loadSessions()]);
    } catch (e) { setPwMsg({ ok: false, text: e.message }); }
    setPwBusy(false);
  };

  const revoke = async (sid) => { try { await api(`/sessions/${sid}`, { method: 'DELETE' }); await loadSessions(); } catch (e) { setSMsg({ ok: false, text: e.message }); } };
  const revokeOthers = async () => {
    if (!window.confirm('Sign out every other device?')) return;
    try { const r = await api('/sessions/revoke-others', { method: 'POST', body: { refreshToken } }); setSMsg({ ok: true, text: `Signed out ${r.removed} other device(s).` }); await loadSessions(); }
    catch (e) { setSMsg({ ok: false, text: e.message }); }
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Change password</h3>
        <p className="text-xs text-slate-400 mb-4">Last changed: {admin.passwordChangedAt ? fmtDate(admin.passwordChangedAt) : 'never changed since the account was created'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
          <div><Label>Current password</Label><input type="password" className={input} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></div>
          <div><Label>New password (min 8)</Label><input type="password" className={input} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" /></div>
          <div><Label>Repeat new password</Label><input type="password" className={input} value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" /></div>
        </div>
        <div className="flex items-center gap-4 mt-4"><button className={btn} disabled={pwBusy || !cur || next.length < 8 || !again} onClick={changePw}>{pwBusy ? 'Changing…' : 'Change password'}</button><Msg m={pwMsg} /></div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div><h3 className="font-bold text-slate-800 dark:text-slate-100">Login sessions</h3><p className="text-xs text-slate-400">Devices currently signed in to your account.</p></div>
          {sessions.length > 1 && <button onClick={revokeOthers} className="text-xs font-bold text-red-500 hover:underline whitespace-nowrap">Sign out all other devices</button>}
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {sessions.length === 0 && <p className="text-sm text-slate-400 py-2">No active sessions found.</p>}
          {sessions.map((s) => (
            <div key={s.sid} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{device(s.userAgent)} {s.current && <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">This device</span>}</div>
                <div className="text-xs text-slate-400">{s.ip || 'IP unknown'} · signed in {fmtDate(s.createdAt)} · last active {fmtDate(s.lastUsedAt)}</div>
              </div>
              {!s.current && <button onClick={() => revoke(s.sid)} className="text-xs font-bold text-red-500 hover:underline">Sign out</button>}
            </div>
          ))}
        </div>
        <div className="mt-2"><Msg m={sMsg} /></div>
      </div>

      <div className={card}>
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Two-factor authentication</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Not available yet. Your account is protected by your password, login rate limiting and the sessions list above.</p>
      </div>
    </div>
  );
}

// ---------------- Platform settings (super admin) ----------------
function PlatformTab() {
  const [s, setS] = useState(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(null);
  useEffect(() => { api('/settings').then((r) => setS(r.data)).catch((e) => setMsg({ ok: false, text: e.message })); }, []);
  if (!s) return <div className={card}><Msg m={msg} />{!msg && <p className="text-sm text-slate-400">Loading…</p>}</div>;

  const save = async () => {
    if (s.maintenanceMode && !window.confirm('Maintenance mode will block the user app, astrologer app and website API for everyone except admins. Continue?')) return;
    setBusy(true); setMsg(null);
    try {
      const r = await api('/settings', { method: 'PUT', body: { maintenanceMode: s.maintenanceMode, maintenanceMessage: s.maintenanceMessage, supportEmail: s.supportEmail, supportPhone: s.supportPhone, termsUrl: s.termsUrl || '', privacyPolicyUrl: s.privacyPolicyUrl || '', aboutText: s.aboutText || '', minWithdrawal: Number(s.minWithdrawal) } });
      setS(r.data); setMsg({ ok: true, text: 'Settings saved and applied.' });
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    setBusy(false);
  };

  return (
    <div className="space-y-4">
      <div className={`${card} ${s.maintenanceMode ? 'border-amber-300 dark:border-amber-700' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Maintenance mode</h3>
            <p className="text-xs text-slate-400 mt-0.5">When ON, the public API returns a "under maintenance" response to all users and astrologers. Admins and payment confirmations keep working. Live chats and calls already in progress are not cut off.</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={s.maintenanceMode} onChange={(e) => setS({ ...s, maintenanceMode: e.target.checked })} />
            <div className="w-11 h-6 bg-slate-200 peer-checked:bg-amber-500 rounded-full relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>
        <div className="mt-4 max-w-xl"><Label>Message shown to users</Label><input className={input} maxLength={200} value={s.maintenanceMessage} onChange={(e) => setS({ ...s, maintenanceMessage: e.target.value })} /></div>
        {s.maintenanceMode && <p className="mt-3 text-xs font-bold text-amber-600">Maintenance mode is currently {s.maintenanceMode ? 'selected ON' : 'off'}. Save to apply.</p>}
      </div>

      <div className={card}>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Support contact & withdrawals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          <div><Label>Support email</Label><input className={input} value={s.supportEmail} placeholder="help@yourdomain.com" onChange={(e) => setS({ ...s, supportEmail: e.target.value })} /></div>
          <div><Label>Support phone</Label><input className={input} value={s.supportPhone} placeholder="+91 …" onChange={(e) => setS({ ...s, supportPhone: e.target.value })} /></div>
          <div><Label>Minimum withdrawal (₹)</Label><input type="number" min={100} className={input} value={s.minWithdrawal} onChange={(e) => setS({ ...s, minWithdrawal: e.target.value })} /><p className="text-[11px] text-slate-400 mt-1">Applied when astrologers request a payout. Minimum allowed: ₹100.</p></div>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">Support contact is published at <span className="font-mono">/api/settings/public</span> for the apps to display.</p>
      </div>

      <div className={card}>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">User app: About & legal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <div><Label>Terms & Conditions link</Label><input className={input} value={s.termsUrl || ''} placeholder="https://yourdomain.com/terms" onChange={(e) => setS({ ...s, termsUrl: e.target.value })} /></div>
          <div><Label>Privacy Policy link</Label><input className={input} value={s.privacyPolicyUrl || ''} placeholder="https://yourdomain.com/privacy" onChange={(e) => setS({ ...s, privacyPolicyUrl: e.target.value })} /></div>
        </div>
        <div className="mt-4 max-w-3xl"><Label>About text</Label><textarea className={input} rows={3} maxLength={500} value={s.aboutText || ''} placeholder="A short line about the app, shown in Settings > About" onChange={(e) => setS({ ...s, aboutText: e.target.value })} /></div>
        <p className="text-[11px] text-slate-400 mt-3">Links must start with https://. Support email and phone above are shown here too. Users see changes the next time they open Settings.</p>
      </div>

      <div className="flex items-center gap-4"><button className={btn} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save platform settings'}</button><Msg m={msg} /></div>
    </div>
  );
}

// ---------------- System & payments (super admin, read-only) ----------------
function SystemTab() {
  const [d, setD] = useState(null); const [err, setErr] = useState('');
  const load = useCallback(() => { setErr(''); api('/system-info').then((r) => setD(r.data)).catch((e) => setErr(e.message)); }, []);
  useEffect(() => { load(); }, [load]);
  if (err) return <div className={card}><p className="text-sm text-red-500 font-semibold">{err}</p></div>;
  if (!d) return <div className={card}><p className="text-sm text-slate-400">Loading…</p></div>;

  const Row = ({ k, v, good }) => (
    <div className="flex items-center justify-between py-2 text-sm"><span className="text-slate-500 dark:text-slate-400">{k}</span><span className={`font-semibold ${good === true ? 'text-emerald-600' : good === false ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>{v}</span></div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button onClick={load} className="text-xs font-bold text-[#FA5A24] hover:underline">Refresh</button></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={card}>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Payment gateway</h3>
          <Row k="Gateway" v={d.payments.gateway} />
          <Row k="Mode" v={d.payments.mode === 'live' ? 'LIVE (real money)' : d.payments.mode === 'test' ? 'TEST (no real money)' : d.payments.mode} good={d.payments.mode === 'live'} />
          <Row k="Key ID" v={d.payments.keyId || 'Not set'} />
          <Row k="Webhook secret" v={d.payments.webhookSecretConfigured ? 'Configured' : 'Missing'} good={d.payments.webhookSecretConfigured} />
          {d.payments.mode === 'test' && <p className="mt-2 text-xs font-semibold text-amber-600">The server is using Razorpay TEST keys, so user deposits are not real payments.</p>}
        </div>
        <div className={card}>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Server</h3>
          <Row k="Environment" v={d.server.environment} />
          <Row k="Node.js" v={d.server.nodeVersion} />
          <Row k="Uptime" v={fmtUptime(d.server.uptimeSeconds)} />
          <Row k="Memory" v={`${d.server.memoryMB} MB`} />
          <Row k="Server time" v={fmtDate(d.server.serverTime)} />
        </div>
        <div className={card}>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Database & cache</h3>
          <Row k="MongoDB" v={d.database.status} good={d.database.status === 'connected'} />
          <Row k="Registered users" v={d.database.users ?? '—'} />
          <Row k="Astrologers" v={d.database.astrologers ?? '—'} />
          <Row k="Redis" v={d.redis.status} good={d.redis.status === 'connected'} />
        </div>
      </div>
    </div>
  );
}

// ---------------- Team & roles summary (super admin) ----------------
function TeamTab() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null); const [roles, setRoles] = useState(null); const [err, setErr] = useState('');
  useEffect(() => {
    Promise.all([api('/team'), api('/roles')]).then(([t, r]) => { setTeam(t.data); setRoles(r.data); }).catch((e) => setErr(e.message));
  }, []);
  if (err) return <div className={card}><p className="text-sm text-red-500 font-semibold">{err}</p></div>;
  if (!team) return <div className={card}><p className="text-sm text-slate-400">Loading…</p></div>;
  const subs = team.filter((m) => m.role !== 'superadmin');
  const Stat = ({ n, l }) => <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-4"><div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{n}</div><div className="text-xs text-slate-400">{l}</div></div>;
  return (
    <div className={card}>
      <h3 className="font-bold text-slate-800 dark:text-slate-100">Team & roles</h3>
      <p className="text-xs text-slate-400 mb-4">Only the super admin can add sub-admins, create roles and choose what each person can see or do.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat n={subs.length} l="Sub-admins" /><Stat n={subs.filter((m) => m.status === 'active').length} l="Active" />
        <Stat n={subs.filter((m) => m.status === 'disabled').length} l="Disabled" /><Stat n={roles.length} l="Custom roles" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={() => navigate('/team')}>Manage team members</button>
        <button className={btn} onClick={() => navigate('/roles')}>Manage roles & permissions</button>
        <button className={btn} onClick={() => navigate('/audit-log')}>View audit log</button>
      </div>
    </div>
  );
}

// ---------------- Page ----------------
export default function SettingsPage() {
  const [params, setParams] = useSearchParams();
  const [admin, setAdmin] = useState(getAdmin());
  const superAdmin = isSuperAdmin();

  useEffect(() => {
    const sync = () => setAdmin(getAdmin());
    window.addEventListener(PROFILE_UPDATED_EVENT, sync);
    refreshProfile();
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, sync);
  }, []);

  const tabs = useMemo(() => [
    { id: 'profile', label: 'My Profile' },
    { id: 'security', label: 'Security' },
    ...(superAdmin ? [{ id: 'access', label: 'My Access' }, { id: 'platform', label: 'Platform' }, { id: 'system', label: 'System & Payments' }, { id: 'team', label: 'Team & Roles' }] : [])
  ], [superAdmin]);

  const active = tabs.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'profile';
  if (!admin) return null;

  return (
    <div className="flex flex-col gap-5 w-full pb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight" style={{ fontFamily: 'Outfit' }}>Settings</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">{superAdmin ? 'Your account, platform configuration and system status.' : 'Your profile and account security.'}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setParams({ tab: t.id })}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border ${active === t.id ? 'bg-[#FA5A24] border-[#FA5A24] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{t.label}</button>
        ))}
      </div>
      {active === 'profile' && <ProfileTab admin={admin} />}
      {active === 'access' && superAdmin && <AccessTab admin={admin} />}
      {active === 'security' && <SecurityTab admin={admin} />}
      {active === 'platform' && superAdmin && <PlatformTab />}
      {active === 'system' && superAdmin && <SystemTab />}
      {active === 'team' && superAdmin && <TeamTab />}
    </div>
  );
}
