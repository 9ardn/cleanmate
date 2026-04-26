import type { RoomState } from '@/types/app';

interface CleanlinessBarProps {
  value: number;
  state: RoomState;
  label?: boolean;
}

const STATE_COLOR: Record<RoomState, string> = {
  clean:    'var(--state-clean)',
  ok:       'var(--state-ok)',
  dirty:    'var(--state-dirty)',
  critical: 'var(--state-critical)',
};

export function CleanlinessBar({ value, state, label = true }: CleanlinessBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="eyebrow">청결도</span>
          <span className="mono tabular" style={{ fontSize: 13, fontWeight: 600 }}>
            {Math.round(value)}
            <span style={{ color: 'var(--ink-mute)' }}>/100</span>
          </span>
        </div>
      )}
      <div className="progress" style={{ height: 10 }}>
        <div className="fill" style={{ width: `${value}%`, background: STATE_COLOR[state] }} />
      </div>
    </div>
  );
}
