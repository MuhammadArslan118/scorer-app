import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useColors } from '../../hooks/useColorScheme';

type BallType = 'runs' | 'wide' | 'noball' | 'bye' | 'wicket';

interface BallControlProps {
  onBall: (type: BallType, value?: number) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const RUN_BUTTONS = [0, 1, 2, 3, 4, 6];

export function BallControl({ onBall, onUndo, canUndo }: BallControlProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Runs
      </Text>
      <View style={styles.runButtons}>
        {RUN_BUTTONS.map((run) => (
          <TouchableOpacity
            key={run}
            onPress={() => onBall('runs', run)}
            style={[
              styles.runButton,
              {
                backgroundColor:
                  run === 4
                    ? colors.four
                    : run === 6
                    ? colors.six
                    : run === 0
                    ? colors.dot
                    : colors.primary,
              },
            ]}
          >
            <Text style={styles.runButtonText}>
              {run === 0 ? 'Dot' : run}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 12 }]}>
        Extras
      </Text>
      <View style={styles.extrasRow}>
        <TouchableOpacity
          onPress={() => onBall('wide')}
          style={[styles.extrasButton, { backgroundColor: colors.warning }]}
        >
          <Text style={styles.extrasText}>Wide</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onBall('noball')}
          style={[styles.extrasButton, { backgroundColor: colors.warning }]}
        >
          <Text style={styles.extrasText}>No Ball</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onBall('bye')}
          style={[styles.extrasButton, { backgroundColor: colors.info }]}
        >
          <Text style={styles.extrasText}>Bye</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onBall('wicket')}
          style={[styles.extrasButton, { backgroundColor: colors.wicket }]}
        >
          <Text style={styles.extrasText}>Wicket</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onUndo}
        disabled={!canUndo}
        style={[
          styles.undoButton,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.border,
            opacity: canUndo ? 1 : 0.4,
          },
        ]}
      >
        <Text style={[styles.undoText, { color: colors.text }]}>
          Undo Last Ball
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  runButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  runButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  extrasRow: {
    flexDirection: 'row',
    gap: 8,
  },
  extrasButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extrasText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  undoButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  undoText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
