// Chat Detail Screen - Real messaging with polling
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { MessageBubble } from '@/components/chat';
import { Avatar } from '@/components/ui';
import { useAuth } from '@/template';
import { chatService } from '@/services/chatService';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function ChatDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadChat = async () => {
    if (!id) return;

    try {
      const chatData = await chatService.getChatById(id);
      setChat(chatData);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const loadMessages = async () => {
    if (!id) return;

    try {
      const messagesData = await chatService.getMessages(id);
      setMessages(messagesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChat();
    loadMessages();

    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !id || sending) return;

    const messageContent = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await chatService.sendMessage(id, messageContent, user.id);
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageContent);
    } finally {
      setSending(false);
    }
  };

  if (loading || !chat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const participants = chat.chat_participants?.map((p: any) => p.user?.username).filter((n: string) => n) || [];
  const displayName = chat.name || participants.join(', ') || 'Unknown';

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isOwnMessage = item.sender_id === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !previousMessage || previousMessage.sender_id !== item.sender_id;

    return (
      <MessageBubble
        message={{
          id: item.id,
          content: item.content,
          senderId: item.sender_id,
          senderName: item.sender?.username || 'Unknown',
          timestamp: item.created_at,
        }}
        isOwnMessage={isOwnMessage}
        showAvatar={showAvatar}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Avatar name={displayName} uri={chat.avatar} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {chat.type === 'group' ? `${participants.length} members` : 'Active'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
        />

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            editable={!sending}
          />
          <Pressable
            onPress={handleSend}
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            disabled={!inputText.trim() || sending}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={inputText.trim() && !sending ? colors.surface : colors.textTertiary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: typography.sizes.base,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});
