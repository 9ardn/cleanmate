'use client';

import { useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Clock, Loader2 } from 'lucide-react';
import { useAppData } from '../../_components/AppDataProvider';
import { useAppTheme } from '../../_components/useAppTheme';
import { createClient } from '@/lib/supabase/client';
import { createVerification } from '@/lib/db/verifications';
import { isInQuietHours, sendBrowserNotification } from '@/lib/utils/notification';

export default function CameraPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const { data, reload, saving, withSaving } = useAppData();
  const { t } = useAppTheme();

  const [sent, setSent] = useState(false);

  const currentTask = useMemo(
    () => data!.tasks.find((tk) => tk.id === taskId),
    [data, taskId],
  );
  const partner = useMemo(
    () => data!.members.find((m) => m.id !== data!.userId),
    [data],
  );
  const me = data!.profile;

  async function handleSubmit() {
    if (!currentTask) return;
    await withSaving(async () => {
      const supabase = createClient();
      await createVerification(supabase, currentTask.id, `${currentTask.emoji}✨`);
      if (data!.notifications?.enabled && !isInQuietHours(data!.notifications)) {
        sendBrowserNotification(
          `${me?.name}님이 인증 요청을 보냈어요`,
          `${currentTask.emoji} ${currentTask.name} — 확인해주세요`,
        );
      }
      await reload();
      setSent(true);
    });
  }

  if (!currentTask) {
    return (
      <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-base font-bold mb-3">청소 항목을 찾을 수 없어요</div>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl font-bold text-sm"
          style={{ background: t.accent, color: '#FFFBF5' }}
        >
          홈으로
        </button>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center p-6">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-float"
          style={{ background: `${t.accent}20` }}
        >
          <Clock size={40} style={{ color: t.accent }} />
        </div>
        <div className="text-xl font-bold mb-2">보냈어요!</div>
        <div className="text-sm opacity-60 text-center mb-8 max-w-xs">
          {partner?.name ?? '파트너'} 님이 확인하면
          <br />
          스트릭이 +1 올라가요
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl font-bold text-sm"
          style={{ background: t.accent, color: '#FFFBF5' }}
        >
          홈으로
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen flex flex-col" style={{ background: '#1A1A1A', color: '#FFFBF5' }}>
      <div className="flex items-center justify-between p-5">
        <button onClick={() => router.push('/')} className="p-2 rounded-xl bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="text-sm font-bold">{currentTask.name} 인증</div>
        <div className="w-9" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div
          className="w-full aspect-square rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${t.accent}40, ${t.accentDark}60)`,
            border: '2px dashed rgba(255,255,255,0.3)',
          }}
        >
          <div className="text-center">
            <div className="text-7xl mb-3 animate-float">{currentTask.emoji}</div>
            <div className="text-sm opacity-70">완료한 모습을 찍어주세요</div>
            <div className="text-[10px] opacity-50 mt-2">
              (MVP: 실제 카메라는 추후 구현 / photo_placeholder 사용 중)
            </div>
          </div>
        </div>
        <div className="text-center mb-6">
          <div className="text-lg font-bold mb-1">{partner?.name ?? '파트너'} 님이 확인하면 완료돼요</div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}60` }}
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
          인증 사진 보내기
        </button>
      </div>
    </div>
  );
}
