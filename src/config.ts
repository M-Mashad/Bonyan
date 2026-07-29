export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCDTupJTcsAp5ylEugEPiVu5S66sgp-58Q',
  authDomain: 'bonyan-4c760.firebaseapp.com',
  projectId: 'bonyan-4c760',
  storageBucket: 'bonyan-4c760.firebasestorage.app',
  messagingSenderId: '318225577448',
  appId: '1:318225577448:web:231ea60cb28867ff6fa05d',
};

// The fixed list of friends. Each one has a matching account created in
// Firebase Authentication (email + password). The email isn't
// real/reachable — it's just a login handle.
export const FRIEND_ACCOUNTS: { name: string; email: string }[] = [
  { name: 'Mo Omar', email: 'moomar@bonyan.app' },
  { name: 'Asd', email: 'asd@bonyan.app' },
  { name: 'Treka', email: 'treka@bonyan.app' },
  { name: 'Shaddad', email: 'shaddad@bonyan.app' },
  { name: 'Hassan', email: 'hassan@bonyan.app' },
];
