'use client';

import AuthGate from '@/components/AuthGate';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTrip, deleteTrip } from '@/lib/trips';
import { Trip } from '@/lib/types';
import RouteMap from '@/components/RouteMap';
import WeatherWidget from '@/components/WeatherWidget';
import PhotoVault from '@/components/PhotoVault';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Sparkles,
  Trash2,
  Wallet,
  Lightbulb,
  Map as MapIcon,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { haversineKm } from '@/lib/srilanka';

export default function ItineraryPage() {
  return (
    <AuthGate>
      <Itinerary />
    </AuthGate>
  );
}

function Itinerary() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    getTrip(id).then(t => {
      setTrip(t);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this trip permanently?')) return;
    await deleteTrip(id);
    toast.success('Trip deleted');
    router.push('/trips');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }
  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Trip not found</h2>
        <Link href="/trips" className="btn-primary mt-4">Back to trips</Link>
      </div>
    );
  }

  const day = trip.itinerary.days[activeDay] ?? trip.itinerary.days[0];
  if (!day) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Itinerary is empty</h2>
        <Link href="/trips" className="btn-primary mt-4">Back to trips</Link>
      </div>
    );
  }

  const allActivities = trip.itinerary.days.flatMap(d => d.activities);
  const firstActivity = day.activities[0];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost !p-2">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Link href={`/map/${trip.id}`} className="btn-ghost !py-2 !text-sm ml-auto">
          <MapIcon className="h-4 w-4" /> View full map
        </Link>
        <button onClick={handleDelete} className="btn-ghost !p-2 text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-brand-500 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-25 [background-image:url('https://picsum.photos/seed/itinerary-header/1600/600')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10">
          <span className="chip !bg-white/20 !border-white/30 !text-white">
            <Sparkles className="h-3 w-3" /> AI-generated
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-3">
            {trip.itinerary.title}
          </h1>
          <p className="mt-2 text-white/85 max-w-3xl">{trip.itinerary.summary}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {trip.input.startDate} → {trip.input.endDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="h-4 w-4" /> {trip.input.budget} · {trip.itinerary.totalBudget}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {trip.input.destination}
            </span>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Day tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {trip.itinerary.days.map((d, i) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(i)}
                className={`shrink-0 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
                  activeDay === i
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                Day {d.day}
                <span className="block text-[10px] font-normal opacity-80">{d.date}</span>
              </button>
            ))}
          </div>

          {/* Active day */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">{day.date}</p>
                <h2 className="font-display text-xl font-bold">Day {day.day} — {day.theme}</h2>
              </div>
              <span className="chip">{day.activities.length} activities</span>
            </div>

            <ol className="relative space-y-4 pl-6 border-l-2 border-brand-200 dark:border-brand-900">
              {day.activities.map((a, i) => {
                const next = day.activities[i + 1];
                const distance =
                  next && a.lat != null && a.lng != null && next.lat != null && next.lng != null
                    ? haversineKm(
                        { lat: a.lat, lng: a.lng },
                        { lat: next.lat, lng: next.lng },
                      )
                    : null;
                return (
                  <li key={i} className="relative">
                    <span className="absolute -left-[31px] top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="card p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{a.title}</h3>
                        <span className="text-xs text-slate-500 inline-flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3" /> {a.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {a.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {a.location}
                        </span>
                        {a.durationMins ? (
                          <span className="inline-flex items-center gap-1">
                            ⏱ {a.durationMins} min
                          </span>
                        ) : null}
                        {a.cost ? (
                          <span className="inline-flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> {a.cost}
                          </span>
                        ) : null}
                      </div>
                      {a.tip && (
                        <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2.5 text-xs text-amber-800 dark:text-amber-200">
                          <Lightbulb className="h-4 w-4 shrink-0" />
                          <span>{a.tip}</span>
                        </div>
                      )}
                    </div>
                    {distance !== null && (
                      <p className="text-[11px] text-slate-400 italic mt-1.5 pl-1">
                        ~{distance.toFixed(1)} km to next stop
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <RouteMap activities={day.activities} height={420} />
        </div>

        <aside className="space-y-5">
          {firstActivity?.lat != null && firstActivity?.lng != null && (
            <WeatherWidget lat={firstActivity.lat} lng={firstActivity.lng} />
          )}
          <div className="card p-5">
            <h3 className="font-display font-bold mb-3">Trip stats</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Days</dt><dd className="font-semibold">{trip.itinerary.days.length}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Activities</dt><dd className="font-semibold">{allActivities.length}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Travelers</dt><dd className="font-semibold">{trip.input.travelers}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Budget tier</dt><dd className="font-semibold">{trip.input.budget}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Estimated cost</dt><dd className="font-semibold">{trip.itinerary.totalBudget}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {trip.input.vibes.map(v => <span key={v} className="chip">{v}</span>)}
            </div>
          </div>
          {user && (
            <PhotoVault tripId={trip.id} userId={user.uid} initialPhotos={trip.photos || []} />
          )}
        </aside>
      </div>
    </div>
  );
}
