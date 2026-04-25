import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Party } from '@/types/app';

type Client = SupabaseClient<any>;

/**
 * Gets the primary party for the current user.
 * For MVP: returns the first party the user is a member of.
 * For multi-party support: extend this to accept a party_id.
 */
export async function getMyParty(supabase: any): Promise<Party | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('party_members')
    .select('parties:parties!party_members_party_id_fkey(*)')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (error || !data) return null;
  return (data as unknown as { parties: Party }).parties;
}

export async function joinPartyByInviteCode(
  supabase: any,
  inviteCode: string
): Promise<string> {
  const { data, error } = await supabase.rpc('join_party', {
    p_invite_code: inviteCode.toUpperCase(),
  });
  if (error) throw error;
  return data as string;
}

export async function getPartyByInviteCode(
  supabase: any,
  inviteCode: string
): Promise<Party | null> {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();
  if (error) return null;
  return data as Party;
}
