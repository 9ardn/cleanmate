'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  TWEAK_DEFAULTS,
  SCORE_TO_STATE,
  STATE_TO_SCORE,
  type Tweaks,
  type CharacterPose,
} from '@/lib/constants';
import type { RoomState } from '@/types/app';

interface TweaksContextValue {
  tweaks: Tweaks;
  setState: (state: RoomState) => void;
  setScore: (score: number) => void;
  setPose: (pose: CharacterPose) => void;
  reset: () => void;
}

const TweaksContext = createContext<TweaksContextValue | null>(null);

export function useTweaks(): TweaksContextValue {
  const ctx = useContext(TweaksContext);
  if (!ctx) throw new Error('useTweaks must be used within <TweaksProvider>');
  return ctx;
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);

  const setState = useCallback((state: RoomState) => {
    setTweaks((prev) => ({ ...prev, state, score: STATE_TO_SCORE[state] }));
  }, []);

  const setScore = useCallback((score: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    setTweaks((prev) => ({ ...prev, score: clamped, state: SCORE_TO_STATE(clamped) }));
  }, []);

  const setPose = useCallback((pose: CharacterPose) => {
    setTweaks((prev) => ({ ...prev, pose }));
  }, []);

  const reset = useCallback(() => setTweaks(TWEAK_DEFAULTS), []);

  const value = useMemo<TweaksContextValue>(
    () => ({ tweaks, setState, setScore, setPose, reset }),
    [tweaks, setState, setScore, setPose, reset],
  );

  return <TweaksContext.Provider value={value}>{children}</TweaksContext.Provider>;
}
