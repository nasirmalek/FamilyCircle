// Chat Hook - State management for chats
import { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '@/types';
import { chatService } from '@/services/chatService';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getChats();
      setChats(data);
    } catch (err) {
      setError('Failed to load chats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const refreshChats = useCallback(() => {
    loadChats();
  }, [loadChats]);

  return {
    chats,
    loading,
    error,
    refreshChats,
  };
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getMessages(chatId);
      setMessages(data);
      await chatService.markAsRead(chatId);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      const newMessage = await chatService.sendMessage(chatId, content);
      setMessages(prev => [...prev, newMessage]);
      return true;
    } catch (err) {
      console.error('Failed to send message:', err);
      return false;
    }
  }, [chatId]);

  const refreshMessages = useCallback(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages,
  };
}
