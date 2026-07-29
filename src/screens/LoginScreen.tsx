import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGoogleAuth } from '../useGoogleAuth';

export default function LoginScreen() {
  const { signIn, signingIn, canSignIn, error, redirectUri } = useGoogleAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      <Text style={styles.subtitle}>Sign in with Google to continue</Text>

      <Pressable
        style={[styles.button, (!canSignIn || signingIn) && styles.buttonDisabled]}
        onPress={signIn}
        disabled={!canSignIn || signingIn}
      >
        {signingIn ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.hint}>Redirect URI (for Google Cloud Console setup):</Text>
      <Text selectable style={styles.mono}>
        {redirectUri}
      </Text>
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
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#c0392b',
    marginTop: 16,
    textAlign: 'center',
  },
  hint: {
    marginTop: 48,
    fontSize: 12,
    color: '#999',
  },
  mono: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
