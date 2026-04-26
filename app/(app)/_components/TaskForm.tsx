'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useAppData } from './AppDataProvider';
import { useAppTheme } from './useAppTheme';
import { createClient } from '@/lib/supabase/client';
import { createTask, updateTask } from '@/lib/db/tasks';
import { TASK_EMOJIS, CYCLE_OPTIONS, WEIGHT_OPTIONS } from '@/lib/constants';
import type { Task } from '@/types/app';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialTask?: Task;
}

export function TaskForm({ mode, initialTask }: TaskFormProps) {
  const router = useRouter();
  const { data, reload, saving, withSaving, showToast } = useAppData();
  const { t, cardBg, inputBg } = useAppTheme();

  const [form, setForm] = useState({
    name: initialTask?.name ?? '',
    emoji: initialTask?.emoji ?? '🧹',
    cycle: initialTask?.cycle ?? 7,
    weight: initialTask?.weight ?? 10,
    assigned_to: initialTask?.assigned_to ?? null,
  });

  async function handleSubmit() {
    await withSaving(async () => {
      if (!form.name.trim()) throw new Error('이름을 입력해주세요');
      const supabase = createClient();
      if (mode === 'create') {
        await createTask(supabase, data!.party.id, form);
        await reload();
        showToast('청소 항목이 추가됐어요');
      } else if (initialTask) {
        await updateTask(supabase, initialTask.id, form);
        await reload();
      }
      router.push('/tasks');
    });
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 p-5">
        <button
          onClick={() => router.push('/tasks')}
          className="p-2 rounded-xl"
          style={{ background: `${t.accent}15` }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="font-bold text-base">{mode === 'create' ? '새 청소 항목' : '항목 수정'}</div>
      </div>
      <div className="px-5 space-y-5">
        <div>
          <label className="text-[11px] font-bold opacity-70 mb-2 block">이름</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="예: 베란다 청소"
            className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none"
            style={{ background: inputBg, color: t.text, border: `1.5px solid ${t.accent}30` }}
            maxLength={20}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold opacity-70 mb-2 block">아이콘</label>
          <div className="grid grid-cols-8 gap-2">
            {TASK_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setForm({ ...form, emoji: e })}
                className="aspect-square rounded-xl flex items-center justify-center text-xl"
                style={{
                  background: form.emoji === e ? t.accent : `${t.accent}15`,
                  border: form.emoji === e ? `2px solid ${t.accentDark}` : 'none',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold opacity-70 mb-2 block">주기</label>
          <div className="grid grid-cols-4 gap-2">
            {CYCLE_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm({ ...form, cycle: c.value })}
                className="py-2.5 rounded-xl text-xs font-bold"
                style={{
                  background: form.cycle === c.value ? t.accent : `${t.accent}15`,
                  color: form.cycle === c.value ? '#FFFBF5' : t.text,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold opacity-70 mb-2 block">중요도</label>
          <div className="grid grid-cols-3 gap-2">
            {WEIGHT_OPTIONS.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => setForm({ ...form, weight: w.value })}
                className="py-3 rounded-xl text-sm font-bold"
                style={{
                  background: form.weight === w.value ? t.accent : `${t.accent}15`,
                  color: form.weight === w.value ? '#FFFBF5' : t.text,
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || !form.name.trim()}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}50` }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {mode === 'create' ? '추가하기' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
