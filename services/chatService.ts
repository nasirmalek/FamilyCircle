// Chat Service - Real backend operations
import { getSupabaseClient } from '@/template';

export const chatService = {
  async getChats(familyId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        chat_participants!inner(
          user_id,
          user:user_profiles(username, email)
        ),
        messages(
          id,
          content,
          created_at,
          sender:user_profiles(username)
        )
      `)
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  },

  async getChatById(chatId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        chat_participants(
          user:user_profiles(id, username, email)
        )
      `)
      .eq('id', chatId)
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages(chatId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:user_profiles(id, username, email)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(chatId: string, content: string, senderId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        content,
        type: 'text',
      })
      .select(`
        *,
        sender:user_profiles(id, username, email)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async createDirectChat(familyId: string, participantIds: string[]) {
    const supabase = getSupabaseClient();
    
    // Create chat
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .insert({
        family_id: familyId,
        type: 'direct',
      })
      .select()
      .single();

    if (chatError || !chatData) throw chatError;

    // Add participants
    const participants = participantIds.map(userId => ({
      chat_id: chatData.id,
      user_id: userId,
    }));

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return chatData;
  },

  async createGroupChat(familyId: string, name: string, participantIds: string[]) {
    const supabase = getSupabaseClient();
    
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .insert({
        family_id: familyId,
        type: 'group',
        name,
      })
      .select()
      .single();

    if (chatError || !chatData) throw chatError;

    const participants = participantIds.map(userId => ({
      chat_id: chatData.id,
      user_id: userId,
    }));

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return chatData;
  },
};
