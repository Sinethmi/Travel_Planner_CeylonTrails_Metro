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
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAdminProfile } from '@/lib/admin';
import { UserProfile } from '@/lib/types';

interface AdminAuthCtx {
  user: User | null;
  adminProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const profile = await getAdminProfile(u.uid);
        setAdminProfile(profile);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const value: AdminAuthCtx = useMemo(
    () => ({
      user,
      adminProfile,
      loading,
      signIn: async (email, password) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await getAdminProfile(cred.user.uid);
        if (!profile) {
          await firebaseSignOut(auth);
          throw new Error('Access denied: account not found.');
        }
        if (profile.role !== 'admin') {
          await firebaseSignOut(auth);
          throw new Error('Access denied: this account does not have admin privileges.');
        }
        setAdminProfile(profile);
      },
      signOut: async () => {
        await firebaseSignOut(auth);
        setAdminProfile(null);
      },
    }),
    [user, adminProfile, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminAuth(): AdminAuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return c;
}
