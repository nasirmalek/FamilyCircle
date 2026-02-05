// Trip Service - Trip planning operations
import { getSupabaseClient } from '@/template';

export interface Trip {
  id: string;
  family_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  created_by: string;
  created_at: string;
  creator?: {
    username: string;
  };
  participants?: Array<{
    user_id: string;
    user: {
      username: string;
    };
  }>;
  itineraries?: Array<{
    id: string;
    day_number: number;
    activities: any[];
    notes: string | null;
  }>;
}

export const tripService = {
  async getTrips(familyId: string): Promise<Trip[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        creator:user_profiles!created_by(username),
        participants:trip_participants(
          user_id,
          user:user_profiles(username)
        ),
        itineraries(*)
      `)
      .eq('family_id', familyId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createTrip(tripData: {
    family_id: string;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    budget?: number;
    created_by: string;
  }) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('trips')
      .insert(tripData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async joinTrip(tripId: string, userId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('trip_participants')
      .insert({
        trip_id: tripId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addItinerary(tripId: string, dayNumber: number, activities: any[], notes?: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        trip_id: tripId,
        day_number: dayNumber,
        activities,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
