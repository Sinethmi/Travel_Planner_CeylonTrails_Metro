'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getOrCreateUserProfile, getUserProfile, updateUserProfile } from '@/lib/trips';
import { UserProfile } from '@/lib/types';

interface AuthCtx {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfilePatch: (patch: Partial<UserProfile>) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const p = await getOrCreateUserProfile(
          u.uid,
          u.email || '',
          u.displayName || undefined,
          u.photoURL || undefined,
        );
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const value: AuthCtx = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      signUp: async (email, password, name) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        await getOrCreateUserProfile(cred.user.uid, email, name);
      },
      signInGoogle: async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
      },
      signOutUser: async () => {
        await signOut(auth);
      },
      refreshProfile: async () => {
        if (user) setProfile(await getUserProfile(user.uid));
      },
      setProfilePatch: async patch => {
        if (!user) return;
        await updateUserProfile(user.uid, patch);
        setProfile(p => (p ? { ...p, ...patch } : p));
      },
    }),
    [user, profile, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}
