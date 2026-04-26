'use client';

import {
  createContext, useContext, useEffect, useState, useCallback, useMemo,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { getMyProfile, getPartyMemberProfiles } from '@/lib/db/profile';
import { getMyParty } from '@/lib/db/party';
import { listTasks } from '@/lib/db/tasks';
import { listPartyVerifications } from '@/lib/db/verifications';
import { listActivity } from '@/lib/db/activity';
import { listPartyScores } from '@/lib/db/scores';
import { getStreak } from '@/lib/db/streaks';
import { getMyBadges } from '@/lib/db/badges';
import { getMyNotificationSettings } from '@/lib/db/notifications';
import { getMyTotals } from '@/lib/db/user_totals';
import type {
  Profile, Party, Task, Verification, Activity,
  Score, Streak, UserBadge, NotificationSettings, UserTotals,
} from '@/types/app';

export interface AppData {
  userId: string;
  profile: Profile;
  party: Party;
  members: Profile[];
  tasks: Task[];
  verifications: Verification[];
  activity: Activity[];
  scores: Score[];
  streak: Streak | null;
  badges: UserBadge[];
  notifications: NotificationSettings | null;
  totals: UserTotals | null;
}

interface AppDataContextValue {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  saving: boolean;
  toast: string | null;
  apiError: string | null;
  showToast: (msg: string) => void;
  withSaving: (fn: () => Promise<void>) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요해요');

      const profile = await getMyProfile(supabase);
      if (!profile) throw new Error('프로필을 찾을 수 없어요');

      const party = await getMyParty(supabase);
      if (!party) throw new Error('파티를 찾을 수 없어요');

      const [
        members, tasks, verifications, activity, scores, streak, badges, notifications, totals,
      ] = await Promise.all([
        getPartyMemberProfiles(supabase, party.id),
        listTasks(supabase, party.id),
        listPartyVerifications(supabase, party.id),
        listActivity(supabase, party.id),
        listPartyScores(supabase, party.id),
        getStreak(supabase, party.id),
        getMyBadges(supabase),
        getMyNotificationSettings(supabase),
        getMyTotals(supabase),
      ]);

      setData({
        userId: user.id,
        profile,
        party,
        members,
        tasks,
        verifications,
        activity,
        scores,
        streak,
        badges,
        notifications,
        totals,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: re-fetch when verifications change in the current party.
  // INSERTs surface new pending requests in the inbox badge instantly,
  // UPDATEs (approved/rejected) refresh score/streak/activity in the home view.
  useEffect(() => {
    const partyId = data?.party.id;
    if (!partyId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`verifications:${partyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'verifications',
          filter: `party_id=eq.${partyId}`,
        },
        () => { load(); },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.party.id, load]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const withSaving = useCallback(async (fn: () => Promise<void>) => {
    setSaving(true);
    setApiError(null);
    try { await fn(); }
    catch (e) {
      setApiError((e as Error).message);
      setTimeout(() => setApiError(null), 3500);
    } finally { setSaving(false); }
  }, []);

  const value = useMemo<AppDataContextValue>(() => ({
    data, loading, error, reload: load,
    saving, toast, apiError, showToast, withSaving,
  }), [data, loading, error, load, saving, toast, apiError, showToast, withSaving]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
