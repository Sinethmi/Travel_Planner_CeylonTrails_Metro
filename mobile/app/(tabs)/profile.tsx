import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { listUserTrips } from '@/lib/trips';
import { Vibe } from '@/lib/types';

const ALL_VIBES: Vibe[] = [
  'Adventure',
  'Nature',
  'History',
  'Beach',
  'Cultural',
  'Wildlife',
  'Relaxation',
  'Food',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOutUser, setProfilePatch } = useAuth();
  const { dark, setDark } = useTheme();
  const [tripsCount, setTripsCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) listUserTrips(user.uid).then(t => setTripsCount(t.length));
  }, [user]);

  if (!profile) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-5">
        <Text className="text-slate-500">Loading…</Text>
      </View>
    );
  }

  const initials = (profile.displayName || profile.email || '?')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
  };

  const logout = async () => {
    await signOutUser();
    router.replace('/auth/login');
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-5">
      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex-row items-center gap-4">
        <View className="h-14 w-14 rounded-2xl bg-brand-500 items-center justify-center">
          <Text className="text-white font-bold text-xl">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-lg">{profile.displayName || 'Traveler'}</Text>
          <Text className="text-slate-500 mt-0.5" numberOfLines={1}>{profile.email}</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Stat label="Trips planned" value={tripsCount} />
        <Stat label="Joined" value={new Date(profile.createdAt).toLocaleDateString()} />
      </View>

      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 gap-4">
        <Text className="font-bold text-lg">Preferences</Text>

        <ToggleRow
          label="Dark mode"
          desc="Switch to a softer dark theme"
          value={dark}
          onChange={toggleDark}
        />

        <ToggleRow
          label="Push notifications"
          desc="Weather + trip updates"
          value={profile.preferences.pushNotifications}
          onChange={togglePush}
        />

        <View>
          <Text className="font-semibold">Favourite vibes</Text>
          <Text className="text-slate-500 text-xs mt-1">{saving ? 'saving…' : ' '}</Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {ALL_VIBES.map(v => {
              const active = profile.preferences.favoriteVibes.includes(v);
              return (
                <Pressable
                  key={v}
                  onPress={() => toggleVibe(v)}
                  className={`px-3 py-2 rounded-full border-2 ${
                    active
                      ? 'bg-brand-500 border-brand-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Text className={`${active ? 'text-white' : ''}`}>{v}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => {
          Alert.alert('Sign out?', 'You will be returned to the login screen.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign out', style: 'destructive', onPress: logout },
          ]);
        }}
        className="rounded-2xl bg-slate-100 dark:bg-slate-800 py-3 items-center"
      >
        <Text className="text-red-600 font-semibold">Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <Text className="text-xs uppercase tracking-wider text-slate-500">{label}</Text>
      <Text className="font-bold text-xl mt-1">{value}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="font-semibold">{label}</Text>
        <Text className="text-slate-500 text-xs mt-0.5">{desc}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
