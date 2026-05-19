import { type FirebaseApp } from "firebase/app";
import { type Auth } from "firebase/auth";
import { type Firestore } from "firebase/firestore";
import { type FirebaseStorage } from "firebase/storage";
export type FirebaseClientConfig = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
};
export declare function getFirebaseClientConfig(): FirebaseClientConfig;
export declare function getFirebaseApp(config?: FirebaseClientConfig): FirebaseApp;
export declare const app: FirebaseApp;
export declare const auth: Auth;
export declare const db: Firestore;
export declare const storage: FirebaseStorage;
export default app;
//# sourceMappingURL=index.d.ts.map