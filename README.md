# Bonyan — Habit Tracker

A tiny Expo app for a fixed group of friends to check off daily habits.
Everything is stored in a Google Sheet, so you can open the spreadsheet at
any time and see every user, every date, and which habits were checked.

## How it works

- The app shows a fixed list of habits (edit `src/habits.ts`).
- Users sign in with Google once; their name/email is remembered on the
  device after that.
- Checking/unchecking a habit calls a Google Apps Script Web App, which
  writes one row per `(date, user)` into the first tab of your spreadsheet,
  with one column per habit.

```
Date       | User             | Updated At          | Drink water | Exercise | ...
2026-07-29 | alice@gmail.com  | 2026-07-29 08:03:11  | TRUE        | FALSE    | ...
```

## Setup

### 1. Create the spreadsheet + backend

1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**, delete the placeholder code, and
   paste in the contents of `google-apps-script/Code.gs`.
3. In the Apps Script editor, go to **Project Settings > Script
   Properties**, and add a property `SHARED_SECRET` with a random value you
   make up (e.g. a UUID). This has to match `SHARED_SECRET` in
   `src/config.ts` later.
4. Click **Deploy > New deployment**, type **Web app**, execute as
   **Me**, who has access **Anyone**. Deploy and copy the `/exec` URL —
   that's your `APPS_SCRIPT_URL`.
5. Any time you edit `Code.gs`, create a **new deployment version** (or
   deploy again) for the changes to take effect.

### 2. Create a Google OAuth client (for sign-in)

1. In [Google Cloud Console](https://console.cloud.google.com/), create a
   project (or reuse one).
2. Go to **APIs & Services > OAuth consent screen**. Set it to
   **External**, fill in the required fields, and add your 5 friends'
   emails under **Test users** (while unverified, only test users can sign
   in — that's fine for this use case).
3. Go to **APIs & Services > Credentials > Create Credentials > OAuth
   client ID**, type **Web application**.
4. Leave it open for now — you'll add the redirect URI in the next step.

### 3. Configure the app

1. `npm install`
2. Copy your values into `src/config.ts`:
   - `GOOGLE_WEB_CLIENT_ID` — the client ID from step 2.
   - `APPS_SCRIPT_URL` — the `/exec` URL from step 1.
   - `SHARED_SECRET` — must match the Script Property from step 1.
   - `ALLOWED_EMAILS` — your friends' Google emails (recommended, extra
     safety on top of the OAuth test-user list).
3. Edit `src/habits.ts` with your actual fixed habit list.

### 4. Wire up the redirect URI

1. Run `npx expo start` and open the app (Expo Go is fine for trying it
   out).
2. On the sign-in screen, the app prints its **redirect URI** near the
   bottom of the screen.
3. Copy that value into the Google OAuth client from step 2, under
   **Authorized redirect URIs**, and save.
4. Reload the app and tap **Sign in with Google**.

> **Note:** in Expo Go, the redirect URI is tied to your current dev
> server (`exp://<your-ip>:8081`) and can change between networks. For
> day-to-day use by your 5 friends, build a
> [dev client or standalone build](https://docs.expo.dev/develop/development-builds/introduction/)
> (`npx expo run:android` / `eas build`) — then the redirect URI is the
> stable `bonyan://` scheme already set in `app.json`, and you only need to
> register it once.

## Development

```
npm install
npx expo start
```

## Security notes

- The Apps Script is deployed with "Anyone" access, so treat the
  `APPS_SCRIPT_URL` + `SHARED_SECRET` pair like a password — don't post it
  publicly. It's enough friction to keep random internet traffic out for a
  friends-only app; it is not bank-grade security.
- `ALLOWED_EMAILS` is a client-side check. Combined with keeping the OAuth
  consent screen in "Testing" mode with only your friends as test users,
  that's sufficient for this use case, but a determined user could bypass
  the client-side check — don't rely on this for sensitive data.
