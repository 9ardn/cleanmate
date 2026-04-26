'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

interface Member {
  name: string;
  color: string;
  role: '방장' | '멤버';
  pts: number;
  online: boolean;
}

const MEMBERS: Member[] = [
  { name: '민지', color: '#5B8DB8', role: '방장', pts: 1240, online: true },
  { name: '유준', color: '#B886D9', role: '멤버', pts: 1095, online: true },
  { name: '서윤', color: '#87C4DC', role: '멤버', pts:  920, online: false },
];

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

interface Activity { who: string; act: string; t: string; icon: string; c: string }

const ACTIVITY: Activity[] = [
  { who: '유준', act: '설거지 인증을 요청했어요',  t: '8분',  icon: '◉', c: 'var(--terra)' },
  { who: '민지', act: '바닥 청소 +20PT 획득',       t: '2시간', icon: '✦', c: 'var(--moss)' },
  { who: '서윤', act: '욕실 청소 인증을 거절했어요', t: '5시간', icon: '✕', c: 'var(--berry)' },
  { who: '유준', act: '14일 스트릭 달성!',           t: '1일',  icon: '🔥', c: 'var(--gold)' },
];

export default function PartyPage() {
  const router = useRouter();

  return (
    <div className="app-screen">
      <ScreenHeader
        title="우리 집"
        subtitle="HOUSE #4821 · 개봉동 메이트하우스"
        onBack={() => router.back()}
        right={
          <button
            aria-label="더보기"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-paper)', border: '1px solid var(--line)',
              cursor: 'pointer',
            }}
          >
            ⋯
          </button>
        }
      />

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--r-lg)',
            background: 'linear-gradient(135deg, var(--moss) 0%, var(--moss-deep) 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -30, bottom: -30, width: 140, height: 140 }}>
            <svg viewBox="0 0 140 140">
              <polygon points="70,10 130,55 110,130 30,130 10,55" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>
          <div className="mono" style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.1em' }}>
            HOUSE LEVEL · LV.7
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em' }}>
            개봉동 메이트하우스
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.08em' }}>총점</div>
              <div className="tabular" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>3,255</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.08em' }}>달성률</div>
              <div className="tabular" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>87%</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.08em' }}>구성원</div>
              <div className="tabular" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>3명</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 10, marginBottom: 4, opacity: 0.85,
              }}
            >
              <span className="mono">LV.7 → LV.8</span>
              <span className="mono tabular">3255 / 4000</span>
            </div>
            <div
              style={{
                height: 6,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div style={{ width: '81%', height: '100%', background: 'var(--gold)', borderRadius: 999 }} />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <span className="eyebrow">구성원 · {MEMBERS.length}</span>
          <button
            onClick={() => router.push('/onboarding')}
            style={{
              background: 'none',
              border: 0,
              color: 'var(--moss-deep)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + 초대
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'var(--bg-paper)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--r-md)',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Avatar name={m.name} color={m.color} size={40} />
                {m.online && (
                  <div
                    style={{
                      position: 'absolute',
                      right: -1,
                      bottom: -1,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--moss)',
                      border: '2px solid var(--bg-paper)',
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span>
                  {m.role === '방장' && (
                    <span className="chip solid-terra" style={{ padding: '1px 6px', fontSize: 9 }}>
                      방장
                    </span>
                  )}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--ink-mute)',
                    letterSpacing: '0.04em',
                    marginTop: 2,
                  }}
                >
                  {m.online ? '온라인' : '3시간 전 접속'} · {m.pts}pt
                </div>
              </div>
              <button
                aria-label="멤버 상세"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'transparent', border: 0,
                  cursor: 'pointer', color: 'var(--ink-mute)',
                }}
              >
                ›
              </button>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>하우스 규칙</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingRow label="당번 자동 로테이션" value="ON" />
          <SettingRow label="포인트 곱연산"      value="× 1.0" />
          <SettingRow label="자동 인증 만료"     value="24시간" />
          <SettingRow label="셀프 인증 허용"     value="OFF (권장)" last />
        </div>

        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>최근 활동</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: a.c, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                }}
              >
                {a.icon}
              </div>
              <div style={{ flex: 1, fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>{a.who}</span>
                <span style={{ color: 'var(--ink-soft)' }}>이 {a.act}</span>
              </div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
