# Bonyan — Habit Tracker

A tiny Expo app for a fixed group of friends to check off daily habits.
Everyone picks their name from a fixed list (no login) and checks/unchecks
habits for today. Everything is stored in Firebase (Firestore), with
real-time sync — a check on one phone shows up for everyone else instantly.

## How it works

- The app shows a fixed list of habits (edit `src/habits.ts`).
- On first open, you pick your name from a fixed list (edit `src/config.ts`)
  — it's remembered on the device after that, no login needed.
- Checking/unchecking a habit writes straight to Firestore, in a document
  keyed by date + name, with a field per habit.
- To see everyone's data, open the Firebase console's Firestore data
  viewer in your phone's browser — it shows a live table of every
  `date_name` document.

## Setup (all from your phone, no code)

### 1. Create the Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and sign in with the Google account you want to own this project.
2. Tap **Add project**, give it a name (e.g. "Bonyan"), and skip Google
   Analytics (not needed) — finish creating it.

### 2. Enable Firestore

1. In the left menu, tap **Build > Firestore Database**.
2. Tap **Create database**, pick a region close to you, and start in
   **production mode** (we'll paste in real rules next).
3. Once created, go to the **Rules** tab and replace the contents with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /habitLogs/{docId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   Tap **Publish**.

### 3. Enable anonymous sign-in

1. In the left menu, tap **Build > Authentication**.
2. Tap **Get started**, then in the **Sign-in method** tab, enable
   **Anonymous**.

   The app signs everyone in anonymously in the background — this is just
   what lets the security rule above tell "the app" apart from a random
   stranger. There's no visible login step for your friends.

### 4. Register a Web app to get your config

1. In the left menu, tap the gear icon > **Project settings**.
2. Under **Your apps**, tap the **`</>`** (Web) icon.
3. Give it a nickname (e.g. "Bonyan app"), skip Firebase Hosting, and
   register it.
4. You'll see a `firebaseConfig` object like:

   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```

   Send me that object (paste it in chat) and I'll drop it into
   `src/config.ts` for you — or paste it into `FIREBASE_CONFIG` in
   `src/config.ts` yourself if you're doing this part.

### 5. Set the friend list and habits

- `src/config.ts` — replace `FRIEND_NAMES` with your actual 5 names.
- `src/habits.ts` — replace `HABITS` with your actual habit list.

## Running the app

```
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (free, iOS/Android) to run it on
your phone — no build step needed.

## Viewing the data

Firebase console > **Firestore Database** > **Data** tab. Each document is
named `<date>_<name>` (e.g. `2026-07-29_Alice`) and has a `habits` map
field with `true`/`false` per habit. This works fine from your phone's
browser.

## Security notes

- Anyone who opens the app can pick any name from the list and check things
  off as that person — there's no real per-person authentication. Fine for
  a small group of trusted friends; don't use this pattern for anything
  sensitive.
- The Firestore rule allows any anonymously-authenticated client to read
  and write all `habitLogs` documents. That's intentionally permissive to
  keep setup simple — don't put anything private in this database.
