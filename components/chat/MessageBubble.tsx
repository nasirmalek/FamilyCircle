// Message Bubble - Individual message display
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';
import { Avatar } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { formatMessageTime } from '@/utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
}

export function MessageBubble({ message, isOwnMessage, showAvatar }: MessageBubbleProps) {
  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}>
      {!isOwnMessage && (
        <View style={styles.avatarContainer}>
          {showAvatar ? (
            <Avatar uri={message.senderAvatar} name={message.senderName} size={32} />
          ) : (
            <View style={{ width: 32 }} />
          )}
        </View>
      )}
      
      <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
        {!isOwnMessage && showAvatar && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
          {formatMessageTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  ownBubble: {
    backgroundColor: colors.chatSent,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.chatReceived,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: typography.sizes.base,
    color: colors.text,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  ownMessageText: {
    color: colors.surface,
  },
  timestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
