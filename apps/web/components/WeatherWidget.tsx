'use client';

import { useEffect, useState } from 'react';
import { WeatherResponse } from '@/lib/weather';
import { Cloud, CloudRain, Droplets, Sun, Wind, Loader2 } from 'lucide-react';

export default function WeatherWidget({
  lat,
  lng,
  compact = false,
}: {
  lat: number;
  lng: number;
  compact?: boolean;
}) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then(r => r.json())
      .then(d => !cancel && setData(d))
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [lat, lng]);

  if (loading) {
    return (
      <div className={`card p-4 flex items-center gap-2 ${compact ? '' : ''}`}>
        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
        <span className="text-sm text-slate-500">Loading weather…</span>
      </div>
    );
  }

  if (!data) return null;

  const Icon = data.isRainy ? CloudRain : data.icon.includes('01') ? Sun : Cloud;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-sun-500" />
        <span className="font-semibold">{data.temp}°C</span>
        <span className="text-slate-500 capitalize hidden sm:inline">{data.description}</span>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Weather now</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold">{data.temp}°</span>
            <span className="text-slate-500">C</span>
          </div>
          <p className="text-sm capitalize text-slate-600 dark:text-slate-400 mt-0.5">
            {data.description} · feels {data.feelsLike}°
          </p>
        </div>
        <Icon className="h-12 w-12 text-sun-500" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Droplets className="h-4 w-4" />
          {data.humidity}% humidity
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Wind className="h-4 w-4" />
          {data.wind} m/s wind
        </div>
      </div>
      {data.isRainy && (
        <div className="mt-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 px-3 py-2 text-sm text-sky-700 dark:text-sky-300">
          🌧️ Rain expected — consider indoor/cultural activities like museums or tea factory tours.
        </div>
      )}
    </div>
  );
}
