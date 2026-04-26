'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit3, Trash2, Loader2 } from 'lucide-react';
import { useAppData } from '../_components/AppDataProvider';
import { useAppTheme } from '../_components/useAppTheme';
import { createClient } from '@/lib/supabase/client';
import { deleteTask as dbDeleteTask } from '@/lib/db/tasks';
import { CYCLE_OPTIONS } from '@/lib/constants';
import type { Task } from '@/types/app';

export default function TasksPage() {
  const router = useRouter();
  const { data, reload, saving, withSaving } = useAppData();
  const { t, cardBg, bgInner } = useAppTheme();

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  async function handleDelete() {
    if (!deletingTask) return;
    await withSaving(async () => {
      const supabase = createClient();
      await dbDeleteTask(supabase, deletingTask.id);
      await reload();
      setDeletingTask(null);
    });
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="font-bold text-base">청소 항목 관리</div>
            <div className="text-[11px] opacity-60">{data!.tasks.length}개의 항목</div>
          </div>
        </div>
        <Link
          href="/tasks/new"
          className="p-2 rounded-xl"
          style={{ background: t.accent, color: '#FFFBF5' }}
        >
          <Plus size={18} />
        </Link>
      </div>
      <div className="px-5 space-y-2">
        {data!.tasks.map((task, idx) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-2xl animate-slide-up"
            style={{ background: cardBg, animationDelay: `${idx * 40}ms` }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${t.accent}15` }}
            >
              {task.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] truncate">{task.name}</div>
              <div className="text-[11px] opacity-60 mt-0.5">
                {CYCLE_OPTIONS.find((c) => c.value === task.cycle)?.label ?? `${task.cycle}일`} ·
                {!task.assigned_to
                  ? ' 공동'
                  : ` ${data!.members.find((m) => m.id === task.assigned_to)?.name ?? '담당자'}`}
              </div>
            </div>
            <Link
              href={`/tasks/${task.id}/edit`}
              className="p-2 rounded-lg"
              style={{ background: `${t.accent}15` }}
            >
              <Edit3 size={14} style={{ color: t.accent }} />
            </Link>
            <button onClick={() => setDeletingTask(task)} className="p-2 rounded-lg" style={{ background: `${t.accent}15` }}>
              <Trash2 size={14} style={{ color: t.accent }} />
            </button>
          </div>
        ))}
        {data!.tasks.length === 0 && (
          <div className="text-center py-16 opacity-50">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-sm">등록된 청소 항목이 없어요</div>
          </div>
        )}
      </div>

      {deletingTask && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeletingTask(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl p-6 animate-bounce-in"
            style={{ background: bgInner }}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{deletingTask.emoji}</div>
              <div className="text-base font-bold mb-1">정말 삭제할까요?</div>
              <div className="text-xs opacity-60">&apos;{deletingTask.name}&apos; 항목을 삭제해요</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingTask(null)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{ background: `${t.accent}15`, color: t.text }}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: '#C46E52', color: '#FFFBF5' }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
