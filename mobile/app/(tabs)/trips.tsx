import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { deleteTrip, listUserTrips } from '@/lib/trips';
import { Trip } from '@/lib/types';

export default function TripsScreen() {
  const router = useRouter();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const remove = (id: string) => {
    Alert.alert('Delete trip?', 'Delete this trip permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTrip(id);
          refresh();
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-4">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="font-bold text-2xl">My trips</Text>
          <Text className="text-slate-500 mt-1">Synced via Firestore</Text>
        </View>
        <Pressable
          onPress={() => router.push('/planner')}
          className="bg-brand-500 px-4 py-2.5 rounded-2xl"
        >
          <Text className="text-white font-semibold">New</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text className="text-slate-500">Loading…</Text>
      ) : trips.length === 0 ? (
        <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 items-center">
          <Text className="font-bold text-lg">No trips yet</Text>
          <Text className="text-slate-500 mt-1 text-center">Generate your first itinerary now.</Text>
          <Pressable
            onPress={() => router.push('/planner')}
            className="mt-4 bg-brand-500 px-5 py-3 rounded-2xl"
          >
            <Text className="text-white font-semibold">Plan a trip</Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          {trips.map(t => (
            <View
              key={t.id}
              className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <Pressable onPress={() => router.push(`/itinerary/${t.id}`)} className="p-4">
                <Text className="font-semibold" numberOfLines={2}>
                  {t.itinerary.title}
                </Text>
                <Text className="text-slate-500 text-xs mt-1" numberOfLines={1}>
                  {t.input.destination} · {t.input.startDate} → {t.input.endDate}
                </Text>
                <View className="flex-row flex-wrap gap-1 mt-2">
                  {t.input.vibes.slice(0, 3).map(v => (
                    <View key={v} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      <Text className="text-[10px] text-slate-600 dark:text-slate-300">{v}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
              <View className="flex-row gap-2 p-4 pt-0">
                <Pressable
                  onPress={() => router.push(`/itinerary/${t.id}`)}
                  className="flex-1 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 items-center"
                >
                  <Text className="font-semibold">Open</Text>
                </Pressable>
                <Pressable
                  onPress={() => remove(t.id)}
                  className="px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 py-2.5"
                >
                  <Text className="text-red-600 font-semibold">Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
