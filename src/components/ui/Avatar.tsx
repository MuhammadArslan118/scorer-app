import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColorScheme';

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

const AVATAR_COLORS = [
  '#1B5E20', '#1565C0', '#E65100', '#6A1B9A',
  '#2E7D32', '#0D47A1', '#BF360C', '#4A148C',
  '#388E3C', '#1976D2', '#EF6C00', '#7B1FA2',
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function Avatar({ name, size = 40, imageUrl }: AvatarProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getColorForName(name),
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: size * 0.4, color: '#FFFFFF' },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
  },
});
