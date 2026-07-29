// Fill this in with the config object from your Firebase project.
// Firebase console > Project settings > General > Your apps > Web app > SDK setup and configuration
export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// The fixed list of friends. Whoever opens the app picks their name from
// this list — there's no login, so keep this to people you trust.
export const FRIEND_NAMES: string[] = [
  'Friend 1',
  'Friend 2',
  'Friend 3',
  'Friend 4',
  'Friend 5',
];
