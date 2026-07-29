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

// The fixed list of friends. Each one needs a matching account created in
// Firebase console > Authentication > Users (email + a password you set).
// The email doesn't need to be real/reachable — it's just a login handle.
export const FRIEND_ACCOUNTS: { name: string; email: string }[] = [
  { name: 'Friend 1', email: 'friend1@bonyan.app' },
  { name: 'Friend 2', email: 'friend2@bonyan.app' },
  { name: 'Friend 3', email: 'friend3@bonyan.app' },
  { name: 'Friend 4', email: 'friend4@bonyan.app' },
  { name: 'Friend 5', email: 'friend5@bonyan.app' },
];
