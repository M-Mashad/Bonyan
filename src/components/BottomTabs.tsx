import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme';

export type TabKey = 'today' | 'progress';

const TABS: { key: TabKey; label: string; icon: string; iconActive: string }[] = [
  { key: 'today', label: 'Today', icon: 'checkmark-circle-outline', iconActive: 'checkmark-circle' },
  { key: 'progress', label: 'Progress', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
];

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function BottomTabs({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onChange(tab.key)}>
            <Ionicons
              name={(isActive ? tab.iconActive : tab.icon) as any}
              size={22}
              color={isActive ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
