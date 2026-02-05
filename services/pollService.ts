// Poll Service - Voting and polls operations
import { getSupabaseClient } from '@/template';

export interface Poll {
  id: string;
  family_id: string;
  question: string;
  is_anonymous: boolean;
  created_by: string;
  created_at: string;
  expires_at: string | null;
  creator?: {
    username: string;
  };
  options?: Array<{
    id: string;
    option_text: string;
    votes?: Array<{
      user_id: string;
      user?: {
        username: string;
      };
    }>;
  }>;
}

export const pollService = {
  async getPolls(familyId: string): Promise<Poll[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        creator:user_profiles!created_by(username),
        options:poll_options(
          id,
          option_text,
          votes:poll_votes(
            user_id,
            user:user_profiles(username)
          )
        )
      `)
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createPoll(pollData: {
    family_id: string;
    question: string;
    options: string[];
    is_anonymous?: boolean;
    created_by: string;
    expires_at?: string;
  }) {
    const supabase = getSupabaseClient();
    
    // Create poll
    const { data: pollDataResult, error: pollError } = await supabase
      .from('polls')
      .insert({
        family_id: pollData.family_id,
        question: pollData.question,
        is_anonymous: pollData.is_anonymous || false,
        created_by: pollData.created_by,
        expires_at: pollData.expires_at || null,
      })
      .select()
      .single();

    if (pollError || !pollDataResult) throw pollError;

    // Create options
    const options = pollData.options.map(option => ({
      poll_id: pollDataResult.id,
      option_text: option,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(options);

    if (optionsError) throw optionsError;

    return pollDataResult;
  },

  async vote(pollId: string, optionId: string, userId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('poll_votes')
      .upsert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
