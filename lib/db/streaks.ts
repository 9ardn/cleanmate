import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Streak } from '@/types/app';

type Client = SupabaseClient<any>;

export async function getStreak(supabase: any, partyId: string): Promise<Streak | null> {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('party_id', partyId)
    .single();
  if (error) return null;
  return data as Streak;
}
