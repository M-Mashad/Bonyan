import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ensureSignedIn } from './firebase';

const STORAGE_KEY = 'bonyan.name';

export function useIdentity() {
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([ensureSignedIn(), AsyncStorage.getItem(STORAGE_KEY)])
      .then(([, storedName]) => {
        if (storedName) setName(storedName);
      })
      .finally(() => setReady(true));
  }, []);

  const chooseName = useCallback((value: string) => {
    AsyncStorage.setItem(STORAGE_KEY, value).then(() => setName(value));
  }, []);

  const clearName = useCallback(() => {
    AsyncStorage.removeItem(STORAGE_KEY).then(() => setName(null));
  }, []);

  return { name, ready, chooseName, clearName };
}
