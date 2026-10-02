import React, { useRef, useState } from 'react';
import { apiBase } from '../config/authSession';

// Image picker: uploads the chosen file through /api/upload/image and returns the hosted URL via onChange.
export default function ImageUploadField({ value, onChange, hint = 'Square image works best' }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('Please choose an image file'); return; }
    if (file.size > 8 * 1024 * 1024) { setErr('Image must be under 8 MB'); return; }
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${apiBase}/api/upload/image`, { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) throw new Error(json.message || 'Upload failed');
      onChange(json.url);
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 overflow-hidden flex items-center justify-center text-[10px] text-slate-400 shrink-0">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : 'No image'}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="px-3 py-1.5 rounded-lg bg-[#FA5A24] text-white text-xs font-bold disabled:opacity-50">{busy ? 'Uploading…' : value ? 'Change image' : 'Upload image'}</button>
            {value && <button type="button" onClick={() => onChange('')} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500">Remove</button>}
          </div>
          <input className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs" placeholder="…or paste an image link" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-1">{hint}</p>
      {err && <p className="text-xs text-red-500 font-semibold mt-1">{err}</p>}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  );
}
