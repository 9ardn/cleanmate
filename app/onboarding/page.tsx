'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { createClient } from '@/lib/supabase/client';
import { getMyProfile, updateMyProfile } from '@/lib/db/profile';

const SHARE_METHODS = [
  { i: '⊞', l: 'QR' },
  { i: '✉', l: '메시지' },
  { i: '⌘', l: '카톡' },
  { i: '↗', l: '링크' },
];

interface PhoneSilhouetteProps { name: string; color: string }

function PhoneSilhouette({ name, color }: PhoneSilhouetteProps) {
  return (
    <div
      style={{
        width: 70,
        height: 110,
        borderRadius: 14,
        background: 'var(--bg-cream)',
        border: '2px solid var(--ink)',
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      <Avatar name={name} color={color} size={28} />
      <div style={{ fontSize: 10, fontWeight: 600 }}>{name}</div>
      <div style={{ width: 30, height: 4, borderRadius: 2, background: color }} />
      <div style={{ width: 22, height: 3, borderRadius: 2, background: 'var(--line)' }} />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>('나');

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const profile = await getMyProfile(supabase);
      if (profile?.onboarded) {
        router.push('/');
        return;
      }
      if (profile?.name) setProfileName(profile.name);
    })();
  }, [router]);

  async function handleNext() {
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      await updateMyProfile(supabase, { onboarded: true });
      router.push('/');
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: '#C5D0E0' }}
    >
      <div
        className="relative w-full shadow-2xl overflow-hidden"
        style={{
          maxWidth: '430px',
          minHeight: '100vh',
          background: 'var(--bg-cream)',
          color: 'var(--ink)',
        }}
      >
        <div className="app-screen" style={{ background: 'var(--bg-cream)' }}>
          <ScreenHeader
            title=""
            onBack={() => router.back()}
            right={
              <span
                className="mono"
                style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.08em' }}
              >
                3 / 5
              </span>
            }
          />

          <div className="scroll-y" style={{ flex: 1, padding: '8px 18px 120px' }}>
            <div className="eyebrow">STEP 03</div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: '6px 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              같이 살 사람을
              <br />
              초대해주세요
            </h1>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
              CleanMate는 <strong style={{ color: 'var(--ink)' }}>상호 인증</strong>이 핵심이에요. 룸메이트가 내
              청소를 확인해줘야 점수가 들어가요.
            </p>

            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                padding: '24px 14px',
                background: 'var(--bg-paper)',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--line)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <PhoneSilhouette name={profileName} color="#5B8DB8" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--moss)', opacity: 0.3 + i * 0.25,
                      }}
                    />
                  ))}
                  <div style={{ fontSize: 22, color: 'var(--moss)', margin: '4px 0' }}>↔</div>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--terra)', opacity: 0.85 - i * 0.25,
                      }}
                    />
                  ))}
                </div>
                <PhoneSilhouette name="?" color="#B886D9" />
              </div>
              <div
                style={{
                  marginTop: 16,
                  textAlign: 'center',
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                }}
              >
                서로의 청소를 인증하면{' '}
                <span className="mono" style={{ color: 'var(--moss-deep)', fontWeight: 700 }}>
                  +15PT
                </span>
                씩 획득
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>초대 코드</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="mono" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.18em', flex: 1 }}>
                  K7-9XQ4
                </div>
                <button
                  aria-label="복사"
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: 'var(--bg-cream)', border: '1px solid var(--line)',
                    cursor: 'pointer', fontSize: 16,
                  }}
                >
                  ⎘
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>
                15분 후 만료
              </div>
            </div>

            <div className="eyebrow" style={{ margin: '20px 0 8px' }}>또는 공유</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {SHARE_METHODS.map((m) => (
                <button
                  key={m.l}
                  className="card"
                  style={{
                    padding: '14px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--ink)', color: 'var(--bg-cream)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}
                  >
                    {m.i}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{m.l}</span>
                </button>
              ))}
            </div>

            <div className="eyebrow" style={{ margin: '20px 0 8px' }}>초대 대기 · 1</div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name="?" color="var(--line)" size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>+82 10-····-9382</div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.04em' }}
                >
                  2분 전 발송 · 미응답
                </div>
              </div>
              <button
                style={{
                  padding: '6px 10px', borderRadius: 6,
                  background: 'var(--bg-cream)', border: '1px solid var(--line)',
                  fontSize: 11, cursor: 'pointer',
                }}
              >
                재전송
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 'var(--r-sm)',
                  background: 'rgba(217, 98, 122, 0.12)',
                  color: 'var(--berry)',
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '14px 18px 28px',
              background: 'rgba(244, 247, 251, 0.95)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid var(--line-soft)',
            }}
          >
            <button
              onClick={handleNext}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 'var(--r-md)',
                background: 'var(--ink)',
                color: 'var(--bg-cream)',
                border: 0,
                fontSize: 14,
                fontWeight: 600,
                cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {submitting && <Loader2 size={14} className="animate-spin" />}
                <span>다음 단계로</span>
              </span>
              <span>→</span>
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              style={{
                width: '100%',
                marginTop: 6,
                padding: 10,
                background: 'transparent',
                border: 0,
                fontSize: 12,
                color: 'var(--ink-mute)',
                cursor: 'pointer',
              }}
            >
              나중에 초대하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
