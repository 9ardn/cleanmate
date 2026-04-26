import type { RoomState } from '@/types/app';

interface StatusPillProps {
  state: RoomState;
}

const LABELS: Record<RoomState, { ko: string; icon: string; bg: string; fg: string }> = {
  clean:    { ko: '쾌적', icon: '✦', bg: 'var(--moss)',  fg: 'white' },
  ok:       { ko: '양호', icon: '◐', bg: 'var(--gold)',  fg: 'var(--ink)' },
  dirty:    { ko: '주의', icon: '◉', bg: 'var(--terra)', fg: 'white' },
  critical: { ko: '심각', icon: '!', bg: 'var(--berry)', fg: 'white' },
};

export function StatusPill({ state }: StatusPillProps) {
  const s = LABELS[state];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      <span>{s.icon}</span>
      <span>{s.ko}</span>
    </span>
  );
}
