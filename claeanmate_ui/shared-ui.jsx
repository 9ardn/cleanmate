/* shared-ui.jsx — small atoms used across screens */

function CleanlinessBar({ value, state, label = true }) {
  const stateColor = {
    clean: 'var(--state-clean)',
    ok: 'var(--state-ok)',
    dirty: 'var(--state-dirty)',
    critical: 'var(--state-critical)',
  }[state];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="eyebrow">청결도</span>
          <span className="mono tabular" style={{ fontSize: 13, fontWeight: 600 }}>
            {Math.round(value)}<span style={{ color: 'var(--ink-mute)' }}>/100</span>
          </span>
        </div>
      )}
      <div className="progress" style={{ height: 10 }}>
        <div className="fill" style={{ width: `${value}%`, background: stateColor }}/>
      </div>
    </div>
  );
}

function StatusPill({ state }) {
  const labels = {
    clean: { ko: '쾌적', icon: '✦', bg: 'var(--moss)', fg: 'white' },
    ok: { ko: '양호', icon: '◐', bg: 'var(--gold)', fg: 'var(--ink)' },
    dirty: { ko: '주의', icon: '◉', bg: 'var(--terra)', fg: 'white' },
    critical: { ko: '심각', icon: '!', bg: 'var(--berry)', fg: 'white' },
  };
  const s = labels[state];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11, fontFamily: 'var(--font-mono)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      fontWeight: 600,
    }}>
      <span>{s.icon}</span>
      <span>{s.ko}</span>
    </span>
  );
}

function Avatar({ name, color, size = 32, ring = false }) {
  const initial = (name || '?')[0].toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color || 'var(--moss)',
      color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 600,
      border: ring ? '2px solid var(--bg-paper)' : 'none',
      boxShadow: ring ? '0 0 0 2px var(--ink)' : 'none',
      flexShrink: 0,
    }}>{initial}</div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: '⌂', label: '내 방' },
    { id: 'tasks', icon: '☰', label: '할 일' },
    { id: 'verify', icon: '◉', label: '인증' },
    { id: 'rank', icon: '★', label: '랭킹' },
    { id: 'me', icon: '◐', label: '프로필' },
  ];
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <button key={t.id} className={`tab-item ${active === t.id ? 'active' : ''}`} onClick={() => onChange?.(t.id)}>
          <div className="tab-dot">{t.icon}</div>
          <span style={{ fontSize: 9 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// Ticket-style card — used across verify/task screens
function Ticket({ children, perforated = false, style = {} }) {
  return (
    <div style={{
      background: 'var(--bg-paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-md)',
      padding: 16,
      position: 'relative',
      ...style,
    }}>
      {perforated && (
        <>
          <div style={{ position: 'absolute', left: -7, top: '50%', width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-cream)', border: '1px solid var(--line)', transform: 'translateY(-50%)' }}/>
          <div style={{ position: 'absolute', right: -7, top: '50%', width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-cream)', border: '1px solid var(--line)', transform: 'translateY(-50%)' }}/>
        </>
      )}
      {children}
    </div>
  );
}

// Screen header — back button + title
function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <div style={{
      padding: '14px 18px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
    }}>
      {onBack !== undefined && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--bg-paper)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 16, color: 'var(--ink)',
          flexShrink: 0,
        }}>←</button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// Common task icons (small flat shapes)
function TaskIcon({ kind, size = 28 }) {
  const map = {
    floor:    { bg: '#7BA05B', shape: <><rect x="6" y="14" width="16" height="2" fill="white"/><path d="M 14 4 L 14 14" stroke="white" strokeWidth="2"/><circle cx="14" cy="4" r="2" fill="white"/></> },
    dishes:   { bg: '#8FAFC2', shape: <><circle cx="14" cy="14" r="8" fill="none" stroke="white" strokeWidth="2"/><circle cx="14" cy="14" r="3" fill="white"/></> },
    trash:    { bg: '#B85450', shape: <><rect x="7" y="9" width="14" height="13" rx="1" fill="none" stroke="white" strokeWidth="2"/><rect x="5" y="6" width="18" height="3" fill="white"/><rect x="11" y="4" width="6" height="2" fill="white"/></> },
    laundry:  { bg: '#C9A0DC', shape: <><rect x="6" y="6" width="16" height="16" rx="2" fill="none" stroke="white" strokeWidth="2"/><circle cx="14" cy="14" r="4" fill="white"/></> },
    bath:     { bg: '#A8DADC', shape: <><path d="M 5 14 L 23 14 L 21 21 L 7 21 Z" fill="white"/><path d="M 9 14 L 9 7 Q 9 5 11 5" stroke="white" strokeWidth="2" fill="none"/></> },
    bed:      { bg: '#E8965A', shape: <><rect x="5" y="14" width="18" height="6" rx="1" fill="white"/><rect x="7" y="10" width="6" height="4" rx="1" fill="white"/></> },
    desk:     { bg: '#E8B84F', shape: <><rect x="5" y="10" width="18" height="3" fill="white"/><rect x="7" y="13" width="2" height="9" fill="white"/><rect x="19" y="13" width="2" height="9" fill="white"/></> },
    window:   { bg: '#5E7E42', shape: <><rect x="6" y="6" width="16" height="16" fill="none" stroke="white" strokeWidth="2"/><path d="M 14 6 L 14 22 M 6 14 L 22 14" stroke="white" strokeWidth="2"/></> },
    fridge:   { bg: '#3D4F6B', shape: <><rect x="8" y="4" width="12" height="20" rx="1" fill="none" stroke="white" strokeWidth="2"/><path d="M 8 12 L 20 12" stroke="white" strokeWidth="2"/><rect x="17" y="7" width="1.5" height="3" fill="white"/></> },
  };
  const def = map[kind] || map.floor;
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: def.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 28 28">{def.shape}</svg>
    </div>
  );
}

Object.assign(window, { CleanlinessBar, StatusPill, Avatar, TabBar, Ticket, ScreenHeader, TaskIcon });
