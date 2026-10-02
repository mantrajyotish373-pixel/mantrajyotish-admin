import React from 'react';

// Checkbox grid grouped by module. `catalog` comes from GET /api/admin/permissions.
export default function PermissionGrid({ catalog, value, onChange, disabled = false }) {
  const selected = new Set(value || []);
  const all = catalog.flatMap((m) => m.actions.map((a) => `${m.key}.${a.key}`));

  const toggle = (perm) => {
    const next = new Set(selected);
    next.has(perm) ? next.delete(perm) : next.add(perm);
    onChange([...next]);
  };
  const toggleModule = (m) => {
    const perms = m.actions.map((a) => `${m.key}.${a.key}`);
    const next = new Set(selected);
    const allOn = perms.every((p) => next.has(p));
    perms.forEach((p) => (allOn ? next.delete(p) : next.add(p)));
    onChange([...next]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{selected.size} of {all.length} permissions selected</span>
        {!disabled && (
          <div className="flex gap-3 text-xs font-bold">
            <button type="button" onClick={() => onChange(all)} className="text-[#FA5A24] hover:underline">Select all</button>
            <button type="button" onClick={() => onChange([])} className="text-slate-500 hover:underline">Clear</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {catalog.map((m) => {
          const perms = m.actions.map((a) => `${m.key}.${a.key}`);
          const allOn = perms.every((p) => selected.has(p));
          return (
            <div key={m.key} className="rounded-xl border border-slate-100 dark:border-slate-700/60 p-3 bg-slate-50/60 dark:bg-slate-800/40">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer">
                <input type="checkbox" disabled={disabled} checked={allOn} onChange={() => toggleModule(m)} className="accent-[#FA5A24] w-4 h-4" />
                {m.label}
              </label>
              <div className="mt-2 space-y-1.5 pl-6">
                {m.actions.map((a) => {
                  const perm = `${m.key}.${a.key}`;
                  return (
                    <label key={perm} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" disabled={disabled} checked={selected.has(perm)} onChange={() => toggle(perm)} className="accent-[#FA5A24] w-3.5 h-3.5" />
                      {a.label}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
