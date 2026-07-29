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

function docId(date: string, user: string): string {
  return `${date}_${user}`;
}

export async function fetchHabits(user: string, date: string): Promise<HabitState> {
  const snap = await getDoc(doc(db, 'habitLogs', docId(date, user)));
  if (!snap.exists()) return {};
  return (snap.data().habits as HabitState) ?? {};
}

export async function saveHabits(user: string, date: string, habits: HabitState): Promise<void> {
  await setDoc(
    doc(db, 'habitLogs', docId(date, user)),
    { date, user, habits, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
