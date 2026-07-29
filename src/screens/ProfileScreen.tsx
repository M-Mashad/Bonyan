import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { User, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FRIEND_ACCOUNTS } from '../config';
import { colors } from '../theme';

type Props = {
  user: User;
  onSignOut: () => void;
};

export default function ProfileScreen({ user, onSignOut }: Props) {
  const displayName = FRIEND_ACCOUNTS.find((a) => a.email === user.email)?.name ?? user.email ?? '';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async () => {
    setError(null);
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
        setError('Current password is incorrect.');
      } else {
        setError('Could not change password. Try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
        </View>

        <Text style={styles.sectionTitle}>Change password</Text>
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Current password"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="New password"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm new password"
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={changePassword}
          />

          <Pressable
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={changePassword}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update password</Text>
            )}
          </Pressable>

          {error && <Text style={styles.error}>{error}</Text>}
          {success && (
            <View style={styles.successRow}>
              <Ionicons name="checkmark-circle" size={16} color="#4CB88E" />
              <Text style={styles.success}>Password updated</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.signOutButton} onPress={onSignOut}>
          <Ionicons name="log-out-outline" size={18} color="#E0567C" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
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
    marginBottom: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 28,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: '#E0567C',
    fontSize: 13,
    textAlign: 'center',
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  success: {
    color: '#4CB88E',
    fontSize: 13,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  signOutText: {
    color: '#E0567C',
    fontSize: 15,
    fontWeight: '700',
  },
});
