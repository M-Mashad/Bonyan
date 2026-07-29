export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCDTupJTcsAp5ylEugEPiVu5S66sgp-58Q',
  authDomain: 'bonyan-4c760.firebaseapp.com',
  projectId: 'bonyan-4c760',
  storageBucket: 'bonyan-4c760.firebasestorage.app',
  messagingSenderId: '318225577448',
  appId: '1:318225577448:web:231ea60cb28867ff6fa05d',
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
