// Chat List Item - Individual chat preview
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Chat } from '@/types';
import { Avatar } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { formatTimestamp } from '@/utils/dateUtils';

interface ChatListItemProps {
  chat: Chat;
  onPress: (chatId: string) => void;
}

export function ChatListItem({ chat, onPress }: ChatListItemProps) {
  const displayName = chat.name || chat.participantNames.filter(n => n !== 'You').join(', ');
  const lastMessageText = chat.lastMessage?.content || 'No messages yet';
  const lastMessageTime = chat.lastMessage?.timestamp ? formatTimestamp(chat.lastMessage.timestamp) : '';

  return (
    <Pressable
      onPress={() => onPress(chat.id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Avatar uri={chat.avatar} name={displayName} size={56} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            {chat.isPinned && (
              <MaterialIcons name="push-pin" size={14} color={colors.primary} />
            )}
          </View>
          {lastMessageTime && (
            <Text style={styles.time}>{lastMessageTime}</Text>
          )}
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
});
