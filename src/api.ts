import { APPS_SCRIPT_URL, SHARED_SECRET } from './config';

export type HabitState = Record<string, boolean>;

export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function fetchHabits(email: string, date: string): Promise<HabitState> {
  const url = `${APPS_SCRIPT_URL}?secret=${encodeURIComponent(SHARED_SECRET)}&user=${encodeURIComponent(
    email
  )}&date=${encodeURIComponent(date)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load habits (${res.status})`);
  }
  const json = await res.json();
  if (!json.ok) {
    throw new Error(json.error || 'Failed to load habits');
  }
  return json.habits ?? {};
}

export async function saveHabits(email: string, date: string, habits: HabitState): Promise<void> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ secret: SHARED_SECRET, user: email, date, habits }),
  });
  if (!res.ok) {
    throw new Error(`Failed to save habits (${res.status})`);
  }
  const json = await res.json();
  if (!json.ok) {
    throw new Error(json.error || 'Failed to save habits');
  }
}
