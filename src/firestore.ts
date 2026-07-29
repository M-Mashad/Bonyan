import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type HabitState = Record<string, boolean>;

export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function fetchHabits(uid: string, date: string): Promise<HabitState> {
  const snap = await getDoc(doc(db, 'users', uid, 'habitLogs', date));
  if (!snap.exists()) return {};
  return (snap.data().habits as HabitState) ?? {};
}

export async function saveHabits(uid: string, date: string, habits: HabitState): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'habitLogs', date),
    { date, habits, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
