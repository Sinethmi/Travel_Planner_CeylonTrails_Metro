import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Trip, Itinerary, PlannerInput, UserProfile } from './types';

const TRIPS = 'trips';
const USERS = 'users';

function normalizeUserProfile(profile: Partial<UserProfile>): UserProfile {
  return {
    ...(profile as Omit<UserProfile, 'role'>),
    role: profile.role || 'user',
  };
}

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

export async function uploadTripPhoto(
  tripId: string,
  userId: string,
  file: File,
): Promise<string> {
  const path = `trips/${userId}/${tripId}/${Date.now()}_${file.name}`;
  const r = ref(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  const tripRef = doc(db, TRIPS, tripId);
  const trip = await getDoc(tripRef);
  const photos = (trip.data()?.photos as string[]) || [];
  await updateDoc(tripRef, { photos: [...photos, url], updatedAt: Date.now() });
  return url;
}

export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string,
): Promise<UserProfile> {
  const r = doc(db, USERS, uid);
  const snap = await getDoc(r);
  if (snap.exists()) {
    const data = snap.data() as Partial<UserProfile>;
    if (!data.role) {
      try {
        await updateDoc(r, { role: 'user' });
      } catch {
        // Best-effort backfill; keep going.
      }
    }
    return normalizeUserProfile(data);
  }
  const profile: UserProfile = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: photoURL || '',
    role: 'user',
    preferences: { darkMode: false, pushNotifications: true, favoriteVibes: [] },
    createdAt: Date.now(),
  };
  await import('firebase/firestore').then(({ setDoc }) => setDoc(r, profile));
  return profile;
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<UserProfile>,
): Promise<void> {
  await updateDoc(doc(db, USERS, uid), patch as Record<string, unknown>);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<UserProfile>;
  if (!data.role) {
    try {
      await updateDoc(doc(db, USERS, uid), { role: 'user' });
    } catch {
      // Best-effort backfill; keep going.
    }
  }
  return normalizeUserProfile(data);
}
