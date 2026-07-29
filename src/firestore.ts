import { collection, doc, getDoc, getDocs, query, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';
import { addDays, todayISODate } from './dateUtils';

export type HabitState = Record<string, boolean>;

export { todayISODate };

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

// Used for streaks and the Progress calendar. `days` should comfortably cover
// however far back a streak or calendar view needs to look.
export async function fetchRecentHabitLogs(uid: string, days: number): Promise<Record<string, HabitState>> {
  const startDate = addDays(todayISODate(), -days);
  const q = query(collection(db, 'users', uid, 'habitLogs'), where('date', '>=', startDate));
  const snap = await getDocs(q);

  const result: Record<string, HabitState> = {};
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    result[data.date as string] = (data.habits as HabitState) ?? {};
  });
  return result;
}
