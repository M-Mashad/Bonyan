import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from './config';

const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);

export const auth: Auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export const db = getFirestore(app);
