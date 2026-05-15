import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { Itinerary, PlannerInput, Trip, UserProfile } from './types';

const TRIPS = 'trips';
const USERS = 'users';

export async function saveTrip(
  userId: string,
  input: PlannerInput,
  itinerary: Itinerary,
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(collection(db, TRIPS), {
    userId,
    input,
    itinerary,
    photos: [],
    coverImage: '',
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function getTrip(id: string): Promise<Trip | null> {
  const snap = await getDoc(doc(db, TRIPS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Trip, 'id'>) };
}

export async function listUserTrips(userId: string): Promise<Trip[]> {
  const q = query(collection(db, TRIPS), where('userId', '==', userId));
  const snap = await getDocs(q);
  const trips = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Trip, 'id'>) }));
  return trips.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function deleteTrip(id: string): Promise<void> {
  await deleteDoc(doc(db, TRIPS, id));
}

export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string,
): Promise<UserProfile> {
  const r = doc(db, USERS, uid);
  const snap = await getDoc(r);
  if (snap.exists()) return snap.data() as UserProfile;
  const profile: UserProfile = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: photoURL || '',
    preferences: { darkMode: false, pushNotifications: true, favoriteVibes: [] },
    createdAt: Date.now(),
  };
  await setDoc(r, profile);
  return profile;
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, USERS, uid), patch as Record<string, unknown>);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
