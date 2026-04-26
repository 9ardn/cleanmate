'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { CleanlinessBar } from '@/components/ui/CleanlinessBar';
import { StatusPill } from '@/components/ui/StatusPill';
import { TaskIcon } from '@/components/ui/TaskIcon';
import { IsometricRoom } from '@/components/room/IsometricRoom';
import { useTweaks } from './_components/TweaksProvider';
import type { TaskKind } from '@/lib/constants';

interface TodayTask {
  id: TaskKind;
  name: string;
  who: string;
  due: string;
  priority: 'high' | 'mid' | 'low';
}

const TODAY: TodayTask[] = [
  { id: 'floor',  name: '바닥 청소',     who: '나',   due: '오늘', priority: 'high' },
  { id: 'dishes', name: '설거지',         who: '룸메', due: '오늘', priority: 'high' },
  { id: 'trash',  name: '쓰레기 비우기', who: '나',   due: '내일', priority: 'mid' },
];

export default function HomePage() {
  const router = useRouter();
  const { tweaks } = useTweaks();
  const { state, score, pose } = tweaks;

  return (
    <div className="app-screen">
      <div
        style={{
          padding: '14px 18px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          zIndex: 10,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name="민지" color="#5B8DB8" size={32} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>민지의 방</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>
              WED · APR 26
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusPill state={state} />
          <button
            onClick={() => router.push('/settings')}
            aria-label="설정"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--bg-paper)', border: '1px solid var(--line)',
              cursor: 'pointer',
            }}
          >
            ⚙
          </button>
        </div>
      </div>

      <div style={{ flex: '0 0 360px', position: 'relative', overflow: 'hidden' }}>
        <IsometricRoom state={state} pose={pose} scale={1.0} />
        <div
          style={{
            position: 'absolute', top: 10, right: 14, zIndex: 5,
            background: 'rgba(244, 247, 251, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '4px 8px 4px 4px',
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontFamily: 'var(--font-mono)',
          }}
        >
          <Avatar name="유준" color="#B886D9" size={20} />
          <span>유준 · 2h ago</span>
        </div>
      </div>

      <div
        className="scroll-y"
        style={{
          flex: 1,
          padding: '16px 18px 100px',
          background: 'var(--bg-paper)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div>
            <div className="eyebrow">우리 집 청결도</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span
                className="mono tabular"
                style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                {Math.round(score)}
              </span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>/100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>
              STREAK
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
              <span className="mono tabular" style={{ fontSize: 22, fontWeight: 700 }}>14</span>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>일</span>
              <span style={{ fontSize: 16, marginLeft: 2 }}>🔥</span>
            </div>
          </div>
        </div>
        <CleanlinessBar value={score} state={state} label={false} />

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <div className="eyebrow">오늘의 할 일 · {TODAY.length}</div>
          <button
            onClick={() => router.push('/tasks')}
            className="mono"
            style={{
              background: 'none',
              border: 0,
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.04em',
            }}
          >
            전체 보기 →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TODAY.map((t) => (
            <button
              key={t.id}
              onClick={() => router.push(`/tasks/${t.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'var(--bg-cream)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--r-md)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <TaskIcon kind={t.id} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--ink-mute)',
                    letterSpacing: '0.04em',
                    marginTop: 2,
                  }}
                >
                  {t.who} · {t.due}
                </div>
              </div>
              {t.priority === 'high' && <span className="dot dirty" />}
              <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>›</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/inbox')}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '14px 18px',
            background: 'var(--ink)',
            color: 'var(--bg-cream)',
            border: 0,
            borderRadius: 'var(--r-md)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--terra)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}
            >
              ◉
            </span>
            <span>청소 인증하기</span>
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>+15 PT</span>
        </button>
      </div>
    </div>
  );
}
