import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FRIEND_ACCOUNTS } from '../config';
import { colors } from '../theme';

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
        <View style={styles.hero}>
          <Ionicons name="leaf-outline" size={44} color={colors.primary} />
        </View>
        <Text style={styles.title}>Habit Tracker</Text>
        <Text style={styles.subtitle}>Who's checking in today?</Text>

        <View style={styles.list}>
          {FRIEND_ACCOUNTS.map((account) => (
            <Pressable
              key={account.email}
              style={({ pressed }) => [styles.nameCard, pressed && styles.nameCardPressed]}
              onPress={() => setSelected(account)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{account.name.charAt(0)}</Text>
              </View>
              <Text style={styles.nameText}>{account.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Ionicons name="hand-left-outline" size={44} color={colors.primary} />
      </View>
      <Text style={styles.title}>Hi, {selected.name}</Text>
      <Text style={styles.subtitle}>Enter your password to continue</Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoFocus
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        onSubmitEditing={() => onSignIn(selected.email, password)}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (signingIn || pressed) && styles.buttonPressed,
        ]}
        onPress={() => onSignIn(selected.email, password)}
        disabled={signingIn}
      >
        {signingIn ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Let's go</Text>}
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
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EAE7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  list: {
    width: '100%',
    gap: 12,
  },
  nameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#25293C',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  nameCardPressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#E0567C',
    marginTop: 16,
    textAlign: 'center',
  },
  back: {
    color: colors.primary,
    marginTop: 22,
    fontSize: 14,
    fontWeight: '600',
  },
});
