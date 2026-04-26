'use client';

import { useMemo } from 'react';
import { useAppData } from './AppDataProvider';
import { calculateScore, getStateFromScore } from '@/lib/domain/score';
import { THEME } from '@/lib/constants';
import type { RoomState } from '@/types/app';

export interface AppTheme {
  score: number;
  state: RoomState;
  t: typeof THEME[RoomState];
  bgOuter: string;
  bgInner: string;
  cardBg: string;
  inputBg: string;
}

export function useAppTheme(): AppTheme {
  const { data } = useAppData();
  return useMemo(() => {
    const score = calculateScore(data?.tasks ?? []);
    const state = getStateFromScore(score);
    const t = THEME[state];
    const bgOuter = state === 'critical' ? '#1A0F08' : state === 'dirty' ? '#5C4433' : '#F5EDE0';
    const bgInner = state === 'critical' ? '#241812' : state === 'dirty' ? '#4F3828' : '#FAF4EB';
    const cardBg = state === 'critical' || state === 'dirty' ? 'rgba(255, 251, 245, 0.08)' : '#FFFBF5';
    const inputBg = cardBg;
    return { score, state, t, bgOuter, bgInner, cardBg, inputBg };
  }, [data?.tasks, data]);
}
