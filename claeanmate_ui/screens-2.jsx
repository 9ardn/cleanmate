/* screens-2.jsx — Camera, Partner Verify, Leaderboard */

// ─────────────────────────────────────────────
// SCREEN: CAMERA VERIFICATION
// ─────────────────────────────────────────────
function CameraScreen({ onNavigate }) {
  const [shot, setShot] = React.useState(false);
  return (
    <div className="app-screen" style={{ background: '#1A1614' }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, color: 'white' }}>
        <button onClick={() => onNavigate?.('home')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 0, color: 'white', fontSize: 16, cursor: 'pointer' }}>✕</button>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.6 }}>VERIFY · STEP 2/3</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>설거지 인증</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 0, color: 'white', fontSize: 16, cursor: 'pointer' }}>↺</button>
      </div>

      {/* Viewfinder */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', margin: '0 18px', borderRadius: 'var(--r-lg)', background: '#2A2520' }}>
        {/* Simulated camera view: a kitchen-sink scene */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #4A3F35 0%, #2A2520 50%, #1F1A14 100%)',
        }}>
          {/* Sink */}
          <div style={{ position: 'absolute', left: '15%', right: '15%', top: '40%', bottom: '20%', background: '#87C4DC', borderRadius: 12, opacity: 0.5 }}/>
          <div style={{ position: 'absolute', left: '20%', right: '20%', top: '45%', bottom: '25%', background: '#5C7587', borderRadius: 8 }}/>
          {/* Plates */}
          {[
            { l: '28%', t: '50%', s: 50, c: '#FBF5E9' },
            { l: '50%', t: '52%', s: 44, c: '#F4E9D8' },
            { l: '40%', t: '60%', s: 36, c: '#FBF5E9' },
          ].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.l, top: p.t, width: p.s, height: p.s, borderRadius: '50%', background: p.c, boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.2)' }}/>
          ))}
        </div>

        {/* Frame guides */}
        <div style={{ position: 'absolute', inset: 24, border: '2px solid rgba(255,255,255,0.4)', borderRadius: 8, pointerEvents: 'none' }}>
          {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map((c, i) => (
            <div key={i} style={{ position: 'absolute', [c[0]]: -2, [c[1]]: -2, width: 18, height: 18, borderTop: c[0]==='top' ? '3px solid white' : 0, borderBottom: c[0]==='bottom' ? '3px solid white' : 0, borderLeft: c[1]==='left' ? '3px solid white' : 0, borderRight: c[1]==='right' ? '3px solid white' : 0 }}/>
          ))}
        </div>

        {/* Hint pill */}
        <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 999, color: 'white', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="dot" style={{ background: '#5B8DB8' }}/>
          싱크대 전체가 보이게
        </div>

        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, background: 'white' }}/>
          <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, background: 'white' }}/>
          <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, background: 'white' }}/>
          <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, background: 'white' }}/>
        </div>

        {/* Before/After comparison thumb */}
        <div style={{ position: 'absolute', bottom: 18, left: 18, padding: 4, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', borderRadius: 8 }}>
          <div className="mono" style={{ fontSize: 9, color: 'white', opacity: 0.7, letterSpacing: '0.08em', padding: '0 4px 4px' }}>BEFORE</div>
          <div style={{ width: 70, height: 70, background: '#5C4A30', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 6, background: 'linear-gradient(135deg, #8B6F47, #5C4A30)', borderRadius: 2 }}/>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: `${(i*13)%70}%`, top: `${(i*23)%70}%`, width: 8, height: 6, background: 'rgba(40,20,10,0.6)', borderRadius: '50%' }}/>)}
          </div>
        </div>
      </div>

      {/* Camera controls */}
      <div style={{ padding: '20px 18px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M3 17l6-6 4 4 8-8"/></svg>
        </button>
        <button onClick={() => setShot(!shot)} style={{
          width: 76, height: 76, borderRadius: '50%',
          background: shot ? 'var(--terra)' : 'white',
          border: '5px solid rgba(255,255,255,0.3)',
          cursor: 'pointer', boxShadow: '0 0 0 3px white inset',
          transition: 'all 200ms ease',
        }}/>
        <button style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: 0, cursor: 'pointer', color: 'white', fontSize: 18 }}>↺</button>
      </div>

      {/* Step pills bottom */}
      <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 4, borderRadius: 2, background: 'var(--moss)' }}/>
        <div style={{ width: 22, height: 4, borderRadius: 2, background: 'var(--terra)' }}/>
        <div style={{ width: 22, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: PARTNER VERIFY (the partner reviewing)
// ─────────────────────────────────────────────
function PartnerVerifyScreen({ onNavigate }) {
  const [vote, setVote] = React.useState(null);
  return (
    <div className="app-screen">
      <ScreenHeader title="인증 요청" subtitle="FROM 유준 · 8 MIN AGO" onBack={() => onNavigate?.('home')} right={
        <span className="mono" style={{ fontSize: 11, color: 'var(--terra-deep)', fontWeight: 600 }}>23:42</span>
      }/>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Top sender card */}
        <div style={{
          padding: 16, background: 'var(--ink)', color: 'var(--bg-cream)',
          borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ position: 'relative' }}>
            <Avatar name="유준" color="#B886D9" size={48} ring/>
            <div style={{ position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: '50%', background: 'var(--terra)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>◉</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>유준이 청소 인증을 요청했어요</div>
            <div className="mono" style={{ fontSize: 10, opacity: 0.7, marginTop: 2, letterSpacing: '0.04em' }}>설거지 · 12분 소요 · 22:30</div>
          </div>
        </div>

        {/* Photo evidence — Before / After */}
        <div className="eyebrow" style={{ margin: '20px 0 10px' }}>제출된 증거 사진</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <PhotoCard label="BEFORE" dirty/>
          <PhotoCard label="AFTER"/>
        </div>

        {/* Slider compare hint */}
        <div className="card" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-cream)' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--moss)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>↔</span>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>탭해서 비교 · 길게 눌러 확대</span>
        </div>

        {/* Note from sender */}
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
            <Avatar name="유준" color="#B886D9" size={28}/>
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>유준</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>+15 PT</div>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="민지" color="#5B8DB8" size={28}/>
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>나 (검증자)</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>+3 PT</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button onClick={() => setVote('reject')} style={{
            flex: 1, padding: '14px 12px', borderRadius: 'var(--r-md)',
            background: vote === 'reject' ? 'var(--berry)' : 'var(--bg-paper)',
            color: vote === 'reject' ? 'white' : 'var(--ink)',
            border: '1px solid ' + (vote === 'reject' ? 'var(--berry)' : 'var(--line)'),
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span>✕</span> 다시 해주세요
          </button>
          <button onClick={() => setVote('approve')} style={{
            flex: 2, padding: '14px 12px', borderRadius: 'var(--r-md)',
            background: vote === 'approve' ? 'var(--moss-deep)' : 'var(--moss)',
            color: 'white',
            border: '1px solid ' + (vote === 'approve' ? 'var(--moss-deep)' : 'var(--moss-deep)'),
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span>✓</span> 깨끗하게 했어! 승인
          </button>
        </div>

        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>
          24시간 내 응답 없으면 자동 보류
        </div>
      </div>
    </div>
  );
}

function PhotoCard({ label, dirty }) {
  return (
    <div style={{
      aspectRatio: '1', borderRadius: 'var(--r-md)',
      background: dirty ? '#5C4A30' : '#A8C490',
      position: 'relative', overflow: 'hidden',
      border: '1px solid ' + (dirty ? 'var(--line)' : 'var(--moss-deep)'),
    }}>
      {/* Sink illustration */}
      <div style={{ position: 'absolute', left: '10%', right: '10%', top: '30%', bottom: '15%', background: dirty ? '#3D3022' : '#5B8DB8', borderRadius: 8 }}/>
      <div style={{ position: 'absolute', left: '15%', right: '15%', top: '38%', bottom: '22%', background: dirty ? '#2A2017' : '#3F6F94', borderRadius: 6 }}/>
      {dirty ? (
        <>
          {/* Dirty plates pile */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${20 + (i*11) % 60}%`,
              top: `${42 + (i * 8) % 30}%`,
              width: 24, height: 24, borderRadius: '50%',
              background: '#FBF5E9',
              boxShadow: 'inset -3px -3px 6px rgba(40,20,10,0.5)',
            }}/>
          ))}
          {/* Dust/grease blobs */}
          <div style={{ position: 'absolute', left: '25%', top: '60%', width: 8, height: 5, background: '#6B5A3F', borderRadius: '50%' }}/>
        </>
      ) : (
        <>
          {/* Clean shine */}
          <svg style={{ position: 'absolute', left: '40%', top: '40%' }} width="30" height="30" viewBox="0 0 30 30">
            <path d="M 15 3 L 16 14 L 27 15 L 16 16 L 15 27 L 14 16 L 3 15 L 14 14 Z" fill="white" opacity="0.9"/>
          </svg>
          <svg style={{ position: 'absolute', left: '65%', top: '55%' }} width="16" height="16" viewBox="0 0 16 16">
            <path d="M 8 1 L 9 7 L 15 8 L 9 9 L 8 15 L 7 9 L 1 8 L 7 7 Z" fill="white" opacity="0.7"/>
          </svg>
        </>
      )}
      <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: LEADERBOARD
// ─────────────────────────────────────────────
function LeaderboardScreen({ onNavigate }) {
  const [tab, setTab] = React.useState('week');
  const ranks = [
    { rank: 1, name: '민지', pts: 1240, streak: 14, color: '#5B8DB8', delta: '+85', me: true },
    { rank: 2, name: '유준', pts: 1095, streak: 9, color: '#B886D9', delta: '+62' },
    { rank: 3, name: '서윤', pts: 920, streak: 6, color: '#87C4DC', delta: '+44' },
    { rank: 4, name: '도현', pts: 685, streak: 3, color: '#B886D9', delta: '+12' },
  ];

  return (
    <div className="app-screen">
      <ScreenHeader title="리더보드" subtitle="HOUSE 2025 · WEEK 17"/>

      {/* Tabs */}
      <div style={{ padding: '0 18px 14px', display: 'flex', gap: 6, flexShrink: 0 }}>
        {[
          { id: 'week', label: '이번 주' },
          { id: 'month', label: '이번 달' },
          { id: 'all', label: '전체' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: tab === t.id ? 'var(--ink)' : 'var(--bg-paper)',
            color: tab === t.id ? 'var(--bg-cream)' : 'var(--ink-soft)',
            border: '1px solid ' + (tab === t.id ? 'var(--ink)' : 'var(--line)'),
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Podium */}
        <div style={{
          background: 'var(--ink)', color: 'var(--bg-cream)',
          borderRadius: 'var(--r-lg)', padding: '20px 16px 16px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative diamonds */}
          <div style={{ position: 'absolute', right: -10, top: -10, width: 80, height: 80, background: 'var(--moss)', transform: 'rotate(45deg)', opacity: 0.2 }}/>
          <div style={{ position: 'absolute', left: -20, bottom: -20, width: 60, height: 60, background: 'var(--terra)', transform: 'rotate(45deg)', opacity: 0.2 }}/>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8 }}>
            <PodiumCol r={ranks[1]} h={70} medal="🥈"/>
            <PodiumCol r={ranks[0]} h={100} medal="🥇" featured/>
            <PodiumCol r={ranks[2]} h={50} medal="🥉"/>
          </div>
        </div>

        {/* Streak summary */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="card" style={{ background: 'var(--moss)', color: 'white', borderColor: 'var(--moss-deep)' }}>
            <div className="mono" style={{ fontSize: 9, opacity: 0.8, letterSpacing: '0.08em' }}>나의 스트릭</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span className="tabular" style={{ fontSize: 28, fontWeight: 700 }}>14</span>
              <span style={{ fontSize: 12 }}>일 🔥</span>
            </div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>최고 기록 · 22일</div>
          </div>
          <div className="card" style={{ background: 'var(--terra)', color: 'white', borderColor: 'var(--terra-deep)' }}>
            <div className="mono" style={{ fontSize: 9, opacity: 0.8, letterSpacing: '0.08em' }}>이번 주 격차</div>
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
          {ranks.map(r => (
            <div key={r.rank} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, borderRadius: 'var(--r-md)',
              background: r.me ? 'var(--moss-soft)' : 'var(--bg-paper)',
              border: '1px solid ' + (r.me ? 'var(--moss)' : 'var(--line-soft)'),
            }}>
              <div className="mono tabular" style={{ width: 22, fontSize: 14, fontWeight: 700, textAlign: 'center', color: r.rank === 1 ? 'var(--gold)' : 'var(--ink-soft)' }}>{r.rank}</div>
              <Avatar name={r.name} color={r.color} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.name} {r.me && <span className="chip solid-ink" style={{ padding: '1px 6px', fontSize: 9 }}>나</span>}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.04em', marginTop: 2 }}>
                  스트릭 {r.streak}일 · 이번 주 {r.delta}
                </div>
              </div>
              <div className="mono tabular" style={{ fontSize: 16, fontWeight: 700 }}>{r.pts}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>이번 주 업적</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {[
            { name: '아침형 인간', desc: '7일 연속 오전 청소', icon: '☀', color: 'var(--gold)' },
            { name: '먼지 헌터', desc: '바닥 30회', icon: '✦', color: 'var(--moss)' },
            { name: '인증 마스터', desc: '거절 0회', icon: '◉', color: 'var(--terra)' },
            { name: '룸메 베스트', desc: '4주 연속 1위', icon: '★', color: 'var(--berry)', locked: true },
          ].map((a, i) => (
            <div key={i} className="card" style={{
              minWidth: 110, padding: 12,
              opacity: a.locked ? 0.4 : 1, position: 'relative',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: a.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{a.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{a.name}</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.02em' }}>{a.desc}</div>
              {a.locked && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 12 }}>🔒</span>}
            </div>
          ))}
        </div>
      </div>

      <TabBar active="rank" onChange={onNavigate}/>
    </div>
  );
}

function PodiumCol({ r, h, medal, featured }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{ fontSize: 18 }}>{medal}</div>
      <Avatar name={r.name} color={r.color} size={featured ? 48 : 36} ring={featured}/>
      <div style={{ fontSize: featured ? 13 : 11, fontWeight: 600, color: 'var(--bg-cream)' }}>{r.name}</div>
      <div className="mono tabular" style={{ fontSize: featured ? 16 : 12, fontWeight: 700, color: featured ? 'var(--gold)' : 'var(--bg-cream)' }}>{r.pts}</div>
      <div style={{
        width: '100%', height: h,
        background: featured ? 'var(--moss)' : 'var(--terra)',
        borderRadius: '4px 4px 0 0',
        marginTop: 4,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4,
        color: 'white', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)',
      }}>{r.rank}</div>
    </div>
  );
}

Object.assign(window, { CameraScreen, PartnerVerifyScreen, LeaderboardScreen });
