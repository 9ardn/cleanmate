'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useAppTheme } from '@/app/(app)/_components/useAppTheme';
import type { Task } from '@/types/app';

interface DeleteConfirmDialogProps {
  task: Task | null;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ task, busy, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const { t, bgInner } = useAppTheme();
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-2xl p-6 animate-bounce-in"
        style={{ background: bgInner }}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{task.emoji}</div>
          <div className="text-base font-bold mb-1">정말 삭제할까요?</div>
          <div className="text-xs opacity-60">&apos;{task.name}&apos; 항목을 삭제해요</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold"
            style={{ background: `${t.accent}15`, color: t.text }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{ background: '#C46E52', color: '#FFFBF5' }}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
