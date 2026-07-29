import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from './src/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import HabitsScreen from './src/screens/HabitsScreen';

export default function App() {
  const { user, ready, signIn, signOut, signingIn, error } = useAuth();

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      {user ? (
        <HabitsScreen user={user} onSignOut={signOut} />
      ) : (
        <LoginScreen onSignIn={signIn} signingIn={signingIn} error={error} />
      )}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
