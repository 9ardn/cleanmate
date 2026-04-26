'use client';

import { useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

export default function CameraPage() {
  const router = useRouter();
  const [shot, setShot] = useState(false);

  return (
    <div className="app-screen" style={{ background: '#1A1614' }}>
      <div
        style={{
          padding: '14px 18px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          color: 'white',
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="닫기"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 0,
            color: 'white', fontSize: 16, cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.6 }}>
            VERIFY · STEP 2/3
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>설거지 인증</div>
        </div>
        <button
          aria-label="다시"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 0,
            color: 'white', fontSize: 16, cursor: 'pointer',
          }}
        >
          ↺
        </button>
      </div>

      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          margin: '0 18px',
          borderRadius: 'var(--r-lg)',
          background: '#2A2520',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #4A3F35 0%, #2A2520 50%, #1F1A14 100%)',
          }}
        >
          <div
            style={{
              position: 'absolute', left: '15%', right: '15%', top: '40%', bottom: '20%',
              background: '#87C4DC', borderRadius: 12, opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute', left: '20%', right: '20%', top: '45%', bottom: '25%',
              background: '#5C7587', borderRadius: 8,
            }}
          />
          {[
            { l: '28%', t: '50%', s: 50, c: '#FBF5E9' },
            { l: '50%', t: '52%', s: 44, c: '#F4E9D8' },
            { l: '40%', t: '60%', s: 36, c: '#FBF5E9' },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: p.l, top: p.t,
                width: p.s, height: p.s, borderRadius: '50%',
                background: p.c,
                boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: 'absolute', inset: 24,
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: 8, pointerEvents: 'none',
          }}
        >
          {(
            [
              ['top', 'left'],
              ['top', 'right'],
              ['bottom', 'left'],
              ['bottom', 'right'],
            ] as const
          ).map((c, i) => {
            const style: CSSProperties = {
              position: 'absolute',
              [c[0]]: -2,
              [c[1]]: -2,
              width: 18, height: 18,
              borderTop: c[0] === 'top' ? '3px solid white' : 0,
              borderBottom: c[0] === 'bottom' ? '3px solid white' : 0,
              borderLeft: c[1] === 'left' ? '3px solid white' : 0,
              borderRight: c[1] === 'right' ? '3px solid white' : 0,
            };
            return <div key={i} style={style} />;
          })}
        </div>

        <div
          style={{
            position: 'absolute', top: 18, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: 999,
            color: 'white',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            display: 'flex', gap: 6, alignItems: 'center',
          }}
        >
          <span className="dot" style={{ background: '#5B8DB8' }} />
          싱크대 전체가 보이게
        </div>

        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, background: 'white' }} />
          <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, background: 'white' }} />
          <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, background: 'white' }} />
          <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, background: 'white' }} />
        </div>

        <div
          style={{
            position: 'absolute', bottom: 18, left: 18,
            padding: 4, background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)', borderRadius: 8,
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 9, color: 'white', opacity: 0.7, letterSpacing: '0.08em', padding: '0 4px 4px' }}
          >
            BEFORE
          </div>
          <div
            style={{
              width: 70, height: 70, background: '#5C4A30',
              borderRadius: 4, position: 'relative', overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute', inset: 6,
                background: 'linear-gradient(135deg, #8B6F47, #5C4A30)',
                borderRadius: 2,
              }}
            />
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(i * 13) % 70}%`,
                  top: `${(i * 23) % 70}%`,
                  width: 8, height: 6,
                  background: 'rgba(40,20,10,0.6)',
                  borderRadius: '50%',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '20px 18px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <button
          aria-label="갤러리"
          style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)', border: 0,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M3 17l6-6 4 4 8-8" />
          </svg>
        </button>
        <button
          onClick={() => setShot(!shot)}
          aria-label="촬영"
          style={{
            width: 76, height: 76, borderRadius: '50%',
            background: shot ? 'var(--terra)' : 'white',
            border: '5px solid rgba(255,255,255,0.3)',
            cursor: 'pointer',
            boxShadow: '0 0 0 3px white inset',
            transition: 'all 200ms ease',
          }}
        />
        <button
          aria-label="플립"
          style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)', border: 0,
            cursor: 'pointer', color: 'white', fontSize: 18,
          }}
        >
          ↺
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 36, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 6,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: 22, height: 4, borderRadius: 2, background: 'var(--moss)' }} />
        <div style={{ width: 22, height: 4, borderRadius: 2, background: 'var(--terra)' }} />
        <div style={{ width: 22, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  );
}
