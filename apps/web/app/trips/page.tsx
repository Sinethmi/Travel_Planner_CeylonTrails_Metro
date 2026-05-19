'use client';

import AuthGate from '@/components/AuthGate';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listUserTrips, deleteTrip } from '@/lib/trips';
import { Trip } from '@/lib/types';
import Link from 'next/link';
import {
  Calendar,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Wallet,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TripsPage() {
  return (
    <AuthGate>
      <Trips />
    </AuthGate>
  );
}

function Trips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    setTrips(await listUserTrips(user.uid));
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const remove = async (id: string) => {
    if (!confirm('Delete this trip?')) return;
    await deleteTrip(id);
    toast.success('Trip deleted');
    refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My trips</h1>
          <p className="text-slate-500 mt-1">All your saved itineraries, synced via Firestore.</p>
        </div>
        <Link href="/planner" className="btn-primary">
          <Plus className="h-4 w-4" /> New trip
        </Link>
      </header>

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : trips.length === 0 ? (
        <div className="card p-12 text-center">
          <Sparkles className="h-10 w-10 text-brand-500 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold">No trips yet</h3>
          <p className="text-slate-500 mt-1">Generate your first AI-powered itinerary now.</p>
          <Link href="/planner" className="btn-primary mt-4 inline-flex">
            <Sparkles className="h-4 w-4" /> Plan a trip
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map(t => (
            <div key={t.id} className="card overflow-hidden group hover:shadow-lg transition">
              <Link href={`/itinerary/${t.id}`}>
                <div
                  className="aspect-[16/9] bg-gradient-to-br from-brand-500 to-emerald-700 relative bg-cover bg-center"
                  style={{ backgroundImage: t.coverImage ? `url(${t.coverImage})` : undefined }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-display text-lg font-bold line-clamp-2">{t.itinerary.title}</h3>
                  </div>
                </div>
              </Link>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {t.input.destination}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" /> {t.input.startDate} → {t.input.endDate}
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{t.input.travelers}</span>
                  <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{t.input.budget}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {t.input.vibes.slice(0, 3).map(v => <span key={v} className="chip text-[10px]">{v}</span>)}
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/itinerary/${t.id}`} className="btn-outline flex-1 !py-1.5 !text-xs">Open</Link>
                  <button onClick={() => remove(t.id)} className="btn-ghost !p-2 text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
