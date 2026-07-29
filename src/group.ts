import { GroupLogEntry } from './firestore';
import { Streaks } from './streaks';
import { addDays, todayISODate } from './dateUtils';

// How many distinct members completed this habit on a given date.
export function computeParticipationForDate(entries: GroupLogEntry[], habit: string, date: string): number {
  const completed = new Set<string>();
  entries.forEach((entry) => {
    if (entry.date === date && entry.habits[habit]) completed.add(entry.uid);
  });
  return completed.size;
}

// Current + longest streaks of days where at least one member completed
// this habit (current ends today, or yesterday if today isn't done yet).
export function computeGroupStreaks(entries: GroupLogEntry[], habit: string, rangeDays: number): Streaks {
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
  let current = 0;
  for (let i = startIdx; i < checked.length; i++) {
    if (checked[i]) current++;
    else break;
  }

  let longest = 0;
  let run = 0;
  for (let i = checked.length - 1; i >= 0; i--) {
    if (checked[i]) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  return { current, longest };
}
