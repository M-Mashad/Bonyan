import { HabitState } from './firestore';
import { addDays, todayISODate } from './dateUtils';

export type Streaks = { current: number; longest: number };

export function computeStreaks(
  logs: Record<string, HabitState>,
  habit: string,
  rangeDays: number
): Streaks {
  const today = todayISODate();
  // checked[0] = today, checked[1] = yesterday, ... oldest last.
  const checked: boolean[] = [];
  for (let i = 0; i < rangeDays; i++) {
    const date = addDays(today, -i);
    checked.push(!!logs[date]?.[habit]);
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
