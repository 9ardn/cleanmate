import type { ReactNode } from 'react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  return (
    <div
      style={{
        padding: '14px 18px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}
    >
      {onBack !== undefined && (
        <button
          onClick={onBack}
          aria-label="뒤로"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--bg-paper)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16, color: 'var(--ink)',
            flexShrink: 0,
          }}
        >
          ←
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: 11, color: 'var(--ink-mute)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}
