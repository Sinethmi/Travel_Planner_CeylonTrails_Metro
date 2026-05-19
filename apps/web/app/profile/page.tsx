'use client';

import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { listUserTrips } from '@/lib/trips';
import { Vibe } from '@/lib/types';
import {
  Bell,
  LogOut,
  Mail,
  Moon,
  Sparkles,
  User as UserIcon,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ALL_VIBES: Vibe[] = [
  'Adventure', 'Nature', 'History', 'Beach', 'Cultural', 'Wildlife', 'Relaxation', 'Food',
];

export default function ProfilePage() {
  return (
    <AuthGate>
      <Profile />
    </AuthGate>
  );
}

function Profile() {
  const { user, profile, signOutUser, setProfilePatch } = useAuth();
  const { dark, setDark } = useTheme();
  const router = useRouter();
  const [tripsCount, setTripsCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) listUserTrips(user.uid).then(t => setTripsCount(t.length));
  }, [user]);

  if (!profile) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const toggleVibe = async (v: Vibe) => {
    const cur = profile.preferences.favoriteVibes;
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
    setSaving(true);
    await setProfilePatch({
      preferences: { ...profile.preferences, favoriteVibes: next },
    });
    setSaving(false);
  };

  const toggleDark = async (v: boolean) => {
    setDark(v);
    await setProfilePatch({
      preferences: { ...profile.preferences, darkMode: v },
    });
  };

  const togglePush = async (v: boolean) => {
    await setProfilePatch({
      preferences: { ...profile.preferences, pushNotifications: v },
    });
    toast.success(v ? 'Push notifications on' : 'Push notifications off');
  };

  const logout = async () => {
    await signOutUser();
    router.push('/auth/login');
  };

  const initials = (profile.displayName || profile.email || '?')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <header className="card p-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-display text-2xl font-bold">
          {initials}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold">
            {profile.displayName || 'Traveler'}
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {profile.email}
          </p>
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Sparkles} label="Trips planned" value={tripsCount} />
        <Stat icon={UserIcon} label="Joined" value={new Date(profile.createdAt).toLocaleDateString()} />
        <Stat icon={Bell} label="Notifications" value={profile.preferences.pushNotifications ? 'On' : 'Off'} />
      </div>

      <section className="card p-6 space-y-3">
        <h2 className="font-display text-lg font-bold">Preferences</h2>

        <ToggleRow
          icon={Moon}
          label="Dark mode"
          desc="Switch to a softer dark theme"
          value={dark}
          onChange={toggleDark}
        />
        <ToggleRow
          icon={Bell}
          label="Push notifications"
          desc="Weather + trip updates"
          value={profile.preferences.pushNotifications}
          onChange={togglePush}
        />

        <div>
          <p className="font-medium text-sm mt-3 mb-2">Favourite vibes {saving && <span className="text-xs text-slate-400 ml-2">saving…</span>}</p>
          <div className="flex flex-wrap gap-2">
            {ALL_VIBES.map(v => {
              const active = profile.preferences.favoriteVibes.includes(v);
              return (
                <button
                  key={v}
                  onClick={() => toggleVibe(v)}
                  className={`px-3 py-1.5 rounded-full text-sm border-2 transition ${
                    active
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <button onClick={logout} className="btn-ghost w-full text-red-500">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <Icon className="h-5 w-5 text-brand-500" />
      <p className="text-xs uppercase tracking-wider text-slate-500 mt-2">{label}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  value,
  onChange,
}: {
  icon: typeof UserIcon;
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-slate-500 mt-0.5" />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
