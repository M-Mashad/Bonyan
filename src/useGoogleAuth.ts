import { useEffect, useState, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_WEB_CLIENT_ID, ALLOWED_EMAILS } from './config';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = 'bonyan.user';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export type AppUser = {
  email: string;
  name: string;
  picture?: string;
};

function isAllowed(email: string): boolean {
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}

export function useGoogleAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .finally(() => setRestoring(false));
  }, []);

  useEffect(() => {
    if (response?.type !== 'success') return;

    const accessToken = response.params.access_token;
    if (!accessToken) return;

    setSigningIn(true);
    setError(null);

    fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((profile: { email: string; name: string; picture?: string }) => {
        if (!isAllowed(profile.email)) {
          setError(`${profile.email} is not on the allowed list.`);
          return;
        }
        const appUser: AppUser = {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        };
        return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appUser)).then(() =>
          setUser(appUser)
        );
      })
      .catch(() => setError('Could not fetch your Google profile. Please try again.'))
      .finally(() => setSigningIn(false));
  }, [response]);

  const signIn = useCallback(() => {
    setError(null);
    promptAsync();
  }, [promptAsync]);

  const signOut = useCallback(() => {
    AsyncStorage.removeItem(STORAGE_KEY).then(() => setUser(null));
  }, []);

  return {
    user,
    restoring,
    signingIn,
    error,
    canSignIn: !!request,
    signIn,
    signOut,
    redirectUri,
  };
}
