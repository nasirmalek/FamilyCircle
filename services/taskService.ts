// Task Service - Task management operations
import { getSupabaseClient } from '@/template';

export interface Task {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_by: string;
  created_at: string;
  assignee?: {
    username: string;
  };
  creator?: {
    username: string;
  };
}

export const taskService = {
  async getTasks(familyId: string): Promise<Task[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:user_profiles!assigned_to(username),
        creator:user_profiles!created_by(username)
      `)
      .eq('family_id', familyId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createTask(taskData: {
    family_id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
    created_by: string;
  }) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTaskStatus(taskId: string, status: 'pending' | 'in_progress' | 'completed') {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(taskId: string) {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  },
};
