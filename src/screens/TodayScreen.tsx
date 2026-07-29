import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { User } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HABITS } from '../habits';
import { FRIEND_ACCOUNTS } from '../config';
import { fetchHabits, saveHabits, fetchGroupHabitLogs, GroupLogEntry, HabitState } from '../firestore';
import { computeHabitStreak, computeTodayParticipation } from '../group';
import { lastNDays, weekdayShort, dayNumber, isToday, todayISODate } from '../dateUtils';
import { colors, colorForHabit, iconForHabit } from '../theme';

const GROUP_HISTORY_DAYS = 60;

type Props = {
  user: User;
};

export default function TodayScreen({ user }: Props) {
  const [selectedDate, setSelectedDate] = useState(todayISODate());
  const [habits, setHabits] = useState<HabitState>({});
  const [loading, setLoading] = useState(true);
  const [savingHabit, setSavingHabit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [groupEntries, setGroupEntries] = useState<GroupLogEntry[] | null>(null);
  const groupSize = FRIEND_ACCOUNTS.length;

  const displayName = FRIEND_ACCOUNTS.find((a) => a.email === user.email)?.name ?? user.email ?? '';
  const days = lastNDays(7);

  useEffect(() => {
    setLoading(true);
    fetchHabits(user.uid, selectedDate)
      .then(setHabits)
      .catch(() => setError('Could not load habits for this day.'))
      .finally(() => setLoading(false));
  }, [user.uid, selectedDate]);

  useEffect(() => {
    fetchGroupHabitLogs(GROUP_HISTORY_DAYS)
      .then(setGroupEntries)
      .catch(() => {
        // Non-critical — the group section just stays hidden.
      });
  }, [selectedDate]);

  const toggleHabit = async (habit: string) => {
    const next = { ...habits, [habit]: !habits[habit] };
    setHabits(next);
    setSavingHabit(habit);
    setError(null);
    try {
      await saveHabits(user.uid, selectedDate, next);
    } catch {
      setHabits(habits);
      setError('Could not save. Check your connection and try again.');
    } finally {
      setSavingHabit(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {displayName}</Text>
          <Text style={styles.subGreeting}>Let's build some habits today</Text>
        </View>

        <View style={styles.dayStrip}>
          {days.map((date) => {
            const selected = date === selectedDate;
            return (
              <Pressable
                key={date}
                style={[styles.dayPill, selected && styles.dayPillSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayLetter, selected && styles.dayTextSelected]}>
                  {weekdayShort(date).charAt(0)}
                </Text>
                <Text style={[styles.dayNumber, selected && styles.dayTextSelected]}>
                  {dayNumber(date)}
                </Text>
                {isToday(date) && !selected && <View style={styles.todayDot} />}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>{isToday(selectedDate) ? 'Today' : formatLongDate(selectedDate)}</Text>

        {loading ? (
          <ActivityIndicator style={styles.loading} color={colors.primary} />
        ) : (
          <View style={styles.list}>
            {HABITS.map((habit) => {
              const checked = !!habits[habit];
              const palette = colorForHabit(habit, HABITS);
              return (
                <Pressable
                  key={habit}
                  style={[styles.habitCard, { backgroundColor: palette.bg }]}
                  onPress={() => toggleHabit(habit)}
                  disabled={savingHabit === habit}
                >
                  <View style={[styles.habitIconBadge, { backgroundColor: '#fff' }]}>
                    <Ionicons name={iconForHabit(habit) as any} size={20} color={palette.accent} />
                  </View>
                  <Text style={styles.habitLabel}>{habit}</Text>
                  {savingHabit === habit ? (
                    <ActivityIndicator size="small" color={palette.accent} />
                  ) : (
                    <View
                      style={[
                        styles.checkCircle,
                        { borderColor: palette.accent },
                        checked && { backgroundColor: palette.accent },
                      ]}
                    >
                      {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {groupEntries && (
          <View style={styles.groupSection}>
            <Text style={styles.sectionTitle}>Together, today</Text>
            <View style={styles.groupList}>
              {HABITS.map((habit) => {
                const palette = colorForHabit(habit, HABITS);
                const streak = computeHabitStreak(groupEntries, habit, GROUP_HISTORY_DAYS);
                const doneCount = computeTodayParticipation(groupEntries, habit);
                const everyone = doneCount === groupSize;
                return (
                  <View
                    key={habit}
                    style={[
                      styles.groupCard,
                      { backgroundColor: everyone ? palette.accent : palette.bg },
                    ]}
                  >
                    <View style={styles.groupCardTop}>
                      <View
                        style={[
                          styles.habitIconBadge,
                          { backgroundColor: everyone ? 'rgba(255,255,255,0.25)' : '#fff' },
                        ]}
                      >
                        <Ionicons
                          name={iconForHabit(habit) as any}
                          size={18}
                          color={everyone ? '#fff' : palette.accent}
                        />
                      </View>
                      <Text style={[styles.groupHabitLabel, everyone && styles.groupTextOnAccent]}>
                        {habit}
                      </Text>
                      {streak > 0 && (
                        <View style={styles.groupStreakBadge}>
                          <Ionicons name="flame" size={13} color={everyone ? '#fff' : palette.accent} />
                          <Text style={[styles.groupStreakText, everyone && styles.groupTextOnAccent]}>
                            {streak}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.groupParticipationText, everyone && styles.groupTextOnAccent]}>
                      {everyone
                        ? `Everyone completed ${habit} today 🎉`
                        : `${doneCount} of ${groupSize} completed ${habit} today`}
                    </Text>

                    <View style={styles.dotsRow}>
                      {Array.from({ length: groupSize }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            {
                              backgroundColor:
                                i < doneCount ? (everyone ? '#fff' : palette.accent) : 'transparent',
                              borderColor: everyone ? 'rgba(255,255,255,0.6)' : palette.accent,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function formatLongDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[month - 1]} ${day}`;
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayPill: {
    width: 40,
    height: 60,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayPillSelected: {
    backgroundColor: colors.primary,
  },
  dayLetter: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  dayTextSelected: {
    color: '#fff',
  },
  todayDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  loading: {
    marginTop: 40,
  },
  list: {
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  habitIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#E0567C',
    marginTop: 16,
    textAlign: 'center',
  },
  groupSection: {
    marginTop: 32,
  },
  groupList: {
    gap: 12,
  },
  groupCard: {
    borderRadius: 18,
    padding: 16,
  },
  groupCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupHabitLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  groupTextOnAccent: {
    color: '#fff',
  },
  groupStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  groupStreakText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  groupParticipationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
});
