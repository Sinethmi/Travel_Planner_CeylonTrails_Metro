'use client';

import AuthGate from '@/components/AuthGate';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTrip } from '@/lib/trips';
import { Trip } from '@/lib/types';
import RouteMap from '@/components/RouteMap';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function MapPage() {
  return (
    <AuthGate>
      <MapView />
    </AuthGate>
  );
}

function MapView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrip(id).then(t => { setTrip(t); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }
  if (!trip) return null;

  const allActivities = trip.itinerary.days.flatMap(d => d.activities);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="btn-ghost !p-2">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-right">
          <h1 className="font-display text-xl font-bold">{trip.itinerary.title}</h1>
          <p className="text-xs text-slate-500">{allActivities.length} stops · {trip.itinerary.days.length} days</p>
        </div>
      </div>
      <RouteMap activities={allActivities} height={650} />
    </div>
  );
}
