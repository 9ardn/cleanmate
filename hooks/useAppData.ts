'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Score, Streak, UserBadge, NotificationSettings, UserTotals
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

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        members, tasks, verifications, activity, scores, streak, badges, notifications, totals
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

  return { data, loading, error, reload: load };
}
