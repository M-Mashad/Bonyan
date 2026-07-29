# Bonyan

A tiny Expo app for a fixed group of friends to build Islamic habits
together — Fajr, Qiyam, and whatever else you add. Each person signs in
with a password-protected account and checks off habits for the day.
Individual check-ins stay private (no one can read or write another
account's day-by-day log), but for each habit the group sees a shared
**streak** and **today's participation** ("3 of 5 completed Fajr today",
with a full-house celebration when everyone has) — no names, no feed of
who-did-what, just where the group stands together. The point is the
deed, not who did it.

Live at: **https://m-mashad.github.io/Bonyan/**

## How it works

- The app shows a fixed list of habits (edit `src/habits.ts`).
- On first open, you tap your name, enter your password, and you're signed
  in from then on (Firebase remembers the session on the device).
- Checking/unchecking a habit writes straight to Firestore, under
  `users/<your account>/habitLogs/<date>`.
- Firestore security rules let any signed-in member **read** everyone's
  check-ins (needed to compute each habit's group streak and today's
  participation count), but **write** only your own — no one can fake
  someone else's check-in.
- Group-facing numbers are always aggregates (streaks, counts) — the app
  never shows or stores who specifically did or didn't complete a habit
  anywhere in the UI, by name or otherwise.

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
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == uid;
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
   handle. Pick a password for each (tell each friend theirs, or use the
   Profile tab's "Change password" once signed in).
3. Make sure the emails you use here exactly match `FRIEND_ACCOUNTS` in
   `src/config.ts` (see step 6).

### 5. Register a Web app to get your config

1. In the left menu, tap the gear icon > **Project settings**.
2. Under **Your apps**, tap the **`</>`** (Web) icon.
3. Give it a nickname (e.g. "Bonyan app"), skip Firebase Hosting, and
   register it.
4. You'll see a `firebaseConfig` object — send it to me (or paste it into
   `FIREBASE_CONFIG` in `src/config.ts` yourself).

### 6. Set the friend list and habits

- `src/config.ts` — `FRIEND_ACCOUNTS` (names + emails).
- `src/habits.ts` — replace `HABITS` with your actual habit list.

## Running the app

```
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (free, iOS/Android) to run it on
your phone — no build step needed. To publish an update to the live site,
export a web build (`npx expo export --platform web`) and deploy the
`dist/` folder to the `gh-pages` branch.

## Viewing the data

Firebase console > **Firestore Database** > **Data** tab > `users`
collection. Each friend has a document named after their account's uid,
containing a `habitLogs` subcollection with one document per date and a
`habits` map field of `true`/`false` per habit. This works fine from your
phone's browser.

## Security notes

- Each friend needs their password to sign in and check things off as
  themselves — no one can act as someone else through the app.
- Firestore write rules restrict every account to its own `users/<uid>`
  subtree. Read access is shared across signed-in members (needed for
  per-habit group streaks and participation counts) — the app itself
  never displays who specifically did or didn't complete a habit, but
  the raw per-account data is technically readable by any
  signed-in account, same trust level as everything else in this project.
- There's no self-serve "forgot password" flow if the Profile tab isn't
  reachable. Reset it for them in Firebase console > Authentication >
  Users if needed.
