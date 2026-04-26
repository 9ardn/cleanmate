'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Clock, Loader2 } from 'lucide-react';
import { useAppData } from '../_components/AppDataProvider';
import { useAppTheme } from '../_components/useAppTheme';
import { createClient } from '@/lib/supabase/client';
import { approveVerification, rejectVerification } from '@/lib/db/verifications';
import { REJECT_REASONS } from '@/lib/constants';
import { formatShortDateTime } from '@/lib/utils/date';
import type { Verification } from '@/types/app';

export default function InboxPage() {
  const router = useRouter();
  const { data, reload, saving, withSaving, showToast } = useAppData();
  const { t, cardBg, bgInner } = useAppTheme();

  const [rejectingVerif, setRejectingVerif] = useState<Verification | null>(null);

  const partner = useMemo(
    () => data!.members.find((m) => m.id !== data!.userId),
    [data],
  );
  const pendingForMe = useMemo(
    () => data!.verifications.filter((v) => v.status === 'pending' && v.requested_by !== data!.userId),
    [data],
  );
  const sentByMe = useMemo(
    () => data!.verifications.filter((v) => v.status === 'pending' && v.requested_by === data!.userId),
    [data],
  );

  async function handleApprove(verifId: string) {
    await withSaving(async () => {
      const supabase = createClient();
      await approveVerification(supabase, verifId, data!.userId);
      await reload();
      showToast('✨ 인증을 승인했어요');
      router.push('/');
    });
  }

  async function handleReject(reason: string) {
    if (!rejectingVerif) return;
    await withSaving(async () => {
      const supabase = createClient();
      await rejectVerification(supabase, rejectingVerif.id, data!.userId, reason);
      await reload();
      setRejectingVerif(null);
      router.push('/');
    });
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 p-5">
        <button onClick={() => router.push('/')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="font-bold text-base">인증 요청함</div>
          <div className="text-[11px] opacity-60">파트너가 보낸 요청</div>
        </div>
      </div>
      <div className="px-5">
        {pendingForMe.length === 0 && (
          <div className="text-center py-16 opacity-50">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm">아직 확인할 요청이 없어요</div>
          </div>
        )}
        {pendingForMe.map((verif, idx) => {
          const requester = data!.members.find((m) => m.id === verif.requested_by);
          return (
            <div
              key={verif.id}
              className="rounded-2xl p-4 mb-3 animate-slide-up"
              style={{ background: cardBg, animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ background: t.accent }}
                >
                  {requester?.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-70">
                    <b>{requester?.name}</b>님이 인증을 요청했어요
                  </div>
                  <div className="text-[10px] opacity-50">
                    {formatShortDateTime(verif.requested_at)}
                    {verif.task && ` · ${verif.task.name}`}
                  </div>
                </div>
              </div>
              <div
                className="aspect-video rounded-xl flex items-center justify-center mb-3 text-5xl"
                style={{ background: `linear-gradient(135deg, ${t.accent}30, ${t.accentDark}40)` }}
              >
                {verif.photo_placeholder ?? verif.task?.emoji ?? '📸'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRejectingVerif(verif)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                  style={{ background: `${t.accent}15`, color: t.text }}
                >
                  <X size={16} /> 다시 해줘
                </button>
                <button
                  onClick={() => handleApprove(verif.id)}
                  disabled={saving}
                  className="flex-[2] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                  style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 4px 12px ${t.accent}50` }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 확인했어요
                </button>
              </div>
            </div>
          );
        })}

        {sentByMe.length > 0 && (
          <>
            <div className="mt-6 mb-2 text-xs opacity-60 font-bold px-1">내가 보낸 요청</div>
            {sentByMe.map((verif) => (
              <div
                key={verif.id}
                className="rounded-2xl p-3 mb-2 flex items-center gap-3"
                style={{ background: `${t.accent}10` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${t.accent}20` }}
                >
                  {verif.task?.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{verif.task?.name}</div>
                  <div className="text-[11px] opacity-60">{partner?.name} 님 확인 대기 중...</div>
                </div>
                <Clock size={16} style={{ color: t.accent }} />
              </div>
            ))}
          </>
        )}
      </div>

      {rejectingVerif && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setRejectingVerif(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[430px] rounded-t-3xl p-6 animate-slide-up"
            style={{ background: bgInner }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: `${t.accent}30` }} />
            <div className="text-base font-bold mb-1">왜 다시 해야 할까요?</div>
            <div className="text-xs opacity-60 mb-4">{rejectingVerif.task?.name} 인증을 반려해요</div>
            <div className="space-y-2">
              {REJECT_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleReject(r)}
                  disabled={saving}
                  className="w-full text-left p-3.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: `${t.accent}15`, color: t.text }}
                >
                  {r}
                </button>
              ))}
            </div>
            <button onClick={() => setRejectingVerif(null)} className="w-full p-3 mt-3 rounded-xl text-xs opacity-60">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
