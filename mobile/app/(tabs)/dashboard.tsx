import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import DestinationCard from '@/components/DestinationCard';
import WeatherWidget from '@/components/WeatherWidget';
import { searchDestinations, SRI_LANKA_DESTINATIONS } from '@/lib/srilanka';

export default function DashboardScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const featured = SRI_LANKA_DESTINATIONS.slice(0, 8);

  const [q, setQ] = useState('');
  const results = useMemo(() => searchDestinations(q).slice(0, 8), [q]);

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-6">
      <LinearGradient
        colors={['#2a9d5d', '#174f33']}
        className="rounded-3xl overflow-hidden p-6"
      >
        <Text className="text-white/80 text-xs uppercase tracking-wider">
          {profile?.displayName ? `Welcome back, ${profile.displayName}` : 'Welcome'}
        </Text>
        <Text className="text-white font-bold text-3xl mt-2">
          Where will Sri Lanka take you next?
        </Text>
        <Text className="text-white/80 mt-2">
          Tell our AI your vibe and get a day-by-day plan.
        </Text>
        <View className="flex-row gap-3 mt-5">
          <Pressable
            className="flex-1 bg-white rounded-2xl py-3 items-center flex-row justify-center gap-2"
            onPress={() => router.push('/planner')}
          >
            <Sparkles color="#1d7d49" size={18} />
            <Text className="text-brand-700 font-semibold">Plan with AI</Text>
          </Pressable>
          <Pressable
            className="px-4 rounded-2xl border border-white/25 py-3 items-center flex-row justify-center gap-2"
            onPress={() => router.push('/trips')}
          >
            <Text className="text-white font-semibold">My Trips</Text>
            <ArrowRight color="white" size={18} />
          </Pressable>
        </View>
      </LinearGradient>

      <View className="gap-3">
        <Text className="font-bold text-lg">Smart search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search destinations, regions, vibes…"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3"
        />
        {q.trim().length > 0 && (
          <View className="gap-3">
            <Text className="text-slate-500 text-xs">Results</Text>
            <View className="flex-row flex-wrap gap-3">
              {results.map(d => (
                <View key={d.id} className="w-[48%]">
                  <DestinationCard d={d} />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className="gap-3">
        <Text className="font-bold text-lg">Colombo right now</Text>
        <WeatherWidget lat={6.9271} lng={79.8612} />
      </View>

      <View className="gap-3">
        <Text className="font-bold text-lg">Featured destinations</Text>
        <View className="flex-row flex-wrap gap-3">
          {featured.map(d => (
            <View key={d.id} className="w-[48%]">
              <DestinationCard d={d} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
