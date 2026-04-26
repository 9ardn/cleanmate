'use client';

import { usePathname, useRouter } from 'next/navigation';

export type TabId = 'home' | 'tasks' | 'verify' | 'rank' | 'me';

interface TabDef {
  id: TabId;
  icon: string;
  label: string;
  href: string;
  match: (path: string) => boolean;
}

const TABS: TabDef[] = [
  { id: 'home',   icon: '⌂', label: '내 방',   href: '/',       match: (p) => p === '/' },
  { id: 'tasks',  icon: '☰', label: '할 일',  href: '/tasks',  match: (p) => p.startsWith('/tasks') },
  { id: 'verify', icon: '◉', label: '인증',   href: '/inbox',  match: (p) => p.startsWith('/inbox') },
  { id: 'rank',   icon: '★', label: '랭킹',   href: '/stats',  match: (p) => p.startsWith('/stats') || p.startsWith('/activity') || p.startsWith('/achievements') },
  { id: 'me',     icon: '◐', label: '프로필', href: '/me',     match: (p) => p.startsWith('/me') || p.startsWith('/settings') },
];

interface TabBarProps {
  /** Override the active id (otherwise inferred from pathname) */
  active?: TabId;
}

export function TabBar({ active }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname() || '/';

  return (
    <div className="tab-bar">
      {TABS.map((t) => {
        const isActive = active ? active === t.id : t.match(pathname);
        return (
          <button
            key={t.id}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => router.push(t.href)}
            type="button"
          >
            <div className="tab-dot">{t.icon}</div>
            <span style={{ fontSize: 9 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
