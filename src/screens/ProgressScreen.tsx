import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { User } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HABITS } from '../habits';
import { HabitState, fetchRecentHabitLogs, fetchGroupHabitLogs, GroupLogEntry } from '../firestore';
import { computeStreaks } from '../streaks';
import { computeHabitStreak } from '../group';
import { colors, colorForHabit, iconForHabit } from '../theme';
import {
  addMonths,
  buildMonthGrid,
  monthLabel,
  todayISODate,
  WEEKDAY_LETTERS,
} from '../dateUtils';

const HISTORY_DAYS = 400;
const GROUP_HISTORY_DAYS = 60;

type Props = {
  user: User;
};

export default function ProgressScreen({ user }: Props) {
  const [selectedHabit, setSelectedHabit] = useState(HABITS[0]);
  const [logs, setLogs] = useState<Record<string, HabitState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groupEntries, setGroupEntries] = useState<GroupLogEntry[] | null>(null);

  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });

  useEffect(() => {
    fetchRecentHabitLogs(user.uid, HISTORY_DAYS)
      .then(setLogs)
      .catch(() => setError('Could not load your history.'))
      .finally(() => setLoading(false));
  }, [user.uid]);

  useEffect(() => {
    fetchGroupHabitLogs(GROUP_HISTORY_DAYS)
      .then(setGroupEntries)
      .catch(() => {
        // Non-critical — the group streak card just stays hidden.
      });
  }, []);

  const streaks = useMemo(
    () => computeStreaks(logs, selectedHabit, HISTORY_DAYS),
    [logs, selectedHabit]
  );
  const groupStreak = useMemo(
    () => (groupEntries ? computeHabitStreak(groupEntries, selectedHabit, GROUP_HISTORY_DAYS) : null),
    [groupEntries, selectedHabit]
  );
  const weeks = useMemo(() => buildMonthGrid(view.year, view.month), [view]);
  const palette = colorForHabit(selectedHabit, HABITS);
  const today = todayISODate();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progress</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {HABITS.map((habit) => {
            const isSelected = habit === selectedHabit;
            const habitPalette = colorForHabit(habit, HABITS);
            return (
              <Pressable
                key={habit}
                style={[
                  styles.pill,
                  { backgroundColor: isSelected ? habitPalette.accent : colors.card },
                ]}
                onPress={() => setSelectedHabit(habit)}
              >
                <Ionicons
                  name={iconForHabit(habit) as any}
                  size={16}
                  color={isSelected ? '#fff' : habitPalette.accent}
                  style={styles.pillIcon}
                />
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{habit}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <ActivityIndicator style={styles.loading} color={colors.primary} />
        ) : (
          <>
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Pressable
                  onPress={() => setView((v) => addMonths(v.year, v.month, -1))}
                  hitSlop={10}
                >
                  <Ionicons name="chevron-back" size={22} color={colors.primary} />
                </Pressable>
                <Text style={styles.monthLabel}>{monthLabel(view.year, view.month)}</Text>
                <Pressable
                  onPress={() => setView((v) => addMonths(v.year, v.month, 1))}
                  hitSlop={10}
                >
                  <Ionicons name="chevron-forward" size={22} color={colors.primary} />
                </Pressable>
              </View>

              <View style={styles.weekdayRow}>
                {WEEKDAY_LETTERS.map((letter, i) => (
                  <Text key={i} style={styles.weekdayLetter}>
                    {letter}
                  </Text>
                ))}
              </View>

              {weeks.map((week, i) => (
                <View key={i} style={styles.weekRow}>
                  {week.map((date, j) => {
                    if (!date) return <View key={j} style={styles.dayCell} />;
                    const checked = !!logs[date]?.[selectedHabit];
                    const isToday = date === today;
                    return (
                      <View key={j} style={styles.dayCell}>
                        <View
                          style={[
                            styles.dayCircle,
                            checked && { backgroundColor: palette.accent },
                            isToday && !checked && styles.dayCircleToday,
                          ]}
                        >
                          <Text style={[styles.dayCircleText, checked && styles.dayCircleTextChecked]}>
                            {Number(date.slice(-2))}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: palette.bg }]}>
                <Ionicons name="flame" size={20} color={palette.accent} />
                <Text style={styles.statLabel}>Your streak</Text>
                <Text style={styles.statValue}>
                  {streaks.current} {streaks.current === 1 ? 'day' : 'days'}
                </Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: palette.bg }]}>
                <Ionicons name="trophy" size={20} color={palette.accent} />
                <Text style={styles.statLabel}>Your longest</Text>
                <Text style={styles.statValue}>
                  {streaks.longest} {streaks.longest === 1 ? 'day' : 'days'}
                </Text>
              </View>
              {groupStreak !== null && (
                <View style={[styles.statCard, { backgroundColor: palette.bg }]}>
                  <Ionicons name="people" size={20} color={palette.accent} />
                  <Text style={styles.statLabel}>Group streak</Text>
                  <Text style={styles.statValue}>
                    {groupStreak} {groupStreak === 1 ? 'day' : 'days'}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 18,
  },
  pillRow: {
    marginBottom: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pillTextSelected: {
    color: '#fff',
  },
  loading: {
    marginTop: 40,
  },
  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayLetter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayCircleText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dayCircleTextChecked: {
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  error: {
    color: '#E0567C',
    marginTop: 16,
    textAlign: 'center',
  },
});
