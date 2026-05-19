'use client';

import Link from 'next/link';
import { Destination } from '@/lib/srilanka';
import { Star, MapPin } from 'lucide-react';

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link
      href={`/attraction/${d.id}`}
      className="group card overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      <div
        className="aspect-[4/3] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${d.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
        <div className="absolute top-3 left-3 chip !bg-white/90 !text-slate-800 !border-white/50">
          <Star className="h-3 w-3 fill-sun-500 text-sun-500" />
          {d.rating}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-display text-lg font-bold">{d.name}</h3>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {d.region}
          </p>
        </div>
      </div>
      <div className="p-3 flex gap-1 flex-wrap">
        {d.vibe.slice(0, 3).map(v => (
          <span key={v} className="chip text-[10px] !py-0.5">
            {v}
          </span>
        ))}
      </div>
    </Link>
  );
}
