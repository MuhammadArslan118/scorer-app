import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useColors } from '../../hooks/useColorScheme';

interface PlayerSelectProps {
  label: string;
  players: { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PlayerSelect({
  label,
  players,
  selectedId,
  onSelect,
}: PlayerSelectProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.playerGrid}>
        {players.map((player) => {
          const isSelected = player.id === selectedId;
          return (
            <TouchableOpacity
              key={player.id}
              onPress={() => onSelect(player.id)}
              style={[
                styles.playerChip,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : colors.surfaceVariant,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.playerName,
                  { color: isSelected ? colors.textOnPrimary : colors.text },
                ]}
                numberOfLines={1}
              >
                {player.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  playerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
  },
});
