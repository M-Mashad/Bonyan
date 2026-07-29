import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from './src/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import TodayScreen from './src/screens/TodayScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import BottomTabs, { TabKey } from './src/components/BottomTabs';
import { colors } from './src/theme';

export default function App() {
  const { user, ready, signIn, signOut, signingIn, error } = useAuth();
  const [tab, setTab] = useState<TabKey>('today');

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen onSignIn={signIn} signingIn={signingIn} error={error} />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <View style={styles.appContainer}>
      {tab === 'today' ? (
        <TodayScreen user={user} onSignOut={signOut} />
      ) : (
        <ProgressScreen user={user} />
      )}
      <BottomTabs active={tab} onChange={setTab} />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
