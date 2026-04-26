import type { BadgeDefinition, RoomState } from '@/types/app';

export const DAY_MS = 24 * 60 * 60 * 1000;

// ============================================================
// CleanMate pixel-art design system (cool sky / lavender)
// ------------------------------------------------------------
// Mirrored verbatim from claeanmate_ui prototype. Drives the
// IsometricRoom and all pixel furniture sprites.
// ============================================================
export const STATE_LABELS: Record<RoomState, { ko: string; en: string; score: number; color: string }> = {
  clean:    { ko: '쾌적', en: 'PRISTINE', score: 95, color: 'var(--state-clean)' },
  ok:       { ko: '양호', en: 'STEADY',   score: 70, color: 'var(--state-ok)' },
  dirty:    { ko: '주의', en: 'MESSY',    score: 38, color: 'var(--state-dirty)' },
  critical: { ko: '심각', en: 'CHAOS',    score: 12, color: 'var(--state-critical)' },
};

export interface RoomPalette {
  wall: string; wallShade: string; wallDark: string;
  floor: string; floorDark: string; sky: string; sun: string;
}

export const PALETTE: Record<RoomState, RoomPalette> = {
  clean:    { wall: '#A8C8E0', wallShade: '#7FA9C8', wallDark: '#5B8DB8', floor: '#D8C8B0', floorDark: '#A89880', sky: '#C5DCEC', sun: '#F2C94C' },
  ok:       { wall: '#9BBAD0', wallShade: '#7298B5', wallDark: '#52819F', floor: '#C9B89F', floorDark: '#998870', sky: '#B8CFDF', sun: '#E0B940' },
  dirty:    { wall: '#7A95AC', wallShade: '#5B7A93', wallDark: '#42627B', floor: '#A8987F', floorDark: '#7A6E58', sky: '#8B9EAE', sun: '#B8965A' },
  critical: { wall: '#4F5F75', wallShade: '#384458', wallDark: '#28324A', floor: '#7A6E55', floorDark: '#544A38', sky: '#3D4A5F', sun: '#6B5A40' },
};

export type CharacterPose = 'idle' | 'cleaning' | 'wave';

export interface Tweaks {
  state: RoomState;
  score: number;
  pose: CharacterPose;
  theme: 'warm' | 'cool';
}

export const TWEAK_DEFAULTS: Tweaks = {
  state: 'ok',
  score: 70,
  pose: 'idle',
  theme: 'cool',
};

export const SCORE_TO_STATE = (score: number): RoomState => {
  if (score < 25) return 'critical';
  if (score < 50) return 'dirty';
  if (score < 80) return 'ok';
  return 'clean';
};

export const STATE_TO_SCORE: Record<RoomState, number> = {
  clean: 92,
  ok: 70,
  dirty: 38,
  critical: 12,
};

// Task icon kinds rendered by <TaskIcon />
export type TaskKind = 'floor' | 'dishes' | 'trash' | 'laundry' | 'bath' | 'bed' | 'desk' | 'window' | 'fridge';

// ============================================================
// Theme tokens for room states
// ============================================================
export const THEME = {
  clean: {
    wall: '#F3E4CC', wallTop: '#F8EDDB',
    floor: '#C89C6E', floorShadow: '#A67C52',
    accent: '#D4824A', accentDark: '#A35A2B',
    text: '#3D2817', particle: '#F5D98A',
    mood: '맑음', moodEmoji: '☀️',
  },
  ok: {
    wall: '#E5D5BC', wallTop: '#ECDEC7',
    floor: '#9C7855', floorShadow: '#7A5C3E',
    accent: '#8B6F4E', accentDark: '#5C4A33',
    text: '#3D2817', particle: '#B8A586',
    mood: '흐림', moodEmoji: '⛅',
  },
  dirty: {
    wall: '#8B7560', wallTop: '#9E8770',
    floor: '#5C4433', floorShadow: '#3D2B1E',
    accent: '#C46E52', accentDark: '#8B3A20',
    text: '#F5E6D3', particle: '#6B5441',
    mood: '비', moodEmoji: '🌧️',
  },
  critical: {
    wall: '#3D2B1E', wallTop: '#4A3626',
    floor: '#251810', floorShadow: '#0F0905',
    accent: '#D4736A', accentDark: '#8B3A3A',
    text: '#F5D5D5', particle: '#4A3626',
    mood: '천둥번개', moodEmoji: '⛈️',
  },
} as const;

// ============================================================
// UI option sets
// ============================================================
export const AVATAR_EMOJIS = [
  '🐻', '🐰', '🐱', '🐶', '🦊', '🐼', '🐨', '🦁',
  '🐯', '🐵', '🐸', '🦉', '🦄', '🐧', '🐙', '🦦',
];

export const TASK_EMOJIS = [
  '🍽️', '🚿', '🧹', '👕', '♻️', '🛏️', '🪴', '🗑️',
  '🧽', '🪟', '🧺', '🚪', '🧼', '🍳', '🪑', '📚',
];

export const CYCLE_OPTIONS = [
  { value: 1, label: '매일' },
  { value: 2, label: '이틀마다' },
  { value: 3, label: '3일마다' },
  { value: 5, label: '5일마다' },
  { value: 7, label: '매주' },
  { value: 14, label: '격주' },
  { value: 30, label: '매월' },
] as const;

export const WEIGHT_OPTIONS = [
  { value: 5, label: '낮음' },
  { value: 10, label: '보통' },
  { value: 15, label: '높음' },
] as const;

export const REJECT_REASONS = [
  '아직 덜 된 것 같아요',
  '사진이 잘 안 보여요',
  '다른 부분도 해줘요',
  '직접 말할게요',
] as const;

// ============================================================
// Level system
// ============================================================
export const LEVEL_THRESHOLDS = [0, 50, 150, 350, 700, 1500, 3000, 5000];
export const LEVEL_TITLES = [
  '청소 새싹', '청소 초보', '청소 견습', '청소 숙련',
  '청소 전문가', '청소 마스터', '청소 전설', '청소의 신',
];

// ============================================================
// Badges
// ============================================================
export const BADGES: BadgeDefinition[] = [
  { id: 'first_request',   icon: '🌱', name: '첫 걸음',        desc: '처음으로 인증 요청 보냄' },
  { id: 'first_approval',  icon: '🤝', name: '첫 협력',        desc: '파트너 인증을 처음 승인함' },
  { id: 'streak_7',        icon: '🔥', name: '일주일 전사',    desc: '7일 스트릭 달성' },
  { id: 'streak_30',       icon: '🏆', name: '한 달의 약속',    desc: '30일 스트릭 달성' },
  { id: 'cleanings_10',    icon: '⭐', name: '꾸준함의 시작',  desc: '인증 10회 완료' },
  { id: 'cleanings_50',    icon: '💯', name: '청소 익스퍼트',  desc: '인증 50회 완료' },
  { id: 'perfect_clean',   icon: '✨', name: '완벽주의자',     desc: '청결도 100 달성' },
  { id: 'late_night',      icon: '🌙', name: '야행성 청소러',  desc: '0-6시 사이 인증' },
];
