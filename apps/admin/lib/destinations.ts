import { adminDb } from './firebase-admin';
import { Destination } from './types';

const COLL = 'destinations';

export async function listDestinations(): Promise<Destination[]> {
  const snap = await adminDb.collection(COLL).orderBy('name').get();
  return snap.docs.map(d => ({ ...(d.data() as Omit<Destination, 'id'>), id: d.id }));
}

export async function upsertDestination(data: Destination): Promise<void> {
  const { id, ...rest } = data;
  await adminDb.collection(COLL).doc(id).set(rest);
}

export async function updateDestination(id: string, data: Partial<Omit<Destination, 'id'>>): Promise<void> {
  await adminDb.collection(COLL).doc(id).update(data);
}

export async function deleteDestination(id: string): Promise<void> {
  await adminDb.collection(COLL).doc(id).delete();
}
