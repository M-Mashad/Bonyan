import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useIdentity } from './src/useIdentity';
import NamePickerScreen from './src/screens/NamePickerScreen';
import HabitsScreen from './src/screens/HabitsScreen';

export default function App() {
  const { name, ready, chooseName, clearName } = useIdentity();

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
      {name ? (
        <HabitsScreen user={name} onSignOut={clearName} />
      ) : (
        <NamePickerScreen onPick={chooseName} />
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
