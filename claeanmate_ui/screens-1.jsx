/* screens-1.jsx — Home (My Room), Tasks list, Task detail */

// ─────────────────────────────────────────────
// SCREEN: HOME (My Room)
// ─────────────────────────────────────────────
function HomeScreen({ state, score, pose, onNavigate }) {
  const today = [
    { id: 'floor', name: '바닥 청소', who: '나', due: '오늘', priority: 'high' },
    { id: 'dishes', name: '설거지', who: '룸메', due: '오늘', priority: 'high' },
    { id: 'trash', name: '쓰레기 비우기', who: '나', due: '내일', priority: 'mid' },
  ];

  return (
    <div className="app-screen">
      {/* Top status row */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name="민지" color="#5B8DB8" size={32}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>민지의 방</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>WED · APR 26</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusPill state={state}/>
          <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-paper)', border: '1px solid var(--line)', cursor: 'pointer' }}>⚙</button>
        </div>
      </div>

      {/* ROOM stage */}
      <div style={{ flex: '0 0 360px', position: 'relative', overflow: 'hidden' }}>
        <IsometricRoom state={state} pose={pose} scale={1.0}/>
        {/* Floating partner indicator top-right */}
        <div style={{
          position: 'absolute', top: 10, right: 14, zIndex: 5,
          background: 'rgba(244, 247, 251, 0.92)',
          backdropFilter: 'blur(6px)',
          border: '1px solid var(--line)',
          borderRadius: 999,
          padding: '4px 8px 4px 4px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontFamily: 'var(--font-mono)',
        }}>
          <Avatar name="유준" color="#B886D9" size={20}/>
          <span>유준 · 2h ago</span>
        </div>
      </div>

      {/* Bottom panel — cleanliness + tasks */}
      <div className="scroll-y" style={{ flex: 1, padding: '16px 18px 100px', background: 'var(--bg-paper)', borderTop: '1px solid var(--line)' }}>
        {/* Score header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div>
            <div className="eyebrow">우리 집 청결도</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="mono tabular" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>{Math.round(score)}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>/100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>STREAK</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
              <span className="mono tabular" style={{ fontSize: 22, fontWeight: 700 }}>14</span>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>일</span>
              <span style={{ fontSize: 16, marginLeft: 2 }}>🔥</span>
            </div>
          </div>
        </div>
        <CleanlinessBar value={score} state={state} label={false}/>

        {/* Today's tasks preview */}
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="eyebrow">오늘의 할 일 · 3</div>
          <button onClick={() => onNavigate?.('tasks')} className="mono" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.04em' }}>전체 보기 →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {today.map(t => (
            <button key={t.id} onClick={() => onNavigate?.('detail', t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, background: 'var(--bg-cream)', border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-md)', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <TaskIcon kind={t.id}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.04em', marginTop: 2 }}>
                  {t.who} · {t.due}
                </div>
              </div>
              {t.priority === 'high' && <span className="dot dirty"/>}
              <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>›</span>
            </button>
          ))}
        </div>

        {/* Big CTA */}
        <button onClick={() => onNavigate?.('verify')} style={{
          marginTop: 16, width: '100%', padding: '14px 18px',
          background: 'var(--ink)', color: 'var(--bg-cream)',
          border: 0, borderRadius: 'var(--r-md)', cursor: 'pointer',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--terra)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>◉</span>
            <span>청소 인증하기</span>
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>+15 PT</span>
        </button>
      </div>

      <TabBar active="home" onChange={onNavigate}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: TASKS LIST
// ─────────────────────────────────────────────
function TasksScreen({ onNavigate }) {
  const [filter, setFilter] = React.useState('all');
  const tasks = [
    { id: 'floor', name: '거실 바닥 청소', cycle: '매일', who: '민지', wholeDays: 0, status: 'pending', priority: 'high' },
    { id: 'dishes', name: '설거지', cycle: '매일', who: '유준', wholeDays: 0, status: 'pending', priority: 'high' },
    { id: 'trash', name: '쓰레기 분리수거', cycle: '주 2회', who: '민지', wholeDays: 1, status: 'upcoming', priority: 'mid' },
    { id: 'bath', name: '욕실 청소', cycle: '주 1회', who: '유준', wholeDays: 2, status: 'upcoming', priority: 'mid' },
    { id: 'fridge', name: '냉장고 정리', cycle: '월 1회', who: '민지', wholeDays: 6, status: 'upcoming', priority: 'low' },
    { id: 'laundry', name: '빨래', cycle: '주 2회', who: '유준', wholeDays: -1, status: 'done', priority: 'mid' },
    { id: 'bed', name: '침구 정리', cycle: '매주', who: '민지', wholeDays: -2, status: 'done', priority: 'low' },
  ];

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'mine') return t.who === '민지';
    if (filter === 'partner') return t.who === '유준';
    if (filter === 'today') return t.wholeDays === 0;
    return true;
  });

  return (
    <div className="app-screen">
      <ScreenHeader title="할 일" subtitle="3 OPEN · 2 DONE TODAY" right={
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: 'white', border: 0, fontSize: 18, cursor: 'pointer' }}>+</button>
      }/>

      {/* Filter chips */}
      <div style={{ padding: '6px 18px 12px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {[
          { id: 'all', label: '전체' },
          { id: 'today', label: '오늘' },
          { id: 'mine', label: '나' },
          { id: 'partner', label: '유준' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 14px', borderRadius: 999,
            border: '1px solid ' + (filter === f.id ? 'var(--ink)' : 'var(--line)'),
            background: filter === f.id ? 'var(--ink)' : 'var(--bg-paper)',
            color: filter === f.id ? 'var(--bg-cream)' : 'var(--ink)',
            fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500,
          }}>{f.label}</button>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Pending section */}
        <div className="eyebrow" style={{ margin: '8px 0 8px' }}>진행 중 · {filtered.filter(t => t.status !== 'done').length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.filter(t => t.status !== 'done').map(t => (
            <TaskRow key={t.id} task={t} onClick={() => onNavigate?.('detail', t.id)}/>
          ))}
        </div>

        {/* Done section */}
        {filtered.some(t => t.status === 'done') && <>
          <div className="eyebrow" style={{ margin: '20px 0 8px' }}>완료 · 오늘</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.filter(t => t.status === 'done').map(t => (
              <TaskRow key={t.id} task={t} done onClick={() => onNavigate?.('detail', t.id)}/>
            ))}
          </div>
        </>}
      </div>

      <TabBar active="tasks" onChange={onNavigate}/>
    </div>
  );
}

function TaskRow({ task, done, onClick }) {
  const dueLabel = task.wholeDays === 0 ? '오늘' : task.wholeDays === 1 ? '내일' : task.wholeDays < 0 ? `${-task.wholeDays}일 전 완료` : `D-${task.wholeDays}`;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 14, background: 'var(--bg-paper)', border: '1px solid var(--line-soft)',
      borderRadius: 'var(--r-md)', cursor: 'pointer', textAlign: 'left', width: '100%',
      opacity: done ? 0.55 : 1,
    }}>
      <TaskIcon kind={task.id}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>{task.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.04em' }}>{task.cycle}</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--ink-mute)' }}/>
          <Avatar name={task.who} color={task.who === '민지' ? '#5B8DB8' : '#B886D9'} size={18}/>
          <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{task.who}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 11, color: task.wholeDays === 0 ? 'var(--terra-deep)' : 'var(--ink-mute)', fontWeight: 600 }}>{dueLabel}</div>
        {task.priority === 'high' && !done && <span className="dot dirty" style={{ marginTop: 4 }}/>}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// SCREEN: TASK DETAIL
// ─────────────────────────────────────────────
function TaskDetailScreen({ onNavigate }) {
  const history = [
    { date: '04.25', who: '유준', verifier: '민지', status: 'verified', dur: '12분' },
    { date: '04.23', who: '민지', verifier: '유준', status: 'verified', dur: '15분' },
    { date: '04.21', who: '유준', verifier: '민지', status: 'verified', dur: '10분' },
    { date: '04.19', who: '민지', verifier: '유준', status: 'rejected', dur: '8분' },
    { date: '04.17', who: '유준', verifier: '민지', status: 'verified', dur: '14분' },
  ];

  return (
    <div className="app-screen">
      <ScreenHeader title="설거지" subtitle="MUTUAL VERIFICATION · #DISHES" onBack={() => onNavigate?.('tasks')}/>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        {/* Hero card */}
        <div style={{
          padding: 18, background: 'var(--ink)', color: 'var(--bg-cream)',
          borderRadius: 'var(--r-lg)', marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'var(--moss)', opacity: 0.3 }}/>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.6 }}>NEXT DUE</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }}>오늘 22:00</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, position: 'relative' }}>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>주기</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>매일</div>
            </div>
            <div style={{ width: 1, background: 'rgba(244,233,216,0.2)' }}/>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>당번</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>유준</div>
            </div>
            <div style={{ width: 1, background: 'rgba(244,233,216,0.2)' }}/>
            <div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>점수</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>+15 PT</div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
          <StatTile label="이번 주" value="6" sub="회 완료"/>
          <StatTile label="평균 시간" value="12" sub="분"/>
          <StatTile label="인증 통과율" value="92%" sub="↑ 4%"/>
        </div>

        {/* Mini calendar */}
        <div className="eyebrow" style={{ marginBottom: 8 }}>최근 30일</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4, marginBottom: 18 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const r = (i * 7919) % 100;
            const status = r > 80 ? 'rejected' : r > 60 ? 'pending' : r > 30 ? 'verified-mate' : 'verified-me';
            const colors = {
              'verified-me': 'var(--moss)',
              'verified-mate': 'var(--terra)',
              'pending': 'var(--line)',
              'rejected': 'var(--berry)',
            };
            return <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: colors[status] }}/>;
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', marginBottom: 18 }}>
          <span><span className="dot" style={{ background: 'var(--moss)' }}/> 나</span>
          <span><span className="dot" style={{ background: 'var(--terra)' }}/> 룸메</span>
          <span><span className="dot" style={{ background: 'var(--berry)' }}/> 거절</span>
        </div>

        {/* Schedule */}
        <div className="eyebrow" style={{ marginBottom: 8 }}>스케줄 설정</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingRow label="주기" value="매일"/>
          <SettingRow label="시간" value="저녁 22:00"/>
          <SettingRow label="당번 순서" value="민지 ↔ 유준"/>
          <SettingRow label="알림" value="30분 전" last/>
        </div>

        {/* History */}
        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>인증 히스토리</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {history.map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: 'var(--bg-paper)',
              border: '1px solid var(--line-soft)', borderRadius: 'var(--r-sm)',
            }}>
              <span className="mono tabular" style={{ fontSize: 11, color: 'var(--ink-mute)', width: 36 }}>{h.date}</span>
              <Avatar name={h.who} color={h.who === '민지' ? '#5B8DB8' : '#B886D9'} size={20}/>
              <span style={{ fontSize: 12 }}>{h.who}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>→</span>
              <Avatar name={h.verifier} color={h.verifier === '민지' ? '#5B8DB8' : '#B886D9'} size={20}/>
              <span style={{ flex: 1, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>{h.dur}</span>
              {h.status === 'verified' ? (
                <span className="chip solid-moss" style={{ padding: '2px 8px', fontSize: 9 }}>승인</span>
              ) : (
                <span className="chip" style={{ background: 'var(--berry)', color: 'white', borderColor: 'var(--berry)', padding: '2px 8px', fontSize: 9 }}>거절</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <TabBar active="tasks" onChange={onNavigate}/>
    </div>
  );
}

function StatTile({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function SettingRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px',
      borderBottom: last ? 0 : '1px solid var(--line-soft)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
        {value}
        <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>›</span>
      </span>
    </div>
  );
}

Object.assign(window, { HomeScreen, TasksScreen, TaskDetailScreen });
