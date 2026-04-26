import type { CSSProperties, ReactNode } from 'react';

interface TicketProps {
  children: ReactNode;
  perforated?: boolean;
  style?: CSSProperties;
}

export function Ticket({ children, perforated = false, style }: TicketProps) {
  return (
    <div
      style={{
        background: 'var(--bg-paper)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        padding: 16,
        position: 'relative',
        ...style,
      }}
    >
      {perforated && (
        <>
          <div
            style={{
              position: 'absolute', left: -7, top: '50%',
              width: 14, height: 14, borderRadius: '50%',
              background: 'var(--bg-cream)', border: '1px solid var(--line)',
              transform: 'translateY(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute', right: -7, top: '50%',
              width: 14, height: 14, borderRadius: '50%',
              background: 'var(--bg-cream)', border: '1px solid var(--line)',
              transform: 'translateY(-50%)',
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}
