interface PhotoCardProps {
  label: string;
  dirty?: boolean;
}

export function PhotoCard({ label, dirty = false }: PhotoCardProps) {
  return (
    <div
      style={{
        aspectRatio: '1',
        borderRadius: 'var(--r-md)',
        background: dirty ? '#5C4A30' : '#A8C490',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid ' + (dirty ? 'var(--line)' : 'var(--moss-deep)'),
      }}
    >
      <div
        style={{
          position: 'absolute', left: '10%', right: '10%', top: '30%', bottom: '15%',
          background: dirty ? '#3D3022' : '#5B8DB8', borderRadius: 8,
        }}
      />
      <div
        style={{
          position: 'absolute', left: '15%', right: '15%', top: '38%', bottom: '22%',
          background: dirty ? '#2A2017' : '#3F6F94', borderRadius: 6,
        }}
      />
      {dirty ? (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${20 + (i * 11) % 60}%`,
                top: `${42 + (i * 8) % 30}%`,
                width: 24, height: 24, borderRadius: '50%',
                background: '#FBF5E9',
                boxShadow: 'inset -3px -3px 6px rgba(40,20,10,0.5)',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute', left: '25%', top: '60%',
              width: 8, height: 5, background: '#6B5A3F', borderRadius: '50%',
            }}
          />
        </>
      ) : (
        <>
          <svg style={{ position: 'absolute', left: '40%', top: '40%' }} width="30" height="30" viewBox="0 0 30 30">
            <path d="M 15 3 L 16 14 L 27 15 L 16 16 L 15 27 L 14 16 L 3 15 L 14 14 Z" fill="white" opacity="0.9" />
          </svg>
          <svg style={{ position: 'absolute', left: '65%', top: '55%' }} width="16" height="16" viewBox="0 0 16 16">
            <path d="M 8 1 L 9 7 L 15 8 L 9 9 L 8 15 L 7 9 L 1 8 L 7 7 Z" fill="white" opacity="0.7" />
          </svg>
        </>
      )}
      <div
        style={{
          position: 'absolute', top: 8, left: 8,
          padding: '3px 8px', borderRadius: 4,
          background: 'rgba(0,0,0,0.55)', color: 'white',
          fontSize: 9, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em', fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}
