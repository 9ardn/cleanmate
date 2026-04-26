'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AppDataProvider, useAppData } from './AppDataProvider';
import { useAppTheme } from './useAppTheme';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';

const HIDE_NAV_PREFIXES = [
  '/camera',
  '/tasks/new',
  '/me/edit',
];
const HIDE_NAV_REGEX = [
  /^\/tasks\/[^/]+\/edit$/,
];

function GlobalIndicators() {
  const { saving, toast, apiError } = useAppData();
  return (
    <>
      {saving && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
          style={{ background: 'rgba(43,32,23,0.92)', color: '#F5EDE0', backdropFilter: 'blur(8px)' }}
        >
          <Loader2 size={12} className="animate-spin" /> 저장 중...
        </div>
      )}
      {toast && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold animate-bounce-in"
          style={{ background: 'rgba(43,32,23,0.92)', color: '#F5EDE0', backdropFilter: 'blur(8px)' }}
        >
          {toast}
        </div>
      )}
      {apiError && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          style={{ background: '#C46E52', color: '#FFFBF5' }}
        >
          <AlertCircle size={14} /> {apiError}
        </div>
      )}
    </>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading, error, reload } = useAppData();
  const theme = useAppTheme();

  const pendingForMe = useMemo(
    () => (data?.verifications ?? []).filter(
      (v) => v.status === 'pending' && v.requested_by !== data?.userId,
    ),
    [data?.verifications, data?.userId],
  );

  if (loading) return <LoadingScreen message="CleanMate 불러오는 중..." />;
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#F5EDE0' }}>
        <AlertCircle size={40} style={{ color: '#C46E52' }} />
        <div className="mt-3 text-sm text-center font-bold">{error ?? '데이터를 불러올 수 없어요'}</div>
        <button
          onClick={reload}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: '#D4824A', color: '#FFFBF5' }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const hideNav =
    HIDE_NAV_PREFIXES.some((p) => pathname.startsWith(p)) ||
    HIDE_NAV_REGEX.some((rx) => rx.test(pathname));

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: theme.bgOuter, transition: 'background 800ms ease-in-out' }}
    >
      <GlobalIndicators />
      <div
        className="relative w-full shadow-2xl overflow-hidden"
        style={{
          maxWidth: '430px',
          minHeight: '100vh',
          background: theme.bgInner,
          color: theme.t.text,
          transition: 'all 800ms ease-in-out',
        }}
      >
        {children}
        {!hideNav && (
          <BottomNav state={theme.state} inboxBadge={pendingForMe.length} />
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppDataProvider>
      <ShellInner>{children}</ShellInner>
    </AppDataProvider>
  );
}
