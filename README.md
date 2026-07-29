# Bonyan — Habit Tracker

A tiny Expo app for a fixed group of friends to check off daily habits.
Each person signs in with a password-protected account and checks/unchecks
habits for today. Everything is stored in Firebase (Firestore) — each
person can only read and write their own data, no one else's.

## How it works

- The app shows a fixed list of habits (edit `src/habits.ts`).
- On first open, you tap your name, enter your password, and you're signed
  in from then on (Firebase remembers the session on the device).
- Checking/unchecking a habit writes straight to Firestore, under
  `users/<your account>/habitLogs/<date>`.
- Firestore security rules only let an account read/write documents under
  its own `users/<uid>` — one friend can never see or edit another's data
  through the app. You (the project owner) can still see everyone's data
  in the Firebase console, since console access isn't subject to those
  rules.

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
       match /users/{uid}/habitLogs/{date} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

   Tap **Publish**.

### 3. Enable email/password sign-in

1. In the left menu, tap **Build > Authentication**.
2. Tap **Get started**, then in the **Sign-in method** tab, enable
   **Email/Password**.

### 4. Create one account per friend

1. Still in **Authentication**, go to the **Users** tab.
2. Tap **Add user** once per friend. For the email, it doesn't need to be
   real — something like `alice@bonyan.app` is fine, it's just a login
   handle. Pick a password for each (tell each friend theirs).
3. Make sure the emails you use here exactly match `FRIEND_ACCOUNTS` in
   `src/config.ts` (see step 6).

### 5. Register a Web app to get your config

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

### 6. Set the friend list and habits

- `src/config.ts` — replace `FRIEND_ACCOUNTS` with your friends' names and
  the exact emails you used in step 4.
- `src/habits.ts` — replace `HABITS` with your actual habit list.

## Running the app

```
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (free, iOS/Android) to run it on
your phone — no build step needed.

## Viewing the data

Firebase console > **Firestore Database** > **Data** tab > `users`
collection. Each friend has a document named after their account's uid,
containing a `habitLogs` subcollection with one document per date and a
`habits` map field of `true`/`false` per habit. This works fine from your
phone's browser, and as the project owner you can see all of it even
though the app itself can't.

## Security notes

- Each friend needs their password to sign in and check things off as
  themselves — no one can act as someone else through the app.
- Firestore rules restrict every account to its own `users/<uid>` subtree,
  so the app can never read or write another account's data.
- There's no self-serve "forgot password" flow. If someone forgets theirs,
  reset it for them in Firebase console > Authentication > Users.
