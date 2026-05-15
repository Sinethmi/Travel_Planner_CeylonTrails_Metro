'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/contexts/AuthContext';
import { saveTrip } from '@/lib/trips';
import { PlannerInput, Vibe } from '@/lib/types';
import { SRI_LANKA_DESTINATIONS } from '@/lib/srilanka';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Calendar,
  Wallet,
  Users,
  Loader2,
  MapPin,
  Mountain,
  Building2,
  Waves,
  Trees,
  PawPrint,
  Sun,
  Utensils,
} from 'lucide-react';

const VIBES: { name: Vibe; icon: typeof Mountain; color: string }[] = [
  { name: 'Adventure', icon: Mountain, color: 'from-orange-400 to-red-500' },
  { name: 'Nature', icon: Trees, color: 'from-green-400 to-emerald-600' },
  { name: 'History', icon: Building2, color: 'from-amber-400 to-orange-500' },
  { name: 'Beach', icon: Waves, color: 'from-cyan-400 to-blue-500' },
  { name: 'Cultural', icon: Building2, color: 'from-purple-400 to-pink-500' },
  { name: 'Wildlife', icon: PawPrint, color: 'from-lime-400 to-green-600' },
  { name: 'Relaxation', icon: Sun, color: 'from-yellow-400 to-orange-400' },
  { name: 'Food', icon: Utensils, color: 'from-rose-400 to-red-500' },
];

const BUDGETS: PlannerInput['budget'][] = ['Budget', 'Mid-range', 'Luxury'];

export default function PlannerPage() {
  return (
    <AuthGate>
      <Planner />
    </AuthGate>
  );
}

function Planner() {
  const router = useRouter();
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const inFiveDays = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);

  const [form, setForm] = useState<PlannerInput>({
    destination: 'Sri Lanka',
    startDate: today,
    endDate: inFiveDays,
    budget: 'Mid-range',
    travelers: 2,
    vibes: ['Nature', 'Adventure'],
    notes: '',
  });
  const [busy, setBusy] = useState(false);

  const toggleVibe = (v: Vibe) => {
    setForm(f => ({
      ...f,
      vibes: f.vibes.includes(v) ? f.vibes.filter(x => x !== v) : [...f.vibes, v],
    }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    if (form.vibes.length === 0) {
      toast.error('Pick at least one travel vibe');
      return;
    }
    setBusy(true);
    const id = toast.loading('AI is crafting your itinerary…');
    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { itinerary } = await res.json();
      const tripId = await saveTrip(user.uid, form, itinerary);
      toast.success('Itinerary ready!', { id });
      router.push(`/itinerary/${tripId}`);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Something went wrong', { id });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Plan your trip</h1>
        <p className="text-slate-500 mt-1">
          Tell us your vibe — AI handles the rest, including route optimisation.
        </p>
      </div>

      <form onSubmit={submit} className="card p-6 md:p-8 space-y-7">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label flex items-center gap-2"><MapPin className="h-4 w-4" /> Destination</label>
            <input
              list="sl-destinations"
              required
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
              className="input"
              placeholder="Anywhere in Sri Lanka"
            />
            <datalist id="sl-destinations">
              {SRI_LANKA_DESTINATIONS.map(d => <option key={d.id} value={d.name} />)}
              <option value="Sri Lanka" />
            </datalist>
          </div>
          <div>
            <label className="label flex items-center gap-2"><Users className="h-4 w-4" /> Travelers</label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={form.travelers}
              onChange={e => setForm({ ...form, travelers: parseInt(e.target.value) || 1 })}
              className="input"
            />
          </div>
          <div>
            <label className="label flex items-center gap-2"><Calendar className="h-4 w-4" /> Start date</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label flex items-center gap-2"><Calendar className="h-4 w-4" /> End date</label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="label flex items-center gap-2"><Wallet className="h-4 w-4" /> Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {BUDGETS.map(b => (
              <button
                type="button"
                key={b}
                onClick={() => setForm({ ...form, budget: b })}
                className={`px-4 py-2.5 rounded-xl border-2 font-medium transition ${
                  form.budget === b
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Travel vibe (pick all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {VIBES.map(v => {
              const active = form.vibes.includes(v.name);
              return (
                <button
                  type="button"
                  key={v.name}
                  onClick={() => toggleVibe(v.name)}
                  className={`relative overflow-hidden rounded-xl p-3 text-left transition ${
                    active
                      ? `bg-gradient-to-br ${v.color} text-white shadow-lg`
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <v.icon className="h-5 w-5 mb-1.5" />
                  <span className="text-sm font-medium">{v.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">Extra notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Any preferences, dietary needs, must-see places…"
            rows={3}
            className="input resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full !py-3.5 text-base"
        >
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" /> Generate AI Itinerary
            </>
          )}
        </button>
      </form>
    </div>
  );
}
