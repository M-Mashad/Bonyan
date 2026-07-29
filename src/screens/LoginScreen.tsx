import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FRIEND_ACCOUNTS } from '../config';

type Props = {
  onSignIn: (email: string, password: string) => void;
  signingIn: boolean;
  error: string | null;
};

export default function LoginScreen({ onSignIn, signingIn, error }: Props) {
  const [selected, setSelected] = useState<{ name: string; email: string } | null>(null);
  const [password, setPassword] = useState('');

  if (!selected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Habit Tracker</Text>
        <Text style={styles.subtitle}>Who's checking in?</Text>

        <View style={styles.list}>
          {FRIEND_ACCOUNTS.map((account) => (
            <Pressable key={account.email} style={styles.button} onPress={() => setSelected(account)}>
              <Text style={styles.buttonText}>{account.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi, {selected.name}</Text>
      <Text style={styles.subtitle}>Enter your password</Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoFocus
        placeholder="Password"
        onSubmitEditing={() => onSignIn(selected.email, password)}
      />

      <Pressable
        style={[styles.button, styles.signInButton, signingIn && styles.buttonDisabled]}
        onPress={() => onSignIn(selected.email, password)}
        disabled={signingIn}
      >
        {signingIn ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        onPress={() => {
          setSelected(null);
          setPassword('');
        }}
      >
        <Text style={styles.back}>Not {selected.name}?</Text>
      </Pressable>
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
    width: '100%',
  },
  signInButton: {
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  error: {
    color: '#c0392b',
    marginTop: 16,
    textAlign: 'center',
  },
  back: {
    color: '#4285F4',
    marginTop: 24,
    fontSize: 14,
  },
});
