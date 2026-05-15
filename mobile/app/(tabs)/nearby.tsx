import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { haversineKm, SRI_LANKA_DESTINATIONS } from '@/lib/srilanka';

type Cat = 'restaurant' | 'lodging' | 'gas_station' | 'tourist_attraction' | 'cafe' | 'park';

const CATS: { key: Cat; label: string }[] = [
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'lodging', label: 'Hotels' },
  { key: 'cafe', label: 'Cafés' },
  { key: 'gas_station', label: 'Rest stops' },
  { key: 'tourist_attraction', label: 'Attractions' },
  { key: 'park', label: 'Parks' },
];

export default function NearbyScreen() {
  const [center, setCenter] = useState({ lat: 6.9271, lng: 79.8612 });
  const [locationName, setLocationName] = useState('Colombo');
  const [cat, setCat] = useState<Cat>('restaurant');

  const fallback = useMemo(() => {
    return SRI_LANKA_DESTINATIONS
      .map(d => ({ ...d, distance: haversineKm(center, { lat: d.lat, lng: d.lng }) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }, [center]);

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-5">
      <View>
        <Text className="font-bold text-2xl">Nearby Finder</Text>
        <Text className="text-slate-500 mt-1">Around {locationName}</Text>
      </View>

      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <Text className="text-xs uppercase tracking-wider text-slate-500 mb-2">Search around</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <View className="flex-row gap-2">
            {SRI_LANKA_DESTINATIONS.map(d => (
              <Pressable
                key={d.id}
                onPress={() => {
                  setCenter({ lat: d.lat, lng: d.lng });
                  setLocationName(d.name);
                }}
                className={`px-3 py-1.5 rounded-full border ${
                  locationName === d.name
                    ? 'bg-brand-500 border-brand-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Text className={`${locationName === d.name ? 'text-white' : ''}`}>{d.name}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {CATS.map(c => {
          const active = cat === c.key;
          return (
            <Pressable
              key={c.key}
              onPress={() => setCat(c.key)}
              className={`px-3 py-2 rounded-2xl border ${
                active ? 'bg-brand-500 border-brand-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Text className={`${active ? 'text-white font-semibold' : ''}`}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <Text className="font-semibold">Live Places not enabled on mobile</Text>
        <Text className="text-slate-500 mt-1">
          This screen shows the nearest Sri Lankan hubs as a fallback.
        </Text>
        <View className="gap-2 mt-4">
          {fallback.map(f => (
            <View
              key={f.id}
              className="flex-row justify-between bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-3"
            >
              <Text className="font-medium" numberOfLines={1}>{f.name}</Text>
              <Text className="text-slate-500">{f.distance.toFixed(1)} km</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
