import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { findDestination } from '@/lib/srilanka';

export default function AttractionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = findDestination(String(id));

  if (!d) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-5 gap-4">
        <Text className="font-bold text-xl">Attraction not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-brand-500 rounded-2xl py-3 items-center"
        >
          <Text className="text-white font-semibold">Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-5 gap-4">
      <Pressable
        onPress={() => router.back()}
        className="border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 items-center"
      >
        <Text className="font-semibold">Back</Text>
      </Pressable>

      <View className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Image source={{ uri: d.image }} className="w-full h-52" />
        <View className="p-5 gap-2">
          <Text className="font-bold text-2xl">{d.name}</Text>
          <Text className="text-slate-500">{d.region}</Text>
          <Text className="text-slate-700 dark:text-slate-200 mt-2">{d.description}</Text>
          <Text className="text-slate-500 text-xs mt-2">Rating: {d.rating}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/planner')}
        className="bg-brand-500 rounded-2xl py-3 items-center"
      >
        <Text className="text-white font-semibold">Plan a trip</Text>
      </Pressable>
    </ScrollView>
  );
}
