import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FRIEND_NAMES } from '../config';

type Props = {
  onPick: (name: string) => void;
};

export default function NamePickerScreen({ onPick }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      <Text style={styles.subtitle}>Who's checking in?</Text>

      <View style={styles.list}>
        {FRIEND_NAMES.map((name) => (
          <Pressable key={name} style={styles.button} onPress={() => onPick(name)}>
            <Text style={styles.buttonText}>{name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  list: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
