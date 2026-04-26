'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TaskIcon } from '@/components/ui/TaskIcon';
import type { TaskKind } from '@/lib/constants';

type TaskStatus = 'pending' | 'upcoming' | 'done';

interface TaskItem {
  id: TaskKind;
  name: string;
  cycle: string;
  who: string;
  wholeDays: number;
  status: TaskStatus;
  priority: 'high' | 'mid' | 'low';
}

const TASKS: TaskItem[] = [
  { id: 'floor',   name: '거실 바닥 청소',  cycle: '매일',   who: '민지', wholeDays:  0, status: 'pending',  priority: 'high' },
  { id: 'dishes',  name: '설거지',           cycle: '매일',   who: '유준', wholeDays:  0, status: 'pending',  priority: 'high' },
  { id: 'trash',   name: '쓰레기 분리수거', cycle: '주 2회', who: '민지', wholeDays:  1, status: 'upcoming', priority: 'mid'  },
  { id: 'bath',    name: '욕실 청소',        cycle: '주 1회', who: '유준', wholeDays:  2, status: 'upcoming', priority: 'mid'  },
  { id: 'fridge',  name: '냉장고 정리',      cycle: '월 1회', who: '민지', wholeDays:  6, status: 'upcoming', priority: 'low'  },
  { id: 'laundry', name: '빨래',             cycle: '주 2회', who: '유준', wholeDays: -1, status: 'done',     priority: 'mid'  },
  { id: 'bed',     name: '침구 정리',        cycle: '매주',   who: '민지', wholeDays: -2, status: 'done',     priority: 'low'  },
];

const FILTERS = [
  { id: 'all',     label: '전체' },
  { id: 'today',   label: '오늘' },
  { id: 'mine',    label: '나' },
  { id: 'partner', label: '유준' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export default function TasksPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>('all');

  const filtered = TASKS.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'mine') return t.who === '민지';
    if (filter === 'partner') return t.who === '유준';
    if (filter === 'today') return t.wholeDays === 0;
    return true;
  });

  const open = filtered.filter((t) => t.status !== 'done');
  const done = filtered.filter((t) => t.status === 'done');

  return (
    <div className="app-screen">
      <ScreenHeader
        title="할 일"
        subtitle="3 OPEN · 2 DONE TODAY"
        right={
          <button
            onClick={() => router.push('/tasks/new')}
            aria-label="새 할 일"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--ink)', color: 'white',
              border: 0, fontSize: 18, cursor: 'pointer',
            }}
          >
            +
          </button>
        }
      />

      <div style={{ padding: '6px 18px 12px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              border: '1px solid ' + (filter === f.id ? 'var(--ink)' : 'var(--line)'),
              background: filter === f.id ? 'var(--ink)' : 'var(--bg-paper)',
              color: filter === f.id ? 'var(--bg-cream)' : 'var(--ink)',
              fontSize: 12,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '0 18px 100px' }}>
        <div className="eyebrow" style={{ margin: '8px 0 8px' }}>진행 중 · {open.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {open.map((t) => (
            <TaskRow key={t.id} task={t} onClick={() => router.push(`/tasks/${t.id}`)} />
          ))}
        </div>

        {done.length > 0 && (
          <>
            <div className="eyebrow" style={{ margin: '20px 0 8px' }}>완료 · 오늘</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {done.map((t) => (
                <TaskRow key={t.id} task={t} done onClick={() => router.push(`/tasks/${t.id}`)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface TaskRowProps {
  task: TaskItem;
  done?: boolean;
  onClick?: () => void;
}

function TaskRow({ task, done, onClick }: TaskRowProps) {
  const dueLabel =
    task.wholeDays === 0
      ? '오늘'
      : task.wholeDays === 1
      ? '내일'
      : task.wholeDays < 0
      ? `${-task.wholeDays}일 전 완료`
      : `D-${task.wholeDays}`;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        background: 'var(--bg-paper)',
        border: '1px solid var(--line-soft)',
        borderRadius: 'var(--r-md)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        opacity: done ? 0.55 : 1,
      }}
    >
      <TaskIcon kind={task.id} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>
          {task.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.04em' }}>
            {task.cycle}
          </span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--ink-mute)' }} />
          <Avatar name={task.who} color={task.who === '민지' ? '#5B8DB8' : '#B886D9'} size={18} />
          <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{task.who}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: task.wholeDays === 0 ? 'var(--terra-deep)' : 'var(--ink-mute)',
            fontWeight: 600,
          }}
        >
          {dueLabel}
        </div>
        {task.priority === 'high' && !done && <span className="dot dirty" style={{ marginTop: 4 }} />}
      </div>
    </button>
  );
}
