import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const env = (key: string) => (process.env as Record<string, string | undefined>)[key];

const firebaseConfig = {
  apiKey: env('EXPO_PUBLIC_FIREBASE_API_KEY') ?? env('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: env('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN') ?? env('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: env('EXPO_PUBLIC_FIREBASE_PROJECT_ID') ?? env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: env('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET') ?? env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId:
    env('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') ?? env('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('EXPO_PUBLIC_FIREBASE_APP_ID') ?? env('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId:
    env('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID') ?? env('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
