'use client';

import AuthGate from '@/components/AuthGate';
import { useParams, useRouter } from 'next/navigation';
import { findDestination, SRI_LANKA_DESTINATIONS } from '@/lib/srilanka';
import WeatherWidget from '@/components/WeatherWidget';
import DestinationCard from '@/components/DestinationCard';
import Link from 'next/link';
import { ArrowLeft, MapPin, Sparkles, Star } from 'lucide-react';

export default function AttractionPage() {
  return (
    <AuthGate>
      <Attraction />
    </AuthGate>
  );
}

function Attraction() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const d = findDestination(id);

  if (!d) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Destination not found</h2>
        <Link href="/dashboard" className="btn-primary mt-4">Back home</Link>
      </div>
    );
  }

  const similar = SRI_LANKA_DESTINATIONS.filter(
    x => x.id !== d.id && x.vibe.some(v => d.vibe.includes(v)),
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <button onClick={() => router.back()} className="btn-ghost !p-2">
        <ArrowLeft className="h-4 w-4" />
      </button>

      <header
        className="relative h-72 md:h-96 rounded-3xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${d.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
          <div className="flex gap-2 mb-2">
            {d.vibe.map(v => (
              <span key={v} className="chip !bg-white/20 !text-white !border-white/30">{v}</span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{d.name}</h1>
          <p className="mt-2 text-white/80 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {d.region}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-sun-400 text-sun-400" /> {d.rating}
            </span>
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold mb-2">About this place</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{d.description}</p>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-500" /> AI travel tips
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Best time to visit: early morning (before 9 AM) to avoid the crowds and heat.</li>
              <li>• Stay hydrated and wear sun protection — Sri Lanka is hot year-round.</li>
              <li>• Local tuk-tuks are the easiest way around — agree on the fare upfront.</li>
              <li>• Try the regional rice & curry — every province has its own twist.</li>
              <li>• Carry a light rain jacket during monsoon months (May–Sep on the west coast).</li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-xl font-bold mb-3">Coordinates</h2>
            <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
              {d.lat.toFixed(4)}, {d.lng.toFixed(4)}
            </p>
            <a
              href={`https://www.google.com/maps?q=${d.lat},${d.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline mt-3 !py-2 !text-sm"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <aside className="space-y-5">
          <WeatherWidget lat={d.lat} lng={d.lng} />
          <Link href="/planner" className="btn-primary w-full">
            <Sparkles className="h-4 w-4" /> Plan a trip here
          </Link>
          <Link href={`/nearby?lat=${d.lat}&lng=${d.lng}&name=${encodeURIComponent(d.name)}`} className="btn-ghost w-full">
            <MapPin className="h-4 w-4" /> Find nearby places
          </Link>
        </aside>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-4">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map(s => <DestinationCard key={s.id} d={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
