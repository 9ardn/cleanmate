'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useAppData } from '../../_components/AppDataProvider';
import { useAppTheme } from '../../_components/useAppTheme';
import { ShareModal } from '../../_components/ShareModal';

export default function SettingsPartnerPage() {
  const router = useRouter();
  const { data } = useAppData();
  const { t, cardBg } = useAppTheme();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 p-5">
        <button onClick={() => router.push('/settings')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="font-bold text-base">파트너 관리</div>
          <div className="text-[11px] opacity-60">{data!.party.name}</div>
        </div>
      </div>

      <div className="px-5 space-y-3">
        <div className="rounded-2xl p-4" style={{ background: cardBg }}>
          <div className="text-xs font-bold opacity-70 mb-3">파티 멤버 ({data!.members.length}명)</div>
          {data!.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: `${t.accent}20` }}>
                {m.emoji}
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">
                  {m.name} {m.id === data!.userId && <span className="text-[10px] opacity-60">(나)</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="w-full rounded-2xl p-4 flex items-center justify-center gap-2"
          style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 4px 12px ${t.accent}40` }}
        >
          <Share2 size={16} /> <span className="font-bold text-sm">파트너 초대 코드 공유</span>
        </button>

        <div className="rounded-2xl p-4 text-center" style={{ background: `${t.accent}10` }}>
          <div className="text-[10px] opacity-70 mb-1">초대 코드</div>
          <div className="text-2xl font-black font-mono tracking-widest" style={{ color: t.accent }}>
            {data!.party.invite_code}
          </div>
        </div>
      </div>

      <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
}
