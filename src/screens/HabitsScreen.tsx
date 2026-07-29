import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HABITS } from '../habits';
import { fetchHabits, saveHabits, todayISODate, HabitState } from '../firestore';

type Props = {
  user: string;
  onSignOut: () => void;
};

export default function HabitsScreen({ user, onSignOut }: Props) {
  const [date] = useState(todayISODate());
  const [habits, setHabits] = useState<HabitState>({});
  const [loading, setLoading] = useState(true);
  const [savingHabit, setSavingHabit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHabits(user, date)
      .then(setHabits)
      .catch(() => setError('Could not load today’s habits.'))
      .finally(() => setLoading(false));
  }, [user, date]);

  const toggleHabit = async (habit: string) => {
    const next = { ...habits, [habit]: !habits[habit] };
    setHabits(next);
    setSavingHabit(habit);
    setError(null);
    try {
      await saveHabits(user, date, next);
    } catch {
      setHabits(habits);
      setError('Could not save. Check your connection and try again.');
    } finally {
      setSavingHabit(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Pressable onPress={onSignOut}>
          <Text style={styles.signOut}>Not you?</Text>
        </Pressable>
      </View>
      <Text style={styles.userLabel}>{user}</Text>

      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <View style={styles.list}>
          {HABITS.map((habit) => {
            const checked = !!habits[habit];
            return (
              <Pressable
                key={habit}
                style={styles.row}
                onPress={() => toggleHabit(habit)}
                disabled={savingHabit === habit}
              >
                <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                  {checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.habitLabel}>{habit}</Text>
                {savingHabit === habit && <ActivityIndicator size="small" style={styles.rowSpinner} />}
              </Pressable>
            );
          })}
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  signOut: {
    color: '#4285F4',
    fontSize: 14,
  },
  userLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 24,
  },
  loading: {
    marginTop: 40,
  },
  list: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#4285F4',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  habitLabel: {
    fontSize: 16,
    flex: 1,
  },
  rowSpinner: {
    marginLeft: 8,
  },
  error: {
    color: '#c0392b',
    marginTop: 16,
    textAlign: 'center',
  },
});
