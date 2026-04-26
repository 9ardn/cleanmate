interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ name, color, size = 32, ring = false }: AvatarProps) {
  const initial = (name || '?')[0].toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color || 'var(--moss)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.42,
        fontWeight: 600,
        border: ring ? '2px solid var(--bg-paper)' : 'none',
        boxShadow: ring ? '0 0 0 2px var(--ink)' : 'none',
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}
