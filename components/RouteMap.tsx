'use client';

import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { Activity } from '@/lib/types';
import { MapPin } from 'lucide-react';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const FALLBACK_CENTER = { lat: 7.8731, lng: 80.7718 };

export default function RouteMap({
  activities,
  height = 500,
}: {
  activities: Activity[];
  height?: number;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const points = useMemo(
    () =>
      activities
        .filter(a => a.lat != null && a.lng != null)
        .map(a => ({ lat: a.lat as number, lng: a.lng as number, title: a.title, location: a.location })),
    [activities],
  );

  const center = points[0] || FALLBACK_CENTER;
  const [active, setActive] = useState<number | null>(null);

  if (!apiKey || loadError) {
    return <MapFallback activities={activities} height={height} />;
  }

  if (!isLoaded) {
    return (
      <div className="card grid place-items-center" style={{ height }}>
        <p className="text-slate-500 text-sm">Loading map…</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden" style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        options={{
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {points.map((p, i) => (
          <Marker
            key={i}
            position={p}
            label={{ text: String(i + 1), color: 'white', fontWeight: 'bold' }}
            onClick={() => setActive(i)}
          />
        ))}
        {active !== null && points[active] && (
          <InfoWindow position={points[active]} onCloseClick={() => setActive(null)}>
            <div className="text-sm">
              <div className="font-semibold">{points[active].title}</div>
              <div className="text-slate-500 text-xs">{points[active].location}</div>
            </div>
          </InfoWindow>
        )}
        <Polyline
          path={points}
          options={{
            strokeColor: '#1d7d49',
            strokeWeight: 4,
            strokeOpacity: 0.9,
            geodesic: true,
          }}
        />
      </GoogleMap>
    </div>
  );
}

function MapFallback({ activities, height }: { activities: Activity[]; height: number }) {
  return (
    <div
      className="card overflow-hidden relative bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-900 dark:to-slate-800"
      style={{ height }}
    >
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="text-center max-w-md">
          <MapPin className="h-10 w-10 text-brand-500 mx-auto mb-3" />
          <p className="font-semibold">Map preview</p>
          <p className="text-sm text-slate-500 mb-4">
            Add a Google Maps API key to <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable interactive maps.
          </p>
          <ol className="text-left text-sm space-y-1.5 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            {activities.slice(0, 6).map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                  {i + 1}
                </span>
                <span className="truncate">{a.location}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
