import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTrip } from '@/lib/trips';
import { Trip } from '@/lib/types';

function openMaps(lat: number, lng: number, label?: string) {
  const q = encodeURIComponent(label ? `${label} (${lat},${lng})` : `${lat},${lng}`);
  const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
  Linking.openURL(url).catch(() => Alert.alert('Unable to open Maps'));
}

export default function MapScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    getTrip(String(id)).then(setTrip);
  }, [id]);

  const activities = trip ? trip.itinerary.days.flatMap(d => d.activities) : [];

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-4">
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => router.back()}
          className="flex-1 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 items-center"
        >
          <Text className="font-semibold">Back</Text>
        </Pressable>
      </View>

      <Text className="font-bold text-2xl">Map</Text>
      <Text className="text-slate-500">
        Open each stop in your Maps app.
      </Text>

      <View className="gap-3">
        {activities.map((a, i) => (
          <Pressable
            key={`${a.title}-${i}`}
            onPress={() => {
              if (a.lat == null || a.lng == null) {
                Alert.alert('Missing coordinates', 'This activity has no map coordinates.');
                return;
              }
              openMaps(a.lat, a.lng, a.title);
            }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
          >
            <Text className="font-semibold">{a.time} · {a.title}</Text>
            <Text className="text-slate-500 mt-1" numberOfLines={1}>{a.location}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
