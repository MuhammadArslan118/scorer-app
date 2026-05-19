import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';

interface ScoreCardProps {
  teamName: string;
  shortName: string;
  runs: number;
  wickets: number;
  overs: number;
  isBatting?: boolean;
  style?: ViewStyle;
}

export function ScoreCard({
  teamName,
  shortName,
  runs,
  wickets,
  overs,
  isBatting = false,
  style,
}: ScoreCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isBatting ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.teamName,
            { color: isBatting ? colors.textOnPrimary : colors.text },
          ]}
          numberOfLines={1}
        >
          {shortName}
        </Text>
        <View style={styles.scoreRow}>
          <Text
            style={[
              styles.score,
              { color: isBatting ? colors.textOnPrimary : colors.text },
            ]}
          >
            {runs}/{wickets}
          </Text>
          <Text
            style={[
              styles.overs,
              { color: isBatting ? colors.textOnPrimary : colors.textSecondary },
            ]}
          >
            ({overs.toFixed(1)})
          </Text>
        </View>
      </View>
      {isBatting && (
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={styles.badgeText}>Batting</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
  },
  overs: {
    fontSize: 14,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
});
