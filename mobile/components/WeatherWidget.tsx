import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { getWeatherByCoords, WeatherResponse } from '@/lib/weather';

export default function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getWeatherByCoords(lat, lng)
      .then(d => {
        if (mounted) setData(d);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [lat, lng]);

  return (
    <View className="p-4 bg-white border rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <Text className="text-base font-semibold">Weather</Text>
      {loading ? (
        <View className="py-4">
          <ActivityIndicator />
        </View>
      ) : !data ? (
        <Text className="mt-2 text-slate-500">Unavailable</Text>
      ) : (
        <View className="mt-2">
          <Text className="text-slate-500">{data.name}</Text>
          <Text className="mt-1 text-3xl font-bold">{data.temp}°C</Text>
          <Text className="mt-1 capitalize text-slate-500">
            {data.description} · feels {data.feelsLike}C
          </Text>
        </View>
      )}
    </View>
  );
}
