import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Destination } from "./srilanka";

const COLL = "destinations";

function mapDestination(
  id: string,
  data: Omit<Destination, "id">,
): Destination {
  return { ...data, id };
}

export async function fetchAllDestinations(): Promise<Destination[]> {
  const snap = await getDocs(query(collection(db, COLL), orderBy("name")));
  return snap.docs.map((d) =>
    mapDestination(d.id, d.data() as Omit<Destination, "id">),
  );
}

export function subscribeAllDestinations(
  onNext: (destinations: Destination[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, COLL), orderBy("name")),
    (snap) => {
      onNext(
        snap.docs.map((d) =>
          mapDestination(d.id, d.data() as Omit<Destination, "id">),
        ),
      );
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function fetchDestination(
  id: string,
): Promise<Destination | null> {
  const snap = await getDoc(doc(db, COLL, id));
  if (!snap.exists()) return null;
  return mapDestination(snap.id, snap.data() as Omit<Destination, "id">);
}
