import { GroupLogEntry } from './firestore';
import { addDays, todayISODate } from './dateUtils';

export function computeGroupStreak(entries: GroupLogEntry[], rangeDays: number): number {
  const activeDates = new Set<string>();
  entries.forEach((entry) => {
    if (Object.values(entry.habits).some(Boolean)) activeDates.add(entry.date);
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

export type ActivityItem = { uid: string; date: string; habit: string; updatedAt: Date | null };

export function buildActivityFeed(entries: GroupLogEntry[], limit: number): ActivityItem[] {
  const items: ActivityItem[] = [];
  entries.forEach((entry) => {
    Object.entries(entry.habits).forEach(([habit, checked]) => {
      if (checked) items.push({ uid: entry.uid, date: entry.date, habit, updatedAt: entry.updatedAt });
    });
  });
  items.sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
  return items.slice(0, limit);
}
