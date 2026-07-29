import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useGoogleAuth } from './src/useGoogleAuth';
import LoginScreen from './src/screens/LoginScreen';
import HabitsScreen from './src/screens/HabitsScreen';

export default function App() {
  const { user, restoring, signOut } = useGoogleAuth();

  if (restoring) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      {user ? <HabitsScreen user={user} onSignOut={signOut} /> : <LoginScreen />}
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
