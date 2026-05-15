import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WeatherWidget from '@/components/WeatherWidget';
import { deleteTrip, getTrip } from '@/lib/trips';
import { Trip } from '@/lib/types';
import { haversineKm } from '@/lib/srilanka';

export default function ItineraryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    setLoading(true);
    getTrip(String(id)).then(t => {
      setTrip(t);
      setLoading(false);
    });
  }, [id]);

  const day = trip?.itinerary.days[activeDay];
  const firstActivity = day?.activities?.[0];

  const allActivitiesCount = useMemo(
    () => (trip ? trip.itinerary.days.reduce((n, d) => n + d.activities.length, 0) : 0),
    [trip],
  );

  const remove = () => {
    Alert.alert('Delete this trip?', 'Delete permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTrip(String(id));
          router.replace('/trips');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-5">
        <Text className="text-slate-500">Loading…</Text>
      </View>
    );
  }

  if (!trip || !day) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-5 gap-4">
        <Text className="font-bold text-xl">Trip not found</Text>
        <Pressable
          onPress={() => router.replace('/trips')}
          className="bg-brand-500 rounded-2xl py-3 items-center"
        >
          <Text className="text-white font-semibold">Back to trips</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-5">
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => router.back()}
          className="flex-1 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 items-center"
        >
          <Text className="font-semibold">Back</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/map/${trip.id}`)}
          className="flex-1 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 items-center"
        >
          <Text className="font-semibold">Full map</Text>
        </Pressable>
        <Pressable
          onPress={remove}
          className="px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 py-2.5"
        >
          <Text className="text-red-600 font-semibold">Delete</Text>
        </Pressable>
      </View>

      <View className="rounded-3xl overflow-hidden bg-brand-500 p-5">
        <Text className="text-white font-bold text-2xl">{trip.itinerary.title}</Text>
        <Text className="text-white/85 mt-2">{trip.itinerary.summary}</Text>
        <Text className="text-white/85 mt-3 text-xs">
          {trip.input.startDate} → {trip.input.endDate} · {trip.input.budget} · {trip.itinerary.totalBudget}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        <View className="flex-row gap-2">
          {trip.itinerary.days.map((d, i) => {
            const active = i === activeDay;
            return (
              <Pressable
                key={d.day}
                onPress={() => setActiveDay(i)}
                className={`px-4 py-2.5 rounded-2xl border-2 ${
                  active
                    ? 'bg-brand-500 border-brand-500'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <Text className={`${active ? 'text-white font-semibold' : 'font-semibold'}`}>
                  Day {d.day}
                </Text>
                <Text className={`${active ? 'text-white/80' : 'text-slate-500'} text-[10px]`}>{d.date}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {firstActivity?.lat != null && firstActivity?.lng != null ? (
        <WeatherWidget lat={firstActivity.lat} lng={firstActivity.lng} />
      ) : null}

      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 gap-4">
        <View>
          <Text className="text-slate-500 text-xs">{day.date}</Text>
          <Text className="font-bold text-xl">Day {day.day} — {day.theme}</Text>
          <Text className="text-slate-500 mt-1">{day.activities.length} activities</Text>
        </View>

        <View className="gap-3">
          {day.activities.map((a, i) => {
            const next = day.activities[i + 1];
            const distance =
              next && a.lat != null && a.lng != null && next.lat != null && next.lng != null
                ? haversineKm({ lat: a.lat, lng: a.lng }, { lat: next.lat, lng: next.lng })
                : null;

            return (
              <View key={`${a.title}-${i}`} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                <View className="flex-row justify-between gap-3">
                  <Text className="font-semibold flex-1" numberOfLines={2}>{i + 1}. {a.title}</Text>
                  <Text className="text-slate-500 text-xs">{a.time}</Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-300 mt-2">{a.description}</Text>
                <Text className="text-slate-500 text-xs mt-2">{a.location}</Text>
                {a.tip ? (
                  <View className="mt-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
                    <Text className="text-amber-800 dark:text-amber-200 text-xs">Tip: {a.tip}</Text>
                  </View>
                ) : null}
                {distance != null ? (
                  <Text className="text-slate-400 text-[11px] mt-2">~{distance.toFixed(1)} km to next stop</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <Text className="font-bold text-lg">Trip stats</Text>
        <Text className="text-slate-500 mt-2">Days: {trip.itinerary.days.length}</Text>
        <Text className="text-slate-500 mt-1">Activities: {allActivitiesCount}</Text>
        <Text className="text-slate-500 mt-1">Travelers: {trip.input.travelers}</Text>
      </View>
    </ScrollView>
  );
}
