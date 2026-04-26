'use client';

import { useAppTheme } from '@/app/(app)/_components/useAppTheme';
import { REJECT_REASONS } from '@/lib/constants';
import type { Verification } from '@/types/app';

interface RejectDialogProps {
  verif: Verification | null;
  busy?: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export function RejectDialog({ verif, busy, onClose, onReject }: RejectDialogProps) {
  const { t, bgInner } = useAppTheme();
  if (!verif) return null;

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
        <div className="text-base font-bold mb-1">왜 다시 해야 할까요?</div>
        <div className="text-xs opacity-60 mb-4">{verif.task?.name} 인증을 반려해요</div>
        <div className="space-y-2">
          {REJECT_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => onReject(r)}
              disabled={busy}
              className="w-full text-left p-3.5 rounded-xl text-sm font-bold disabled:opacity-50"
              style={{ background: `${t.accent}15`, color: t.text }}
            >
              {r}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full p-3 mt-3 rounded-xl text-xs opacity-60">
          취소
        </button>
      </div>
    </div>
  );
}
