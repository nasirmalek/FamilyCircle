// Media Service - Photo and video operations
import { getSupabaseClient } from '@/template';
import * as FileSystem from 'expo-file-system';

export interface Media {
  id: string;
  family_id: string;
  url: string;
  type: 'photo' | 'video';
  caption: string | null;
  uploaded_by: string;
  created_at: string;
  uploader?: {
    username: string;
  };
  likes?: Array<{
    user_id: string;
  }>;
  comments?: Array<{
    id: string;
    user_id: string;
    comment: string;
    created_at: string;
    user: {
      username: string;
    };
  }>;
}

export const mediaService = {
  async getMedia(familyId: string): Promise<Media[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('media')
      .select(`
        *,
        uploader:user_profiles!uploaded_by(username),
        likes:media_likes(user_id),
        comments:media_comments(
          id,
          user_id,
          comment,
          created_at,
          user:user_profiles(username)
        )
      `)
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async uploadMedia(familyId: string, userId: string, fileUri: string, type: 'photo' | 'video', caption?: string) {
    const supabase = getSupabaseClient();
    
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determine file extension
      const extension = fileUri.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}.${extension}`;

      // Convert base64 to array buffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('family-media')
        .upload(fileName, bytes, {
          contentType: type === 'photo' ? 'image/jpeg' : 'video/mp4',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('family-media')
        .getPublicUrl(fileName);

      // Save to database
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert({
          family_id: familyId,
          url: urlData.publicUrl,
          type,
          caption,
          uploaded_by: userId,
        })
        .select()
        .single();

      if (mediaError) throw mediaError;
      return mediaData;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  async likeMedia(mediaId: string, userId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('media_likes')
      .insert({
        media_id: mediaId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async unlikeMedia(mediaId: string, userId: string) {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('media_likes')
      .delete()
      .eq('media_id', mediaId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async addComment(mediaId: string, userId: string, comment: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('media_comments')
      .insert({
        media_id: mediaId,
        user_id: userId,
        comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
