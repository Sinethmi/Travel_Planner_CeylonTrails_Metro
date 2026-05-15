import { Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Destination } from '@/lib/srilanka';

export default function DestinationCard({ d }: { d: Destination }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/attraction/${d.id}`)}
      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <Image source={{ uri: d.image }} className="w-full h-28" />
      <View className="p-3">
        <Text className="font-semibold" numberOfLines={1}>
          {d.name}
        </Text>
        <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
          {d.region}
        </Text>
        <View className="flex-row flex-wrap gap-1 mt-2">
          {d.vibe.slice(0, 3).map(v => (
            <View
              key={v}
              className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <Text className="text-[10px] text-slate-600 dark:text-slate-300">
                {v}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
