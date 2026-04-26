'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Bell, Share2, ChevronRight, LogOut, Users,
} from 'lucide-react';
import { useAppData } from '../_components/AppDataProvider';
import { useAppTheme } from '../_components/useAppTheme';
import { ShareModal } from '../_components/ShareModal';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const { data } = useAppData();
  const { t, cardBg } = useAppTheme();
  const [showShareModal, setShowShareModal] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 p-5">
        <button onClick={() => router.push('/me')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="font-bold text-base">설정</div>
          <div className="text-[11px] opacity-60">{data!.party.name}</div>
        </div>
      </div>

      <div className="px-5 space-y-3">
        <Link
          href="/settings/notifications"
          className="block w-full rounded-2xl p-4 flex items-center justify-between"
          style={{ background: cardBg }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.accent}15` }}>
              <Bell size={16} style={{ color: t.accent }} />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">알림 설정</div>
              <div className="text-[10px] opacity-50">{data!.notifications?.enabled ? '켜짐' : '꺼짐'}</div>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: t.accent }} />
        </Link>

        <button
          onClick={() => setShowShareModal(true)}
          className="w-full rounded-2xl p-4 flex items-center justify-between"
          style={{ background: cardBg }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.accent}15` }}>
              <Share2 size={16} style={{ color: t.accent }} />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">파트너 초대</div>
              <div className="text-[10px] opacity-50">
                초대 코드: <span className="font-mono">{data!.party.invite_code}</span>
              </div>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: t.accent }} />
        </button>

        <Link
          href="/settings/partner"
          className="block w-full rounded-2xl p-4 flex items-center justify-between"
          style={{ background: cardBg }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.accent}15` }}>
              <Users size={16} style={{ color: t.accent }} />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">파트너 관리</div>
              <div className="text-[10px] opacity-50">파티 멤버 보기</div>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: t.accent }} />
        </Link>

        <div className="rounded-2xl p-4" style={{ background: cardBg }}>
          <div className="text-xs font-bold opacity-70 mb-3">파티 멤버</div>
          {data!.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `${t.accent}20` }}>
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
          onClick={handleLogout}
          className="w-full rounded-2xl p-4 flex items-center justify-center gap-2"
          style={{ background: `${t.accent}20`, color: t.accent, fontWeight: 'bold', fontSize: '13px' }}
        >
          <LogOut size={14} /> 로그아웃
        </button>
      </div>

      <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
}
