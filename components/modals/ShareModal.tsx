'use client';

import { Share2, Copy } from 'lucide-react';
import { useAppData } from '@/app/(app)/_components/AppDataProvider';
import { useAppTheme } from '@/app/(app)/_components/useAppTheme';
import { shareOrCopy, buildInviteMessage } from '@/lib/utils/share';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ open, onClose }: ShareModalProps) {
  const { data, showToast } = useAppData();
  const { t, bgInner } = useAppTheme();

  if (!open || !data) return null;

  async function handleShare() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const result = await shareOrCopy({
      title: 'CleanMate',
      text: buildInviteMessage(data!.profile?.name ?? '친구', data!.party.invite_code, siteUrl),
    });
    if (result === 'shared') showToast('공유했어요 💌');
    else if (result === 'copied') showToast('링크를 복사했어요 📋');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-t-3xl p-6 animate-slide-up"
        style={{ background: bgInner }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: `${t.accent}30` }} />
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">💌</div>
          <div className="text-lg font-bold mb-1">파트너 초대</div>
          <div className="text-xs opacity-60">초대 코드를 공유해서 같은 파티에 들어오게 해요</div>
        </div>
        <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: `${t.accent}15` }}>
          <div className="text-[10px] opacity-70 mb-1">초대 코드</div>
          <div className="text-3xl font-black font-mono tracking-widest" style={{ color: t.accent }}>
            {data.party.invite_code}
          </div>
        </div>
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mb-2"
          style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}50` }}
        >
          {typeof navigator !== 'undefined' && 'share' in navigator ? (
            <><Share2 size={18} /> 공유하기</>
          ) : (
            <><Copy size={18} /> 링크 복사</>
          )}
        </button>
        <button onClick={onClose} className="w-full p-3 rounded-xl text-xs opacity-60">
          닫기
        </button>
      </div>
    </div>
  );
}
