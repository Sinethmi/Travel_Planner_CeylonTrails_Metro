import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { PlannerInput, Vibe } from '@/lib/types';
import { generateItinerary } from '@/lib/gemini';
import { saveTrip } from '@/lib/trips';
import { SRI_LANKA_DESTINATIONS } from '@/lib/srilanka';

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

const BUDGETS: PlannerInput['budget'][] = ['Budget', 'Mid-range', 'Luxury'];

export default function PlannerScreen() {
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

  const submit = async () => {
    if (!user) return;
    if (new Date(form.endDate) < new Date(form.startDate)) {
      Alert.alert('Invalid dates', 'End date must be after start date');
      return;
    }
    if (form.vibes.length === 0) {
      Alert.alert('Pick a vibe', 'Select at least one travel vibe');
      return;
    }

    setBusy(true);
    try {
      const itinerary = await generateItinerary(form);
      const tripId = await saveTrip(user.uid, form, itinerary);
      router.push(`/itinerary/${tripId}`);
    } catch (e) {
      Alert.alert('Generation failed', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-5">
      <View>
        <Text className="font-bold text-2xl">Plan your trip</Text>
        <Text className="text-slate-500 mt-1">Tell us your vibe — AI handles the rest.</Text>
      </View>

      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 gap-4">
        <View>
          <Text className="text-xs text-slate-500 mb-2">Destination</Text>
          <TextInput
            value={form.destination}
            onChangeText={t => setForm({ ...form, destination: t })}
            placeholder="Anywhere in Sri Lanka"
            className="border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3"
          />
          <Text className="text-[11px] text-slate-400 mt-1">
            Tip: try {SRI_LANKA_DESTINATIONS[0]?.name}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-xs text-slate-500 mb-2">Start date</Text>
            <TextInput
              value={form.startDate}
              onChangeText={t => setForm({ ...form, startDate: t })}
              placeholder="YYYY-MM-DD"
              className="border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-slate-500 mb-2">End date</Text>
            <TextInput
              value={form.endDate}
              onChangeText={t => setForm({ ...form, endDate: t })}
              placeholder="YYYY-MM-DD"
              className="border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3"
            />
          </View>
        </View>

        <View>
          <Text className="text-xs text-slate-500 mb-2">Travelers</Text>
          <TextInput
            value={String(form.travelers)}
            onChangeText={t => setForm({ ...form, travelers: Math.max(1, parseInt(t || '1', 10) || 1) })}
            keyboardType="number-pad"
            className="border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3"
          />
        </View>

        <View>
          <Text className="text-xs text-slate-500 mb-2">Budget</Text>
          <View className="flex-row gap-2">
            {BUDGETS.map(b => {
              const active = form.budget === b;
              return (
                <Pressable
                  key={b}
                  onPress={() => setForm({ ...form, budget: b })}
                  className={`flex-1 rounded-2xl border-2 px-3 py-2.5 items-center ${
                    active
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Text className={`font-semibold ${active ? 'text-brand-700 dark:text-brand-200' : ''}`}>{b}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="text-xs text-slate-500 mb-2">Travel vibe (pick all that apply)</Text>
          <View className="flex-row flex-wrap gap-2">
            {ALL_VIBES.map(v => {
              const active = form.vibes.includes(v);
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

        <View>
          <Text className="text-xs text-slate-500 mb-2">Extra notes (optional)</Text>
          <TextInput
            value={form.notes}
            onChangeText={t => setForm({ ...form, notes: t })}
            placeholder="Any preferences, dietary needs, must-see places…"
            multiline
            className="border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 min-h-[90px]"
          />
        </View>

        <Pressable
          onPress={submit}
          disabled={busy}
          className="bg-brand-500 rounded-2xl py-3.5 items-center"
        >
          <Text className="text-white font-semibold text-base">
            {busy ? 'Generating…' : 'Generate AI Itinerary'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
