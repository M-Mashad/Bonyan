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

// Group-facing label per account (uid -> anonymous label). Used anywhere the
// app shows another member's activity — real names are never shown outside
// a person's own screen, to keep the focus on the deed rather than the doer.
export const GROUP_LABELS: Record<string, string> = {
  KS6YYBBkh5Q2crDxDuOnF2nAD7c2: 'Brother 1',
  '0li36z2iy4g2nudPdcMJDwVyrCn2': 'Brother 2',
  b9bqcnpa9adHw5iCExsxzmJG7Ok2: 'Brother 3',
  E7PE7tiEsEby8UI19TJDv2QWhzu2: 'Brother 4',
  tcKVm3o0j0MAEJ4Y36AdwIzWx5h2: 'Brother 5',
};
