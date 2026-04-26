'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TaskIcon } from '@/components/ui/TaskIcon';
import type { TaskKind } from '@/lib/constants';

interface BigStatProps {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}

function BigStat({ label, value, sub, accent }: BigStatProps) {
  return (
    <div
      className="card"
      style={{
        padding: 14,
        background: accent ? 'var(--ink)' : 'var(--bg-paper)',
        color: accent ? 'var(--bg-cream)' : 'var(--ink)',
        borderColor: accent ? 'var(--ink)' : 'var(--line)',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 9,
          opacity: accent ? 0.6 : 1,
          color: accent ? 'inherit' : 'var(--ink-mute)',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        <span className="tabular" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
          {value}
        </span>
        <span style={{ fontSize: 11, opacity: 0.7 }}>{sub}</span>
      </div>
    </div>
  );
}

interface SettingRowProps { label: string; value: string; last?: boolean }
function SettingRow({ label, value, last }: SettingRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px',
        borderBottom: last ? 0 : '1px solid var(--line-soft)',
      }}
    >
      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
        {value}
        <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>›</span>
      </span>
    </div>
  );
}

const TOP_TASKS: { id: TaskKind; name: string; n: number; pct: number }[] = [
  { id: 'floor',   name: '바닥 청소',     n: 42, pct: 100 },
  { id: 'dishes',  name: '설거지',         n: 38, pct:  90 },
  { id: 'trash',   name: '쓰레기 비우기', n: 24, pct:  57 },
  { id: 'laundry', name: '빨래',           n: 18, pct:  43 },
];

const HEAT_COLORS = ['var(--line-soft)', 'var(--moss-soft)', '#A8C490', 'var(--moss)', 'var(--moss-deep)'];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="app-screen">
      <ScreenHeader
        title="프로필"
        subtitle="MEMBER SINCE FEB 2025"
        right={
          <button
            onClick={() => router.push('/settings')}
            aria-label="설정"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-paper)', border: '1px solid var(--line)',
              cursor: 'pointer',
            }}
          >
            ⚙
          </button>
        }
      />

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name="민지" color="#5B8DB8" size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>김민지</div>
            <div
              className="mono"
              style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.04em' }}
            >
              @minji_clean · LV.12
            </div>
            <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
              <span className="chip solid-moss" style={{ padding: '2px 8px', fontSize: 9 }}>방장</span>
              <span className="chip" style={{ padding: '2px 8px', fontSize: 9 }}>14일 스트릭</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/me/house')}
            className="mono"
            style={{
              padding: '6px 10px', borderRadius: 8,
              background: 'var(--bg-cream)', border: '1px solid var(--line)',
              fontSize: 11, cursor: 'pointer',
            }}
          >
            우리 집 →
          </button>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          <BigStat label="총 청소 횟수"         value="186"   sub="회" />
          <BigStat label="누적 포인트"          value="1,240" sub="PT"   accent />
          <BigStat label="평균 인증 통과율"     value="92%"   sub="↑ 4%" />
          <BigStat label="이번 달 시간"         value="4.2"   sub="시간" />
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          <span className="eyebrow">활동 히트맵 · 12주</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
            2026.02 → 2026.04
          </span>
        </div>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            {Array.from({ length: 7 * 12 }, (_, i) => {
              const r = (i * 9173) % 100;
              const lvl = r > 85 ? 4 : r > 65 ? 3 : r > 40 ? 2 : r > 15 ? 1 : 0;
              return <div key={i} style={{ aspectRatio: '1', background: HEAT_COLORS[lvl], borderRadius: 2 }} />;
            })}
          </div>
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>덜함</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {HEAT_COLORS.map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
              ))}
            </div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>많이</span>
          </div>
        </div>

        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>가장 많이 한 청소</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TOP_TASKS.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
              <TaskIcon kind={t.id} size={24} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{t.name}</span>
                  <span className="mono tabular" style={{ color: 'var(--ink-mute)' }}>{t.n}회</span>
                </div>
                <div style={{ height: 4, background: 'var(--line-soft)', borderRadius: 2 }}>
                  <div style={{ width: `${t.pct}%`, height: '100%', background: 'var(--moss)', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>설정</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingRow label="알림"        value="매일 21:00" />
          <SettingRow label="언어"        value="한국어" />
          <SettingRow label="다크 모드"   value="시스템" />
          <SettingRow label="데이터 백업" value="2시간 전" last />
        </div>
      </div>
    </div>
  );
}
