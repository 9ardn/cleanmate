-- ============================================================
-- Migration 0001 — Re-target FKs from auth.users to public.profiles
-- ============================================================
-- Reason: PostgREST embed queries (e.g. `profiles!party_members_user_id_fkey(*)`)
-- need the FK to point at public.profiles. Originally these FKs targeted
-- auth.users, so PostgREST returned 400 with
-- "Could not find a relationship between 'X' and 'profiles' in the schema cache".
--
-- Since public.profiles.id is itself a 1:1 FK to auth.users.id, retargeting
-- preserves the cascade chain: deleting an auth user cascades to profiles,
-- which cascades through these new FKs. No data integrity loss.
--
-- Run this once in Supabase SQL Editor.
-- ============================================================

alter table public.party_members
  drop constraint if exists party_members_user_id_fkey;
alter table public.party_members
  add constraint party_members_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.verifications
  drop constraint if exists verifications_requested_by_fkey;
alter table public.verifications
  add constraint verifications_requested_by_fkey
  foreign key (requested_by) references public.profiles(id) on delete cascade;

alter table public.activity
  drop constraint if exists activity_actor_id_fkey;
alter table public.activity
  add constraint activity_actor_id_fkey
  foreign key (actor_id) references public.profiles(id) on delete set null;

-- Tell PostgREST to refresh its schema cache so the new relationships are picked up
notify pgrst, 'reload schema';
