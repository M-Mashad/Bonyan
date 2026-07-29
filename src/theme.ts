export const colors = {
  background: '#F7F7FC',
  card: '#FFFFFF',
  textPrimary: '#25293C',
  textSecondary: '#8A8FA3',
  primary: '#6C63FF',
  primaryDark: '#4B44CC',
  border: '#ECECF5',
  streakFlame: '#FF9F5A',
};

// Warm, friendly per-habit accents — cycled by the habit's position in HABITS.
// `bg` is a pastel card background, `accent` the matching solid color for icons/checks.
const habitPalette = [
  { bg: '#FFEDE0', accent: '#FF9F6B' },
  { bg: '#E7EFFE', accent: '#7EA8F8' },
  { bg: '#FDE6EE', accent: '#F2789F' },
  { bg: '#E3F7F0', accent: '#5FCBAE' },
  { bg: '#F1EAFD', accent: '#B79CED' },
  { bg: '#FFF6DB', accent: '#FFC94A' },
];

export function colorForHabit(habit: string, allHabits: string[]): { bg: string; accent: string } {
  const idx = Math.max(allHabits.indexOf(habit), 0);
  return habitPalette[idx % habitPalette.length];
}

// A little personality per habit name — falls back to a generic mark.
// Names are Ionicons glyphs (see @expo/vector-icons).
const habitIcon: Record<string, string> = {
  Fajr: 'sunny-outline',
  Qiyam: 'moon-outline',
};

export function iconForHabit(habit: string): string {
  return habitIcon[habit] ?? 'sparkles-outline';
}
