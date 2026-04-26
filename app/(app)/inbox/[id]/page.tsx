'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PhotoCard } from '@/components/ui/PhotoCard';

type Vote = 'approve' | 'reject' | null;

export default function PartnerVerifyPage() {
  const router = useRouter();
  const [vote, setVote] = useState<Vote>(null);

  return (
    <div className="app-screen">
      <ScreenHeader
        title="인증 요청"
        subtitle="FROM 유준 · 8 MIN AGO"
        onBack={() => router.back()}
        right={
          <span className="mono" style={{ fontSize: 11, color: 'var(--terra-deep)', fontWeight: 600 }}>
            23:42
          </span>
        }
      />

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Sender card */}
        <div
          style={{
            padding: 16,
            background: 'var(--ink)',
            color: 'var(--bg-cream)',
            borderRadius: 'var(--r-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ position: 'relative' }}>
            <Avatar name="유준" color="#B886D9" size={48} ring />
            <div
              style={{
                position: 'absolute', right: -2, bottom: -2,
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--terra)', border: '2px solid var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}
            >
              ◉
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>유준이 청소 인증을 요청했어요</div>
            <div className="mono" style={{ fontSize: 10, opacity: 0.7, marginTop: 2, letterSpacing: '0.04em' }}>
              설거지 · 12분 소요 · 22:30
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="eyebrow" style={{ margin: '20px 0 10px' }}>제출된 증거 사진</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <PhotoCard label="BEFORE" dirty />
          <PhotoCard label="AFTER" />
        </div>

        <div
          className="card"
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            background: 'var(--bg-cream)',
          }}
        >
          <span
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--moss)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}
          >
            ↔
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>탭해서 비교 · 길게 눌러 확대</span>
        </div>

        {/* Note */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>유준의 메모</div>
        <div className="card" style={{ background: 'var(--bg-cream)', display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>💬</span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--ink)' }}>
            오늘 피곤해서 좀 늦게 했네… 후라이팬은 기름 빼느라 한참 걸림. 내일은 일찍 할게!
          </p>
        </div>

        {/* Score preview */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>승인 시 점수</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="유준" color="#B886D9" size={28} />
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>
                유준
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>+15 PT</div>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="민지" color="#5B8DB8" size={28} />
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>
                나 (검증자)
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>+3 PT</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button
            onClick={() => setVote('reject')}
            style={{
              flex: 1,
              padding: '14px 12px',
              borderRadius: 'var(--r-md)',
              background: vote === 'reject' ? 'var(--berry)' : 'var(--bg-paper)',
              color: vote === 'reject' ? 'white' : 'var(--ink)',
              border: '1px solid ' + (vote === 'reject' ? 'var(--berry)' : 'var(--line)'),
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>✕</span> 다시 해주세요
          </button>
          <button
            onClick={() => setVote('approve')}
            style={{
              flex: 2,
              padding: '14px 12px',
              borderRadius: 'var(--r-md)',
              background: vote === 'approve' ? 'var(--moss-deep)' : 'var(--moss)',
              color: 'white',
              border: '1px solid var(--moss-deep)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>✓</span> 깨끗하게 했어! 승인
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--ink-mute)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          24시간 내 응답 없으면 자동 보류
        </div>
      </div>
    </div>
  );
}
