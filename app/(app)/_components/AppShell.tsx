'use client';

import { Suspense, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AppDataProvider, useAppData } from './AppDataProvider';
import { TweaksProvider } from './TweaksProvider';
import { TabBar } from '@/components/ui/TabBar';
import { TweaksPanel } from '@/components/debug/TweaksPanel';
import { LoadingScreen } from '@/components/LoadingScreen';

const HIDE_TAB_PREFIXES = ['/camera', '/tasks/new', '/me/edit', '/onboarding'];
const HIDE_TAB_REGEX = [/^\/tasks\/[^/]+\/edit$/];

function GlobalIndicators() {
  const { saving, toast, apiError } = useAppData();
  return (
    <>
      {saving && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
          style={{ background: 'rgba(31,40,64,0.92)', color: '#F4F7FB', backdropFilter: 'blur(8px)' }}
        >
          <Loader2 size={12} className="animate-spin" /> 저장 중...
        </div>
      )}
      {toast && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold animate-bounce-in"
          style={{ background: 'rgba(31,40,64,0.92)', color: '#F4F7FB', backdropFilter: 'blur(8px)' }}
        >
          {toast}
        </div>
      )}
      {apiError && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          style={{ background: 'var(--berry)', color: '#FFFFFF' }}
        >
          <AlertCircle size={14} /> {apiError}
        </div>
      )}
    </>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const { data, loading, error, reload } = useAppData();

  const hideTab = useMemo(
    () =>
      HIDE_TAB_PREFIXES.some((p) => pathname.startsWith(p)) ||
      HIDE_TAB_REGEX.some((rx) => rx.test(pathname)),
    [pathname],
  );

  if (loading) return <LoadingScreen message="CleanMate 불러오는 중..." />;
  if (error || !data) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--bg-cream)' }}
      >
        <AlertCircle size={40} style={{ color: 'var(--berry)' }} />
        <div className="mt-3 text-sm text-center font-bold">{error ?? '데이터를 불러올 수 없어요'}</div>
        <button
          onClick={reload}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: 'var(--ink)', color: 'var(--bg-cream)' }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: '#C5D0E0' }}
    >
      <GlobalIndicators />
      <div
        className="relative w-full shadow-2xl overflow-hidden"
        style={{
          maxWidth: '430px',
          minHeight: '100vh',
          background: 'var(--bg-cream)',
          color: 'var(--ink)',
        }}
      >
        {children}
        {!hideTab && <TabBar />}
        <Suspense fallback={null}>
          <TweaksPanel />
        </Suspense>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppDataProvider>
      <TweaksProvider>
        <ShellInner>{children}</ShellInner>
      </TweaksProvider>
    </AppDataProvider>
  );
}
