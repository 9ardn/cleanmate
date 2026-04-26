'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

interface HistoryEntry {
  date: string;
  who: string;
  verifier: string;
  status: 'verified' | 'rejected';
  dur: string;
}

const HISTORY: HistoryEntry[] = [
  { date: '04.25', who: '유준', verifier: '민지', status: 'verified', dur: '12분' },
  { date: '04.23', who: '민지', verifier: '유준', status: 'verified', dur: '15분' },
  { date: '04.21', who: '유준', verifier: '민지', status: 'verified', dur: '10분' },
  { date: '04.19', who: '민지', verifier: '유준', status: 'rejected', dur: '8분' },
  { date: '04.17', who: '유준', verifier: '민지', status: 'verified', dur: '14분' },
];

const STATUS_COLOR: Record<string, string> = {
  'verified-me':   'var(--moss)',
  'verified-mate': 'var(--terra)',
  pending:         'var(--line)',
  rejected:        'var(--berry)',
};

export default function TaskDetailPage() {
  const router = useRouter();

  return (
    <div className="app-screen">
      <ScreenHeader title="설거지" subtitle="MUTUAL VERIFICATION · #DISHES" onBack={() => router.back()} />

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Hero */}
        <div
          style={{
            padding: 18,
            background: 'var(--ink)',
            color: 'var(--bg-cream)',
            borderRadius: 'var(--r-lg)',
            marginBottom: 14,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute', right: -20, top: -20,
              width: 120, height: 120, borderRadius: '50%',
              background: 'var(--moss)', opacity: 0.3,
            }}
          />
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.6 }}>NEXT DUE</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }}>오늘 22:00</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, position: 'relative' }}>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>주기</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>매일</div>
            </div>
            <div style={{ width: 1, background: 'rgba(244,247,251,0.2)' }} />
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>당번</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>유준</div>
            </div>
            <div style={{ width: 1, background: 'rgba(244,247,251,0.2)' }} />
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>점수</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>+15 PT</div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
          <StatTile label="이번 주" value="6" sub="회 완료" />
          <StatTile label="평균 시간" value="12" sub="분" />
          <StatTile label="인증 통과율" value="92%" sub="↑ 4%" />
        </div>

        {/* Mini calendar */}
        <div className="eyebrow" style={{ marginBottom: 8 }}>최근 30일</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4, marginBottom: 18 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const r = (i * 7919) % 100;
            const status =
              r > 80 ? 'rejected' : r > 60 ? 'pending' : r > 30 ? 'verified-mate' : 'verified-me';
            return <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: STATUS_COLOR[status] }} />;
          })}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            fontSize: 10,
            color: 'var(--ink-mute)',
            fontFamily: 'var(--font-mono)',
            marginBottom: 18,
          }}
        >
          <span><span className="dot" style={{ background: 'var(--moss)' }} /> 나</span>
          <span><span className="dot" style={{ background: 'var(--terra)' }} /> 룸메</span>
          <span><span className="dot" style={{ background: 'var(--berry)' }} /> 거절</span>
        </div>

        {/* Schedule */}
        <div className="eyebrow" style={{ marginBottom: 8 }}>스케줄 설정</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingRow label="주기"      value="매일" />
          <SettingRow label="시간"      value="저녁 22:00" />
          <SettingRow label="당번 순서" value="민지 ↔ 유준" />
          <SettingRow label="알림"      value="30분 전" last />
        </div>

        {/* History */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>인증 히스토리</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {HISTORY.map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'var(--bg-paper)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--r-sm)',
              }}
            >
              <span className="mono tabular" style={{ fontSize: 11, color: 'var(--ink-mute)', width: 36 }}>
                {h.date}
              </span>
              <Avatar name={h.who} color={h.who === '민지' ? '#5B8DB8' : '#B886D9'} size={20} />
              <span style={{ fontSize: 12 }}>{h.who}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>→</span>
              <Avatar name={h.verifier} color={h.verifier === '민지' ? '#5B8DB8' : '#B886D9'} size={20} />
              <span style={{ flex: 1, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>
                {h.dur}
              </span>
              {h.status === 'verified' ? (
                <span className="chip solid-moss" style={{ padding: '2px 8px', fontSize: 9 }}>승인</span>
              ) : (
                <span
                  className="chip"
                  style={{
                    background: 'var(--berry)',
                    color: 'white',
                    borderColor: 'var(--berry)',
                    padding: '2px 8px',
                    fontSize: 9,
                  }}
                >
                  거절
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatTileProps { label: string; value: string; sub: string }
function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2 }}>{sub}</div>
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
