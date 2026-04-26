/* screens-3.jsx — Party/Room mgmt, Onboarding, Profile */

// ─────────────────────────────────────────────
// SCREEN: PARTY / ROOM MGMT
// ─────────────────────────────────────────────
function PartyScreen({ onNavigate }) {
  const members = [
    { name: '민지', color: '#5B8DB8', role: '방장', pts: 1240, online: true },
    { name: '유준', color: '#B886D9', role: '멤버', pts: 1095, online: true },
    { name: '서윤', color: '#87C4DC', role: '멤버', pts: 920, online: false },
  ];
  return (
    <div className="app-screen">
      <ScreenHeader title="우리 집" subtitle="HOUSE #4821 · 개봉동 메이트하우스" right={
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-paper)', border: '1px solid var(--line)', cursor: 'pointer' }}>⋯</button>
      }/>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* House summary */}
        <div style={{
          padding: 16, borderRadius: 'var(--r-lg)',
          background: 'linear-gradient(135deg, var(--moss) 0%, var(--moss-deep) 100%)',
          color: 'white', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, bottom: -30, width: 140, height: 140 }}>
            <svg viewBox="0 0 140 140"><polygon points="70,10 130,55 110,130 30,130 10,55" fill="rgba(255,255,255,0.1)"/></svg>
          </div>
          <div className="mono" style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.1em' }}>HOUSE LEVEL · LV.7</div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em' }}>개봉동 메이트하우스</div>
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
          {/* progress to next level */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 4, opacity: 0.85 }}>
              <span className="mono">LV.7 → LV.8</span>
              <span className="mono tabular">3255 / 4000</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '81%', height: '100%', background: 'var(--gold)', borderRadius: 999 }}/>
            </div>
          </div>
        </div>

        {/* Members */}
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="eyebrow">구성원 · 3</span>
          <button style={{ background: 'none', border: 0, color: 'var(--moss-deep)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ 초대</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {members.map(m => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, background: 'var(--bg-paper)',
              border: '1px solid var(--line-soft)', borderRadius: 'var(--r-md)',
            }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={m.name} color={m.color} size={40}/>
                {m.online && <div style={{ position: 'absolute', right: -1, bottom: -1, width: 12, height: 12, borderRadius: '50%', background: 'var(--moss)', border: '2px solid var(--bg-paper)' }}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span>
                  {m.role === '방장' && <span className="chip solid-terra" style={{ padding: '1px 6px', fontSize: 9 }}>방장</span>}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.04em', marginTop: 2 }}>
                  {m.online ? '온라인' : '3시간 전 접속'} · {m.pts}pt
                </div>
              </div>
              <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ink-mute)' }}>›</button>
            </div>
          ))}
        </div>

        {/* Rules / settings */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>하우스 규칙</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingRow label="당번 자동 로테이션" value="ON"/>
          <SettingRow label="포인트 곱연산" value="× 1.0"/>
          <SettingRow label="자동 인증 만료" value="24시간"/>
          <SettingRow label="셀프 인증 허용" value="OFF (권장)" last/>
        </div>

        {/* Recent activity */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>최근 활동</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { who: '유준', act: '설거지 인증을 요청했어요', t: '8분', icon: '◉', c: 'var(--terra)' },
            { who: '민지', act: '바닥 청소 +20PT 획득', t: '2시간', icon: '✦', c: 'var(--moss)' },
            { who: '서윤', act: '욕실 청소 인증을 거절했어요', t: '5시간', icon: '✕', c: 'var(--berry)' },
            { who: '유준', act: '14일 스트릭 달성!', t: '1일', icon: '🔥', c: 'var(--gold)' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: a.c, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>{a.who}</span>
                <span style={{ color: 'var(--ink-soft)' }}>이 {a.act}</span>
              </div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="me" onChange={onNavigate}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: ONBOARDING (partner invite)
// ─────────────────────────────────────────────
function OnboardingScreen({ onNavigate }) {
  return (
    <div className="app-screen" style={{ background: 'var(--bg-cream)' }}>
      <ScreenHeader title="" onBack={() => onNavigate?.('home')} right={
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.08em' }}>3 / 5</span>
      }/>

      <div className="scroll-y" style={{ flex: 1, padding: '8px 18px 120px' }}>
        {/* Step header */}
        <div className="eyebrow">STEP 03</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          같이 살 사람을<br/>초대해주세요
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          CleanMate는 <strong style={{ color: 'var(--ink)' }}>상호 인증</strong>이 핵심이에요. 룸메이트가 내 청소를 확인해줘야 점수가 들어가요.
        </p>

        {/* Visual: two phones connecting */}
        <div style={{ marginTop: 24, marginBottom: 24, padding: '24px 14px', background: 'var(--bg-paper)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <PhoneSilhouette name="민지" color="#5B8DB8"/>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--moss)', opacity: 0.3 + i * 0.25 }}/>
              ))}
              <div style={{ fontSize: 22, color: 'var(--moss)', margin: '4px 0' }}>↔</div>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--terra)', opacity: 0.85 - i * 0.25 }}/>
              ))}
            </div>
            <PhoneSilhouette name="유준" color="#B886D9"/>
          </div>
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--ink-soft)' }}>
            서로의 청소를 인증하면 <span className="mono" style={{ color: 'var(--moss-deep)', fontWeight: 700 }}>+15PT</span>씩 획득
          </div>
        </div>

        {/* Invite code card */}
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>초대 코드</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mono" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.18em', flex: 1 }}>K7-9XQ4</div>
            <button style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-cream)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 16 }}>⎘</button>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>15분 후 만료</div>
        </div>

        {/* Share methods */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>또는 공유</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { i: '⊞', l: 'QR' },
            { i: '✉', l: '메시지' },
            { i: '⌘', l: '카톡' },
            { i: '↗', l: '링크' },
          ].map(m => (
            <button key={m.l} className="card" style={{
              padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{m.i}</div>
              <span style={{ fontSize: 11, fontWeight: 500 }}>{m.l}</span>
            </button>
          ))}
        </div>

        {/* Pending invitee */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>초대 대기 · 1</div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="?" color="var(--line)" size={36}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>+82 10-····-9382</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.04em' }}>2분 전 발송 · 미응답</div>
          </div>
          <button style={{ padding: '6px 10px', borderRadius: 6, background: 'var(--bg-cream)', border: '1px solid var(--line)', fontSize: 11, cursor: 'pointer' }}>재전송</button>
        </div>
      </div>

      {/* Bottom action */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px 28px', background: 'rgba(244,233,216,0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid var(--line-soft)' }}>
        <button style={{
          width: '100%', padding: '14px 18px', borderRadius: 'var(--r-md)',
          background: 'var(--ink)', color: 'var(--bg-cream)', border: 0,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>다음 단계로</span>
          <span>→</span>
        </button>
        <button style={{ width: '100%', marginTop: 6, padding: '10px', background: 'transparent', border: 0, fontSize: 12, color: 'var(--ink-mute)', cursor: 'pointer' }}>나중에 초대하기</button>
      </div>
    </div>
  );
}

function PhoneSilhouette({ name, color }) {
  return (
    <div style={{
      width: 70, height: 110,
      borderRadius: 14,
      background: 'var(--bg-cream)',
      border: '2px solid var(--ink)',
      padding: 6,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6,
    }}>
      <Avatar name={name} color={color} size={28}/>
      <div style={{ fontSize: 10, fontWeight: 600 }}>{name}</div>
      <div style={{ width: 30, height: 4, borderRadius: 2, background: color }}/>
      <div style={{ width: 22, height: 3, borderRadius: 2, background: 'var(--line)' }}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: PROFILE / STATS
// ─────────────────────────────────────────────
function ProfileScreen({ onNavigate }) {
  return (
    <div className="app-screen">
      <ScreenHeader title="프로필" subtitle="MEMBER SINCE FEB 2025" right={
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-paper)', border: '1px solid var(--line)', cursor: 'pointer' }}>⚙</button>
      }/>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Identity card */}
        <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name="민지" color="#5B8DB8" size={64}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>김민지</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.04em' }}>@minji_clean · LV.12</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
              <span className="chip solid-moss" style={{ padding: '2px 8px', fontSize: 9 }}>방장</span>
              <span className="chip" style={{ padding: '2px 8px', fontSize: 9 }}>14일 스트릭</span>
            </div>
          </div>
        </div>

        {/* Big stats */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          <BigStat label="총 청소 횟수" value="186" sub="회"/>
          <BigStat label="누적 포인트" value="1,240" sub="PT" accent/>
          <BigStat label="평균 인증 통과율" value="92%" sub="↑ 4%"/>
          <BigStat label="이번 달 시간" value="4.2" sub="시간"/>
        </div>

        {/* Activity heat */}
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span className="eyebrow">활동 히트맵 · 12주</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>2026.02 → 2026.04</span>
        </div>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            {Array.from({ length: 7 * 12 }, (_, i) => {
              const r = (i * 9173) % 100;
              const lvl = r > 85 ? 4 : r > 65 ? 3 : r > 40 ? 2 : r > 15 ? 1 : 0;
              const colors = ['var(--line-soft)', 'var(--moss-soft)', '#A8C490', 'var(--moss)', 'var(--moss-deep)'];
              return <div key={i} style={{ aspectRatio: '1', background: colors[lvl], borderRadius: 2 }}/>;
            })}
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>덜함</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {['var(--line-soft)', 'var(--moss-soft)', '#A8C490', 'var(--moss)', 'var(--moss-deep)'].map((c, i) =>
                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }}/>
              )}
            </div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>많이</span>
          </div>
        </div>

        {/* Top tasks */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>가장 많이 한 청소</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'floor', name: '바닥 청소', n: 42, pct: 100 },
            { id: 'dishes', name: '설거지', n: 38, pct: 90 },
            { id: 'trash', name: '쓰레기 비우기', n: 24, pct: 57 },
            { id: 'laundry', name: '빨래', n: 18, pct: 43 },
          ].map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
              <TaskIcon kind={t.id} size={24}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{t.name}</span>
                  <span className="mono tabular" style={{ color: 'var(--ink-mute)' }}>{t.n}회</span>
                </div>
                <div style={{ height: 4, background: 'var(--line-soft)', borderRadius: 2 }}>
                  <div style={{ width: `${t.pct}%`, height: '100%', background: 'var(--moss)', borderRadius: 2 }}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Settings shortcuts */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>설정</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingRow label="알림"  value="매일 21:00"/>
          <SettingRow label="언어" value="한국어"/>
          <SettingRow label="다크 모드" value="시스템"/>
          <SettingRow label="데이터 백업" value="2시간 전" last/>
        </div>
      </div>

      <TabBar active="me" onChange={onNavigate}/>
    </div>
  );
}

function BigStat({ label, value, sub, accent }) {
  return (
    <div className="card" style={{
      padding: 14,
      background: accent ? 'var(--ink)' : 'var(--bg-paper)',
      color: accent ? 'var(--bg-cream)' : 'var(--ink)',
      borderColor: accent ? 'var(--ink)' : 'var(--line)',
    }}>
      <div className="mono" style={{ fontSize: 9, opacity: accent ? 0.6 : 1, color: accent ? 'inherit' : 'var(--ink-mute)', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        <span className="tabular" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</span>
        <span style={{ fontSize: 11, opacity: 0.7 }}>{sub}</span>
      </div>
    </div>
  );
}

Object.assign(window, { PartyScreen, OnboardingScreen, ProfileScreen });
