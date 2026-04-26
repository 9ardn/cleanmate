'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppData } from '../../../_components/AppDataProvider';
import { useAppTheme } from '../../../_components/useAppTheme';
import { TaskForm } from '../../../_components/TaskForm';

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data } = useAppData();
  const { t } = useAppTheme();

  const task = data!.tasks.find((tk) => tk.id === id);

  if (!task) {
    return (
      <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-base font-bold mb-3">항목을 찾을 수 없어요</div>
        <button
          onClick={() => router.push('/tasks')}
          className="px-6 py-3 rounded-xl font-bold text-sm"
          style={{ background: t.accent, color: '#FFFBF5' }}
        >
          항목 목록으로
        </button>
      </div>
    );
  }

  return <TaskForm mode="edit" initialTask={task} />;
}
