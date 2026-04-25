import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Profile } from '@/types/app';

type Client = SupabaseClient<any>;

export async function getMyProfile(supabase: any): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) return null;
  return data as Profile;
}

export async function updateMyProfile(
  supabase: any,
  updates: { name?: string; emoji?: string; onboarded?: boolean }
): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getPartyMemberProfiles(
  supabase: any,
  partyId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('party_members')
    .select('user_id, profiles:profiles!party_members_user_id_fkey(*)')
    .eq('party_id', partyId);

  if (error) throw error;
  return (data ?? [])
    .map((r: { profiles: Profile | null }) => r.profiles)
    .filter((p: Profile | null): p is Profile => p !== null);
}
