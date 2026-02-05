// Event Service - Event management operations
import { getSupabaseClient } from '@/template';

export interface Event {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  event_date: string;
  location: string | null;
  created_by: string;
  created_at: string;
  creator?: {
    username: string;
  };
  rsvps?: Array<{
    user_id: string;
    status: string;
    user: {
      username: string;
    };
  }>;
}

export const eventService = {
  async getEvents(familyId: string): Promise<Event[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:user_profiles!created_by(username),
        rsvps:event_rsvps(
          user_id,
          status,
          user:user_profiles(username)
        )
      `)
      .eq('family_id', familyId)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createEvent(eventData: {
    family_id: string;
    title: string;
    description?: string;
    event_type?: string;
    event_date: string;
    location?: string;
    created_by: string;
  }) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(eventId: string, updates: Partial<Event>) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(eventId: string) {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  },

  async rsvpEvent(eventId: string, userId: string, status: 'going' | 'maybe' | 'not_going') {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: userId,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
