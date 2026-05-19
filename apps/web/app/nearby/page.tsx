'use client';

import AuthGate from '@/components/AuthGate';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDestinations } from '@/contexts/DestinationsContext';
import { haversineKm } from '@/lib/srilanka';
import {
  Utensils,
  Hotel,
  Fuel,
  Loader2,
  MapPin,
  Compass,
  Coffee,
  TreePine,
} from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';

type Cat = 'restaurant' | 'lodging' | 'gas_station' | 'tourist_attraction' | 'cafe' | 'park';

const CATS: { key: Cat; label: string; icon: typeof Utensils }[] = [
  { key: 'restaurant', label: 'Restaurants', icon: Utensils },
  { key: 'lodging', label: 'Hotels', icon: Hotel },
  { key: 'cafe', label: 'Cafés', icon: Coffee },
  { key: 'gas_station', label: 'Rest stops', icon: Fuel },
  { key: 'tourist_attraction', label: 'Attractions', icon: Compass },
  { key: 'park', label: 'Parks', icon: TreePine },
];

interface PlaceResult {
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  geometry?: { location: { lat: () => number; lng: () => number } };
  place_id?: string;
  types?: string[];
}

export default function NearbyPage() {
  return (
    <AuthGate>
      <Nearby />
    </AuthGate>
  );
}

function Nearby() {
  const search = useSearchParams();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey, libraries: ['places'] });
  const { destinations } = useDestinations();

  const queryLat = parseFloat(search.get('lat') || '');
  const queryLng = parseFloat(search.get('lng') || '');
  const queryName = search.get('name');

  const [center, setCenter] = useState({
    lat: Number.isFinite(queryLat) ? queryLat : 6.9271,
    lng: Number.isFinite(queryLng) ? queryLng : 79.8612,
  });
  const [locationName, setLocationName] = useState(queryName || 'Colombo');
  const [cat, setCat] = useState<Cat>('restaurant');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !apiKey) return;
    setLoading(true);
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      {
        location: new google.maps.LatLng(center.lat, center.lng),
        radius: 5000,
        type: cat,
      },
      (res, status) => {
        setLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && res) {
          setResults(res as unknown as PlaceResult[]);
        } else {
          setResults([]);
        }
      },
    );
  }, [isLoaded, apiKey, center, cat]);

  const fallback = useMemo(() => {
    return destinations
      .map(d => ({ ...d, distance: haversineKm(center, { lat: d.lat, lng: d.lng }) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }, [center, destinations]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Nearby Finder</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-1.5">
          <MapPin className="h-4 w-4" /> Around {locationName}
        </p>
      </header>

      {/* Hub selector */}
      <div className="card p-4">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Search around</p>
        <div className="flex gap-2 overflow-x-auto">
          {destinations.map(d => (
            <button
              key={d.id}
              onClick={() => {
                setCenter({ lat: d.lat, lng: d.lng });
                setLocationName(d.name);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${
                locationName === d.name
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {CATS.map(c => {
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`card p-4 flex flex-col items-center gap-2 transition ${
                active ? '!bg-brand-500 !text-white border-brand-500' : 'hover:border-brand-300'
              }`}
            >
              <c.icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {!apiKey ? (
        <div className="card p-5 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold mb-1">Google Places API not configured.</p>
          <p className="text-slate-500">
            Add <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> with Places API enabled to see live businesses. Showing nearest Sri Lankan hubs instead:
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {fallback.map(f => (
              <li key={f.id} className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-medium">{f.name}</span>
                <span className="text-slate-500 text-sm">{f.distance.toFixed(1)} km</span>
              </li>
            ))}
          </ul>
        </div>
      ) : loading ? (
        <div className="card p-10 grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : results.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">No results — try a different category or location.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((p, i) => {
            const lat = p.geometry?.location.lat?.();
            const lng = p.geometry?.location.lng?.();
            return (
              <a
                key={p.place_id || i}
                href={`https://www.google.com/maps/place/?q=place_id:${p.place_id}`}
                target="_blank"
                rel="noreferrer"
                className="card p-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.vicinity}</p>
                {p.rating != null && (
                  <p className="text-xs mt-2 text-slate-600 dark:text-slate-300">
                    ★ {p.rating} ({p.user_ratings_total || 0})
                  </p>
                )}
                {lat != null && lng != null && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {haversineKm(center, { lat, lng }).toFixed(1)} km away
                  </p>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
