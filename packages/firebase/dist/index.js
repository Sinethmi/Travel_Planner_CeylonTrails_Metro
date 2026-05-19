import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// IMPORTANT:
// - In Next.js, only *direct* `process.env.NEXT_PUBLIC_*` property reads are inlined
//   into client bundles. Dynamic access like `process.env[key]` becomes undefined.
// - Expo exposes `EXPO_PUBLIC_*` vars to the JS runtime.
// So we explicitly read both to support web + mobile from one shared package.
const EXPO_PUBLIC_FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const EXPO_PUBLIC_FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const EXPO_PUBLIC_FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
const EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;
const NEXT_PUBLIC_FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const NEXT_PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const NEXT_PUBLIC_FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
function required(expoKey, nextKey, expoValue, nextValue) {
    const value = expoValue ?? nextValue;
    if (!value) {
        throw new Error(`Missing Firebase env var: ${nextKey} (web) or ${expoKey} (mobile). ` +
            `Set it in apps/web/.env.local (NEXT_PUBLIC_*) and/or apps/mobile/.env.local (EXPO_PUBLIC_*).`);
    }
    return value;
}
function pick(expoKey, nextKey, expoValue, nextValue) {
    return expoValue ?? nextValue ?? required(expoKey, nextKey, expoValue, nextValue);
}
export function getFirebaseClientConfig() {
    return {
        apiKey: pick("EXPO_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY", EXPO_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_API_KEY),
        authDomain: pick("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
        projectId: pick("EXPO_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", EXPO_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_PROJECT_ID),
        storageBucket: pick("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
        messagingSenderId: pick("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
        appId: pick("EXPO_PUBLIC_FIREBASE_APP_ID", "NEXT_PUBLIC_FIREBASE_APP_ID", EXPO_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_APP_ID),
        measurementId: EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
}
export function getFirebaseApp(config = getFirebaseClientConfig()) {
    return getApps().length ? getApp() : initializeApp(config);
}
export const app = getFirebaseApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
