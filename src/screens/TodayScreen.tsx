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
import { FRIEND_ACCOUNTS, GROUP_LABELS } from '../config';
import { fetchHabits, saveHabits, fetchGroupHabitLogs, HabitState } from '../firestore';
import { computeGroupStreak, buildActivityFeed, ActivityItem } from '../group';
import {
  lastNDays,
  weekdayShort,
  dayNumber,
  isToday,
  todayISODate,
  formatRelativeTime,
} from '../dateUtils';
import { colors, colorForHabit, iconForHabit } from '../theme';

const GROUP_HISTORY_DAYS = 60;
const ACTIVITY_FEED_LIMIT = 10;

type Props = {
  user: User;
};

export default function TodayScreen({ user }: Props) {
  const [selectedDate, setSelectedDate] = useState(todayISODate());
  const [habits, setHabits] = useState<HabitState>({});
  const [loading, setLoading] = useState(true);
  const [savingHabit, setSavingHabit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [groupStreak, setGroupStreak] = useState<number | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

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
      .then((entries) => {
        setGroupStreak(computeGroupStreak(entries, GROUP_HISTORY_DAYS));
        setActivity(buildActivityFeed(entries, ACTIVITY_FEED_LIMIT));
      })
      .catch(() => {
        // Non-critical — the group banner/feed just stays hidden.
      });
  }, [selectedDate]);

  const labelFor = (uid: string) => (uid === user.uid ? 'You' : GROUP_LABELS[uid] ?? 'A friend');

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

        {groupStreak !== null && (
          <View style={styles.groupStreakCard}>
            <View style={styles.groupStreakIcon}>
              <Ionicons name="flame" size={22} color="#fff" />
            </View>
            <View style={styles.groupStreakTextWrap}>
              <Text style={styles.groupStreakValue}>
                {groupStreak} {groupStreak === 1 ? 'day' : 'days'}
              </Text>
              <Text style={styles.groupStreakLabel}>Group streak</Text>
            </View>
          </View>
        )}

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

        {activity.length > 0 && (
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Group activity</Text>
            <View style={styles.activityList}>
              {activity.map((item, i) => {
                const palette = colorForHabit(item.habit, HABITS);
                return (
                  <View key={i} style={styles.activityRow}>
                    <View style={[styles.activityIconBadge, { backgroundColor: palette.bg }]}>
                      <Ionicons name={iconForHabit(item.habit) as any} size={16} color={palette.accent} />
                    </View>
                    <Text style={styles.activityText}>
                      <Text style={styles.activityLabel}>{labelFor(item.uid)}</Text> completed {item.habit}
                    </Text>
                    <Text style={styles.activityTime}>{formatRelativeTime(item.updatedAt)}</Text>
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
  groupStreakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  groupStreakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  groupStreakTextWrap: {
    flex: 1,
  },
  groupStreakValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  groupStreakLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
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
  activitySection: {
    marginTop: 32,
  },
  activityList: {
    gap: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  activityLabel: {
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});
