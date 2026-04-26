'use client';

import { useSearchParams } from 'next/navigation';
import { useTweaks } from '@/app/(app)/_components/TweaksProvider';
import type { RoomState } from '@/types/app';
import type { CharacterPose } from '@/lib/constants';

const STATE_OPTIONS: { value: RoomState; label: string }[] = [
  { value: 'clean',    label: '쾌적' },
  { value: 'ok',       label: '양호' },
  { value: 'dirty',    label: '주의' },
  { value: 'critical', label: '심각' },
];

const POSE_OPTIONS: { value: CharacterPose; label: string }[] = [
  { value: 'idle',     label: '기본' },
  { value: 'cleaning', label: '청소 중' },
  { value: 'wave',     label: '인사' },
];

export function TweaksPanel() {
  const params = useSearchParams();
  const enabled = params.get('debug') === '1';
  const { tweaks, setState, setScore, setPose } = useTweaks();

  if (!enabled) return null;

  return (
    <div
      className="mono"
      style={{
        position: 'fixed',
        right: 12,
        bottom: 96,
        zIndex: 60,
        width: 240,
        padding: 12,
        borderRadius: 12,
        background: 'rgba(31, 40, 64, 0.92)',
        color: '#F4F7FB',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize: 11,
        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.75 }}>
        CleanMate Tweaks
      </div>

      <Section label="청결도 상태">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {STATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setState(opt.value)}
              style={{
                padding: '6px 4px',
                borderRadius: 6,
                background: tweaks.state === opt.value ? 'var(--moss)' : 'rgba(255,255,255,0.06)',
                color: '#F4F7FB',
                border: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 11,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section label={`청결도 점수 · ${tweaks.score}`}>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={tweaks.score}
          onChange={(e) => setScore(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </Section>

      <Section label="캐릭터 포즈">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {POSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPose(opt.value)}
              style={{
                padding: '6px 4px',
                borderRadius: 6,
                background: tweaks.pose === opt.value ? 'var(--terra)' : 'rgba(255,255,255,0.06)',
                color: '#F4F7FB',
                border: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 11,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ opacity: 0.6, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}
