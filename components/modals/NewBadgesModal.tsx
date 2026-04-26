'use client';

import { useAppTheme } from '@/app/(app)/_components/useAppTheme';
import { getBadgeMeta } from '@/lib/domain/badges';

interface NewBadgesModalProps {
  badgeIds: string[];
  onClose: () => void;
}

export function NewBadgesModal({ badgeIds, onClose }: NewBadgesModalProps) {
  const { t, bgInner } = useAppTheme();
  if (badgeIds.length === 0) return null;

  const badges = badgeIds.map(getBadgeMeta).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-3xl p-6 animate-bounce-in text-center"
        style={{ background: bgInner }}
      >
        <div className="text-xs font-bold opacity-70 mb-2">🎉 새 배지를 획득했어요</div>
        <div className="text-lg font-black mb-5" style={{ color: t.accent }}>
          {badges.length === 1 ? '배지 1개' : `배지 ${badges.length}개`} 획득!
        </div>
        <div className="space-y-3 mb-5">
          {badges.map((b) => (
            <div
              key={b!.id}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: `${t.accent}15` }}
            >
              <div className="text-3xl">{b!.icon}</div>
              <div className="text-left flex-1">
                <div className="text-sm font-bold">{b!.name}</div>
                <div className="text-[11px] opacity-70 leading-tight mt-0.5">{b!.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-bold"
          style={{ background: t.accent, color: '#FFFBF5' }}
        >
          확인
        </button>
      </div>
    </div>
  );
}
