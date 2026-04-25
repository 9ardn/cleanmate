import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Activity } from '@/types/app';

type Client = SupabaseClient<any>;

export async function listActivity(
  supabase: any,
  partyId: string,
  limit = 50
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activity')
    .select('*, actor:profiles!activity_actor_id_fkey(*)')
    .eq('party_id', partyId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Activity[];
}
