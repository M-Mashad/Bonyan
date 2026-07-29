// Fill these in after following the setup steps in README.md

// OAuth 2.0 "Web application" client ID from Google Cloud Console.
export const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';

// The /exec URL you get after deploying the Apps Script as a Web App.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// Any random string. Must match the SHARED_SECRET set in the Apps Script's
// Script Properties. Stops random people from writing to your sheet if they
// ever guess the Apps Script URL.
export const SHARED_SECRET = 'change-me-to-something-random';

// Only these emails are allowed to sign in. Leave empty to allow anyone with
// a Google account (not recommended).
export const ALLOWED_EMAILS: string[] = [
  // 'friend1@gmail.com',
  // 'friend2@gmail.com',
];
