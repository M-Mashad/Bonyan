import { GroupLogEntry } from './firestore';
import { addDays, todayISODate } from './dateUtils';

// Consecutive days (ending today, or yesterday if today isn't done yet)
// where at least one member completed this specific habit.
export function computeHabitStreak(entries: GroupLogEntry[], habit: string, rangeDays: number): number {
  const activeDates = new Set<string>();
  entries.forEach((entry) => {
    if (entry.habits[habit]) activeDates.add(entry.date);
  });

  const today = todayISODate();
  const checked: boolean[] = [];
  for (let i = 0; i < rangeDays; i++) {
    checked.push(activeDates.has(addDays(today, -i)));
  }

  const startIdx = checked[0] ? 0 : 1;
  let streak = 0;
  for (let i = startIdx; i < checked.length; i++) {
    if (checked[i]) streak++;
    else break;
  }
  return streak;
}

// How many distinct members completed this habit today.
export function computeTodayParticipation(entries: GroupLogEntry[], habit: string): number {
  const today = todayISODate();
  const completed = new Set<string>();
  entries.forEach((entry) => {
    if (entry.date === today && entry.habits[habit]) completed.add(entry.uid);
  });
  return completed.size;
}
