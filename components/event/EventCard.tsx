// Event Card - Display upcoming events
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Event } from '@/types';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { formatEventDate } from '@/utils/dateUtils';

interface EventCardProps {
  event: Event;
  onPress?: (eventId: string) => void;
}

const eventIcons: Record<Event['type'], keyof typeof MaterialIcons.glyphMap> = {
  birthday: 'cake',
  wedding: 'favorite',
  dinner: 'restaurant',
  festival: 'celebration',
  reunion: 'people',
  other: 'event',
};

const eventColors: Record<Event['type'], string> = {
  birthday: '#FF6B9D',
  wedding: '#FF6B6B',
  dinner: '#4ECDC4',
  festival: '#FFD93D',
  reunion: '#9B59B6',
  other: colors.primary,
};

export function EventCard({ event, onPress }: EventCardProps) {
  const iconName = eventIcons[event.type];
  const iconColor = eventColors[event.type];
  const goingCount = event.attendees.filter(a => a.status === 'going').length;
  const dateDisplay = formatEventDate(event.date);

  return (
    <Pressable
      onPress={() => onPress?.(event.id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <MaterialIcons name={iconName} size={28} color={iconColor} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.detailsRow}>
          <MaterialIcons name="event" size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>{dateDisplay}</Text>
        </View>
        {event.location && (
          <View style={styles.detailsRow}>
            <MaterialIcons name="place" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}
        <View style={styles.attendeesRow}>
          <MaterialIcons name="people" size={14} color={colors.success} />
          <Text style={styles.attendeesText}>{goingCount} going</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs / 2,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  attendeesText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.success,
  },
});
