import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '../../hooks/useColorScheme';
import { Ball } from '../../types';

interface OverSummaryProps {
  balls: Ball[];
  overNumber: number;
}

function BallIndicator({ ball }: { ball: Ball }) {
  const colors = useColors();

  let bgColor = colors.surfaceVariant;
  let label = '';

  if (ball.isWicket) {
    bgColor = colors.wicket;
    label = 'W';
  } else if (ball.isWide) {
    bgColor = colors.warning;
    label = 'Wd';
  } else if (ball.isNoBall) {
    bgColor = colors.warning;
    label = 'Nb';
  } else if (ball.runs === 4) {
    bgColor = colors.four;
    label = '4';
  } else if (ball.runs === 6) {
    bgColor = colors.six;
    label = '6';
  } else if (ball.runs > 0) {
    bgColor = colors.primary;
    label = String(ball.runs);
  } else {
    bgColor = colors.dot;
    label = '•';
  }

  return (
    <View
      style={[
        styles.ball,
        {
          backgroundColor: bgColor,
          width: ball.isWide || ball.isNoBall ? 36 : 28,
        },
      ]}
    >
      <Text style={styles.ballText}>{label}</Text>
    </View>
  );
}

export function OverSummary({ balls, overNumber }: OverSummaryProps) {
  const colors = useColors();
  const runsInOver = balls.reduce((sum, b) => {
    let r = b.runs;
    if (b.isWide) r += 1;
    if (b.isNoBall) r += 1;
    return sum + r;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.overHeader}>
        <Text style={[styles.overLabel, { color: colors.textSecondary }]}>
          Over {overNumber}
        </Text>
        <Text style={[styles.overRuns, { color: colors.text }]}>
          {runsInOver} runs
        </Text>
      </View>
      <View style={styles.ballsRow}>
        {balls.map((ball) => (
          <BallIndicator key={ball.id} ball={ball} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  overHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  overLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  overRuns: {
    fontSize: 12,
    fontWeight: '700',
  },
  ballsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  ball: {
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
});
