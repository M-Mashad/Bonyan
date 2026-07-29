const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISODate(): string {
  return toISODate(new Date());
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr: string, amount: number): string {
  const d = parseISODate(dateStr);
  d.setDate(d.getDate() + amount);
  return toISODate(d);
}

export function weekdayShort(dateStr: string): string {
  return WEEKDAY_SHORT[parseISODate(dateStr).getDay()];
}

export function dayNumber(dateStr: string): number {
  return parseISODate(dateStr).getDate();
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayISODate();
}

// Last `count` dates ending today, oldest first.
export function lastNDays(count: number): string[] {
  const today = todayISODate();
  const days: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    days.push(addDays(today, -i));
  }
  return days;
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

// Sunday-first month grid. Each week has 7 cells; cells outside the month are null.
export function buildMonthGrid(year: number, month: number): (string | null)[][] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toISODate(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function addMonths(year: number, month: number, amount: number): { year: number; month: number } {
  const total = year * 12 + month + amount;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

export const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function formatRelativeTime(date: Date | null): string {
  if (!date) return '';
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}
