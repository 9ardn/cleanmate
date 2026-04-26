'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

interface Rank {
  rank: number;
  name: string;
  pts: number;
  streak: number;
  color: string;
  delta: string;
  me?: boolean;
}

const RANKS: Rank[] = [
  { rank: 1, name: '민지', pts: 1240, streak: 14, color: '#5B8DB8', delta: '+85', me: true },
  { rank: 2, name: '유준', pts: 1095, streak:  9, color: '#B886D9', delta: '+62' },
  { rank: 3, name: '서윤', pts:  920, streak:  6, color: '#87C4DC', delta: '+44' },
  { rank: 4, name: '도현', pts:  685, streak:  3, color: '#B886D9', delta: '+12' },
];

const TABS = [
  { id: 'week',  label: '이번 주' },
  { id: 'month', label: '이번 달' },
  { id: 'all',   label: '전체' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface Achievement {
  name: string;
  desc: string;
  icon: string;
  color: string;
  locked?: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { name: '아침형 인간',   desc: '7일 연속 오전 청소', icon: '☀', color: 'var(--gold)' },
  { name: '먼지 헌터',     desc: '바닥 30회',           icon: '✦', color: 'var(--moss)' },
  { name: '인증 마스터',   desc: '거절 0회',            icon: '◉', color: 'var(--terra)' },
  { name: '룸메 베스트',   desc: '4주 연속 1위',        icon: '★', color: 'var(--berry)', locked: true },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<TabId>('week');

  return (
    <div className="app-screen">
      <ScreenHeader title="리더보드" subtitle="HOUSE 2025 · WEEK 17" />

      <div style={{ padding: '0 18px 14px', display: 'flex', gap: 6, flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              background: tab === t.id ? 'var(--ink)' : 'var(--bg-paper)',
              color: tab === t.id ? 'var(--bg-cream)' : 'var(--ink-soft)',
              border: '1px solid ' + (tab === t.id ? 'var(--ink)' : 'var(--line)'),
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Podium */}
        <div
          style={{
            background: 'var(--ink)',
            color: 'var(--bg-cream)',
            borderRadius: 'var(--r-lg)',
            padding: '20px 16px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute', right: -10, top: -10,
              width: 80, height: 80,
              background: 'var(--moss)',
              transform: 'rotate(45deg)',
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: 'absolute', left: -20, bottom: -20,
              width: 60, height: 60,
              background: 'var(--terra)',
              transform: 'rotate(45deg)',
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              gap: 8,
            }}
          >
            <PodiumCol r={RANKS[1]} h={70} medal="🥈" />
            <PodiumCol r={RANKS[0]} h={100} medal="🥇" featured />
            <PodiumCol r={RANKS[2]} h={50} medal="🥉" />
          </div>
        </div>

        {/* Streak summary */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div
            className="card"
            style={{ background: 'var(--moss)', color: 'white', borderColor: 'var(--moss-deep)' }}
          >
            <div className="mono" style={{ fontSize: 9, opacity: 0.8, letterSpacing: '0.08em' }}>
              나의 스트릭
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span className="tabular" style={{ fontSize: 28, fontWeight: 700 }}>14</span>
              <span style={{ fontSize: 12 }}>일 🔥</span>
            </div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>최고 기록 · 22일</div>
          </div>
          <div
            className="card"
            style={{ background: 'var(--terra)', color: 'white', borderColor: 'var(--terra-deep)' }}
          >
            <div className="mono" style={{ fontSize: 9, opacity: 0.8, letterSpacing: '0.08em' }}>
              이번 주 격차
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span className="tabular" style={{ fontSize: 28, fontWeight: 700 }}>+145</span>
              <span style={{ fontSize: 12 }}>PT</span>
            </div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>유준 대비 우위 ↑</div>
          </div>
        </div>

        {/* Full list */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>전체 순위 · 우리 집</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {RANKS.map((r) => (
            <div
              key={r.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 'var(--r-md)',
                background: r.me ? 'var(--moss-soft)' : 'var(--bg-paper)',
                border: '1px solid ' + (r.me ? 'var(--moss)' : 'var(--line-soft)'),
              }}
            >
              <div
                className="mono tabular"
                style={{
                  width: 22,
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                  color: r.rank === 1 ? 'var(--gold)' : 'var(--ink-soft)',
                }}
              >
                {r.rank}
              </div>
              <Avatar name={r.name} color={r.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.name}{' '}
                  {r.me && <span className="chip solid-ink" style={{ padding: '1px 6px', fontSize: 9 }}>나</span>}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.04em', marginTop: 2 }}
                >
                  스트릭 {r.streak}일 · 이번 주 {r.delta}
                </div>
              </div>
              <div className="mono tabular" style={{ fontSize: 16, fontWeight: 700 }}>
                {r.pts}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>이번 주 업적</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={i}
              className="card"
              style={{ minWidth: 110, padding: 12, opacity: a.locked ? 0.4 : 1, position: 'relative' }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: a.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                {a.icon}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{a.name}</div>
              <div
                className="mono"
                style={{ fontSize: 9, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.02em' }}
              >
                {a.desc}
              </div>
              {a.locked && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 12 }}>🔒</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PodiumColProps {
  r: Rank;
  h: number;
  medal: string;
  featured?: boolean;
}

function PodiumCol({ r, h, medal, featured }: PodiumColProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{ fontSize: 18 }}>{medal}</div>
      <Avatar name={r.name} color={r.color} size={featured ? 48 : 36} ring={featured} />
      <div style={{ fontSize: featured ? 13 : 11, fontWeight: 600, color: 'var(--bg-cream)' }}>{r.name}</div>
      <div
        className="mono tabular"
        style={{
          fontSize: featured ? 16 : 12,
          fontWeight: 700,
          color: featured ? 'var(--gold)' : 'var(--bg-cream)',
        }}
      >
        {r.pts}
      </div>
      <div
        style={{
          width: '100%',
          height: h,
          background: featured ? 'var(--moss)' : 'var(--terra)',
          borderRadius: '4px 4px 0 0',
          marginTop: 4,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 4,
          color: 'white',
          fontWeight: 700,
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {r.rank}
      </div>
    </div>
  );
}
