import type { ReactNode } from 'react';
import type { TaskKind } from '@/lib/constants';

interface TaskIconProps {
  kind: TaskKind | string;
  size?: number;
}

interface IconDef { bg: string; shape: ReactNode }

const ICONS: Record<string, IconDef> = {
  floor: {
    bg: '#7BA05B',
    shape: (
      <>
        <rect x="6" y="14" width="16" height="2" fill="white" />
        <path d="M 14 4 L 14 14" stroke="white" strokeWidth="2" />
        <circle cx="14" cy="4" r="2" fill="white" />
      </>
    ),
  },
  dishes: {
    bg: '#8FAFC2',
    shape: (
      <>
        <circle cx="14" cy="14" r="8" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="14" cy="14" r="3" fill="white" />
      </>
    ),
  },
  trash: {
    bg: '#B85450',
    shape: (
      <>
        <rect x="7" y="9" width="14" height="13" rx="1" fill="none" stroke="white" strokeWidth="2" />
        <rect x="5" y="6" width="18" height="3" fill="white" />
        <rect x="11" y="4" width="6" height="2" fill="white" />
      </>
    ),
  },
  laundry: {
    bg: '#C9A0DC',
    shape: (
      <>
        <rect x="6" y="6" width="16" height="16" rx="2" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="14" cy="14" r="4" fill="white" />
      </>
    ),
  },
  bath: {
    bg: '#A8DADC',
    shape: (
      <>
        <path d="M 5 14 L 23 14 L 21 21 L 7 21 Z" fill="white" />
        <path d="M 9 14 L 9 7 Q 9 5 11 5" stroke="white" strokeWidth="2" fill="none" />
      </>
    ),
  },
  bed: {
    bg: '#E8965A',
    shape: (
      <>
        <rect x="5" y="14" width="18" height="6" rx="1" fill="white" />
        <rect x="7" y="10" width="6" height="4" rx="1" fill="white" />
      </>
    ),
  },
  desk: {
    bg: '#E8B84F',
    shape: (
      <>
        <rect x="5" y="10" width="18" height="3" fill="white" />
        <rect x="7" y="13" width="2" height="9" fill="white" />
        <rect x="19" y="13" width="2" height="9" fill="white" />
      </>
    ),
  },
  window: {
    bg: '#5E7E42',
    shape: (
      <>
        <rect x="6" y="6" width="16" height="16" fill="none" stroke="white" strokeWidth="2" />
        <path d="M 14 6 L 14 22 M 6 14 L 22 14" stroke="white" strokeWidth="2" />
      </>
    ),
  },
  fridge: {
    bg: '#3D4F6B',
    shape: (
      <>
        <rect x="8" y="4" width="12" height="20" rx="1" fill="none" stroke="white" strokeWidth="2" />
        <path d="M 8 12 L 20 12" stroke="white" strokeWidth="2" />
        <rect x="17" y="7" width="1.5" height="3" fill="white" />
      </>
    ),
  },
};

export function TaskIcon({ kind, size = 28 }: TaskIconProps) {
  const def = ICONS[kind] ?? ICONS.floor;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 8,
        background: def.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 28 28">
        {def.shape}
      </svg>
    </div>
  );
}
