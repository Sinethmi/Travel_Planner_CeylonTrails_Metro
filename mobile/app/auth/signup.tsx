import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password');
      return;
    }
    setBusy(true);
    try {
      await signUp(email.trim(), password, name.trim());
      router.replace('/dashboard');
    } catch (e) {
      Alert.alert('Sign up failed', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <LinearGradient
        colors={['#2a9d5d', '#174f33']}
        className="flex-1 px-6 justify-center"
      >
        <View className="items-center mb-8">
          <View className="h-14 w-14 rounded-2xl bg-white/15 items-center justify-center">
            <Compass color="white" size={26} />
          </View>
          <Text className="text-white font-bold text-3xl mt-3">Create account</Text>
          <Text className="text-white/80 mt-1">Start planning your trip</Text>
        </View>

        <View className="bg-white/10 border border-white/20 rounded-3xl p-5">
          <Text className="text-white/90 text-xs mb-2">Name (optional)</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="rgba(255,255,255,0.5)"
            className="bg-white/10 text-white rounded-2xl px-4 py-3"
          />

          <Text className="text-white/90 text-xs mt-4 mb-2">Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="rgba(255,255,255,0.5)"
            className="bg-white/10 text-white rounded-2xl px-4 py-3"
          />

          <Text className="text-white/90 text-xs mt-4 mb-2">Password</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.5)"
            className="bg-white/10 text-white rounded-2xl px-4 py-3"
          />

          <Pressable
            onPress={submit}
            disabled={busy}
            className="mt-5 bg-white rounded-2xl py-3 items-center"
          >
            <Text className="text-brand-700 font-semibold">
              {busy ? 'Creating…' : 'Sign up'}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-4">
            <Text className="text-white/80">Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <Pressable>
                <Text className="text-white font-semibold">Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
