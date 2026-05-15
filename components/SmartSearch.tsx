'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { SRI_LANKA_DESTINATIONS, searchDestinations } from '@/lib/srilanka';

export default function SmartSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const results = useMemo(() => searchDestinations(q).slice(0, 8), [q]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          ref={inputRef}
          value={q}
          onChange={e => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search Ella, Sigiriya, Galle, beaches…"
          className="input !py-3.5 !pl-12 !text-base shadow-sm"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full card p-1 max-h-96 overflow-auto">
          {results.map(d => (
            <button
              key={d.id}
              onClick={() => {
                router.push(`/attraction/${d.id}`);
                setOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div
                className="h-10 w-10 rounded-lg bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${d.image})` }}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{d.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {d.region}
                </div>
              </div>
              <div className="flex gap-1">
                {d.vibe.slice(0, 2).map(v => (
                  <span key={v} className="chip text-[10px] !py-0.5">{v}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
