import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export type TabKey = 'today' | 'progress';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'today', label: 'Today', emoji: '✅' },
  { key: 'progress', label: 'Progress', emoji: '📊' },
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
            <Text style={[styles.emoji, !isActive && styles.emojiInactive]}>{tab.emoji}</Text>
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
    gap: 2,
  },
  emoji: {
    fontSize: 20,
  },
  emojiInactive: {
    opacity: 0.4,
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
