'use client';

import AuthGate from '@/components/AuthGate';
import SmartSearch from '@/components/SmartSearch';
import DestinationCard from '@/components/DestinationCard';
import WeatherWidget from '@/components/WeatherWidget';
import { SRI_LANKA_DESTINATIONS } from '@/lib/srilanka';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}

function Dashboard() {
  const { profile } = useAuth();
  const featured = SRI_LANKA_DESTINATIONS.slice(0, 8);
  const trending = SRI_LANKA_DESTINATIONS.slice(2, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-25 [background-image:url('https://picsum.photos/seed/ceylontrails-hero/1600/900')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
            {profile?.displayName ? `Welcome back, ${profile.displayName}` : 'Welcome'}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold mt-2 leading-tight">
            Where will Sri Lanka take you next?
          </h1>
          <p className="mt-3 text-white/80 max-w-lg">
            Tell our AI your vibe and get a day-by-day plan, optimised routes, and live weather —
            in seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/planner" className="btn bg-white text-brand-700 hover:bg-white/90 font-semibold">
              <Sparkles className="h-4 w-4" /> Plan with AI
            </Link>
            <Link href="/trips" className="btn-ghost !bg-white/10 !border-white/30 !text-white hover:!bg-white/20">
              My Trips <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Search + Weather */}
      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display text-xl font-bold">Smart search</h2>
          <SmartSearch />
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold">Colombo right now</h2>
          <WeatherWidget lat={6.9271} lng={79.8612} />
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold">Featured destinations</h2>
            <p className="text-slate-500 text-sm">Hand-picked Sri Lankan hubs</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(d => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold">Trending this season</h2>
          <p className="text-slate-500 text-sm">Popular picks for {new Date().toLocaleString('en-US', { month: 'long' })}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map(d => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>
    </div>
  );
}
