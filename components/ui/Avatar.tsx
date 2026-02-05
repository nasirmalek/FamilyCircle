// Avatar Component - User profile pictures
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, borderRadius, typography } from '@/constants/theme';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  online?: boolean;
  style?: ViewStyle;
}

export function Avatar({ uri, name, size = 48, online, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const backgroundColor = getColorForName(name);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
      )}
      {online && (
        <View style={[styles.onlineIndicator, { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />
      )}
    </View>
  );
}

function getColorForName(name: string): string {
  const colorPalette = [
    colors.primary,
    colors.secondary,
    '#9B59B6',
    '#E74C3C',
    '#3498DB',
    '#1ABC9C',
    '#F39C12',
    '#E67E22',
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.border,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.surface,
    fontWeight: typography.weights.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
