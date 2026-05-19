import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './types';

const USERS = 'users';

export async function getAdminProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<UserProfile>;
  return { ...(data as UserProfile), role: data.role || 'user' };
}

export async function listAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, USERS));
  return snap.docs.map(d => {
    const data = d.data() as Partial<UserProfile>;
    return { ...(data as UserProfile), uid: d.id, role: data.role || 'user' };
  });
}

export async function updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { role });
}
