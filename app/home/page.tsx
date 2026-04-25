'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell, Flame, Clock, ChevronRight, ArrowLeft, Loader2,
  Share2, Camera, Check, X, Plus, Edit3, Trash2, Save,
  AlertCircle, User, Award, Trophy, Settings, History,
  TrendingUp, Users, CheckCircle2, XCircle, Copy, Sparkles,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LivingRoom } from '@/components/LivingRoom';
import { BottomNav } from '@/components/BottomNav';
import { Toggle } from '@/components/Toggle';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAppData } from '@/hooks/useAppData';
import { calculateScore, getStateFromScore, getDaysSince } from '@/lib/domain/score';
import { getLevel } from '@/lib/domain/level';
import {
  THEME, BADGES, AVATAR_EMOJIS, TASK_EMOJIS,
  CYCLE_OPTIONS, WEIGHT_OPTIONS, REJECT_REASONS,
} from '@/lib/constants';
import { updateMyProfile } from '@/lib/db/profile';
import {
  createTask as dbCreateTask, updateTask as dbUpdateTask, deleteTask as dbDeleteTask,
} from '@/lib/db/tasks';
import {
  createVerification, approveVerification, rejectVerification,
} from '@/lib/db/verifications';
import { updateMyNotificationSettings } from '@/lib/db/notifications';
import {
  requestNotificationPermission, sendBrowserNotification, isInQuietHours,
} from '@/lib/utils/notification';
import { shareOrCopy, buildInviteMessage } from '@/lib/utils/share';
import { formatShortDateTime } from '@/lib/utils/date';
import type { Task, Verification, NotificationSettings } from '@/types/app';

type View =
  | 'home' | 'inbox' | 'camera' | 'waiting'
  | 'tasks' | 'add_task' | 'edit_task'
  | 'stats' | 'activity'
  | 'mypage' | 'edit_profile' | 'achievements'
  | 'settings' | 'notifications';

export default function HomePage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAppData();

  const [view, setView] = useState<View>('home');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Interaction state
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [rejectingVerif, setRejectingVerif] = useState<Verification | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Forms
  const [taskForm, setTaskForm] = useState({
    name: '', emoji: '🧹', cycle: 7, weight: 10, assigned_to: null as string | null,
  });
  const [profileForm, setProfileForm] = useState({ name: '', emoji: '🐻' });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const withSaving = async (fn: () => Promise<void>) => {
    setSaving(true); setApiError(null);
    try { await fn(); }
    catch (e) {
      setApiError((e as Error).message);
      setTimeout(() => setApiError(null), 3500);
    } finally { setSaving(false); }
  };

  // Derived values (hooks must be called unconditionally — guard inside)
  const score = useMemo(
    () => calculateScore(data?.tasks ?? []),
    [data?.tasks]
  );
  const state = getStateFromScore(score);
  const t = THEME[state];

  const me = data?.profile;
  const partner = data?.members.find((m) => m.id !== data?.userId);

  const pendingForMe = useMemo(
    () => (data?.verifications ?? []).filter(
      (v) => v.status === 'pending' && v.requested_by !== data?.userId
    ),
    [data?.verifications, data?.userId]
  );

  const sentByMe = useMemo(
    () => (data?.verifications ?? []).filter(
      (v) => v.status === 'pending' && v.requested_by === data?.userId
    ),
    [data?.verifications, data?.userId]
  );

  const myScore = useMemo(
    () => data?.scores.find((s) => s.user_id === data?.userId)?.score ?? 0,
    [data?.scores, data?.userId]
  );
  const myLevel = useMemo(() => getLevel(myScore), [myScore]);

  // Now we can early return
  if (loading) return <LoadingScreen message="CleanMate 불러오는 중..." />;
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#F5EDE0' }}>
        <AlertCircle size={40} style={{ color: '#C46E52' }} />
        <div className="mt-3 text-sm text-center font-bold">{error ?? '데이터를 불러올 수 없어요'}</div>
        <button
          onClick={reload}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: '#D4824A', color: '#FFFBF5' }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // Handlers
  async function handleCompleteTask(task: Task) {
    setCurrentTask(task);
    setView('camera');
  }

  async function handleSubmitVerification() {
    if (!currentTask) return;
    await withSaving(async () => {
      const supabase = createClient();
      await createVerification(supabase, currentTask.id, `${currentTask.emoji}✨`);
      if (data?.notifications?.enabled && !isInQuietHours(data.notifications)) {
        sendBrowserNotification(
          `${me?.name}님이 인증 요청을 보냈어요`,
          `${currentTask.emoji} ${currentTask.name} — 확인해주세요`
        );
      }
      await reload();
      setCurrentTask(null);
      setView('waiting');
    });
  }

  async function handleApprove(verifId: string) {
    await withSaving(async () => {
      const supabase = createClient();
      await approveVerification(supabase, verifId, data!.userId);
      await reload();
      setView('home');
      showToast('✨ 인증을 승인했어요');
    });
  }

  async function handleReject(reason: string) {
    if (!rejectingVerif) return;
    await withSaving(async () => {
      const supabase = createClient();
      await rejectVerification(supabase, rejectingVerif.id, data!.userId, reason);
      await reload();
      setRejectingVerif(null);
      setView('home');
    });
  }

  async function handleAddTask() {
    await withSaving(async () => {
      if (!taskForm.name.trim()) throw new Error('이름을 입력해주세요');
      const supabase = createClient();
      await dbCreateTask(supabase, data!.party.id, taskForm);
      await reload();
      setTaskForm({ name: '', emoji: '🧹', cycle: 7, weight: 10, assigned_to: null });
      setView('tasks');
      showToast('청소 항목이 추가됐어요');
    });
  }

  async function handleSaveEdit() {
    if (!editingTask) return;
    await withSaving(async () => {
      if (!taskForm.name.trim()) throw new Error('이름을 입력해주세요');
      const supabase = createClient();
      await dbUpdateTask(supabase, editingTask.id, taskForm);
      await reload();
      setEditingTask(null);
      setView('tasks');
    });
  }

  async function handleDelete() {
    if (!deletingTask) return;
    await withSaving(async () => {
      const supabase = createClient();
      await dbDeleteTask(supabase, deletingTask.id);
      await reload();
      setDeletingTask(null);
    });
  }

  async function handleSaveProfile() {
    await withSaving(async () => {
      if (!profileForm.name.trim()) throw new Error('이름을 입력해주세요');
      const supabase = createClient();
      await updateMyProfile(supabase, profileForm);
      await reload();
      setView('mypage');
      showToast('프로필이 저장됐어요');
    });
  }

  async function handleToggleNotifications(enabled: boolean) {
    if (enabled) {
      const perm = await requestNotificationPermission();
      const isGranted = perm === 'granted';
      await withSaving(async () => {
        const supabase = createClient();
        await updateMyNotificationSettings(supabase, { enabled: isGranted });
        await reload();
        if (isGranted) {
          sendBrowserNotification('알림이 켜졌어요 🔔', 'CleanMate가 중요한 순간에 알려드릴게요');
          showToast('알림이 켜졌어요');
        } else {
          showToast('브라우저 설정에서 알림을 허용해주세요');
        }
      });
    } else {
      await withSaving(async () => {
        const supabase = createClient();
        await updateMyNotificationSettings(supabase, { enabled: false });
        await reload();
        showToast('알림이 꺼졌어요');
      });
    }
  }

  async function handleToggleNotifSetting(key: keyof NotificationSettings) {
    await withSaving(async () => {
      const supabase = createClient();
      await updateMyNotificationSettings(supabase, {
        [key]: !(data!.notifications as any)[key as string],
      });
      await reload();
    });
  }

  async function handleShare() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const result = await shareOrCopy({
      title: 'CleanMate',
      text: buildInviteMessage(me?.name ?? '친구', data!.party.invite_code, siteUrl),
    });
    if (result === 'shared') showToast('공유했어요 💌');
    else if (result === 'copied') showToast('링크를 복사했어요 📋');
    setShowShareModal(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  function openAddTask() {
    setTaskForm({ name: '', emoji: '🧹', cycle: 7, weight: 10, assigned_to: null });
    setView('add_task');
  }
  function openEditTask(task: Task) {
    setEditingTask(task);
    setTaskForm({
      name: task.name, emoji: task.emoji, cycle: task.cycle,
      weight: task.weight, assigned_to: task.assigned_to,
    });
    setView('edit_task');
  }
  function openEditProfile() {
    if (!me) return;
    setProfileForm({ name: me.name, emoji: me.emoji });
    setView('edit_profile');
  }

  const bgOuter = state === 'critical' ? '#1A0F08' : state === 'dirty' ? '#5C4433' : '#F5EDE0';
  const bgInner = state === 'critical' ? '#241812' : state === 'dirty' ? '#4F3828' : '#FAF4EB';
  const cardBg = state === 'critical' || state === 'dirty' ? 'rgba(255, 251, 245, 0.08)' : '#FFFBF5';
  const inputBg = cardBg;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: bgOuter, transition: 'background 800ms ease-in-out' }}
    >
      {/* Saving indicator */}
      {saving && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
          style={{ background: 'rgba(43,32,23,0.92)', color: '#F5EDE0', backdropFilter: 'blur(8px)' }}
        >
          <Loader2 size={12} className="animate-spin" /> 저장 중...
        </div>
      )}
      {toast && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold animate-bounce-in"
          style={{ background: 'rgba(43,32,23,0.92)', color: '#F5EDE0', backdropFilter: 'blur(8px)' }}
        >
          {toast}
        </div>
      )}
      {apiError && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          style={{ background: '#C46E52', color: '#FFFBF5' }}
        >
          <AlertCircle size={14} /> {apiError}
        </div>
      )}

      <div
        className="relative w-full shadow-2xl overflow-hidden"
        style={{ maxWidth: '430px', minHeight: '100vh', background: bgInner, color: t.text, transition: 'all 800ms ease-in-out' }}
      >
        {/* ===== HOME ===== */}
        {view === 'home' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <button
                onClick={() => setView('mypage')}
                className="flex items-center gap-2 active:scale-95 transition-transform"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style={{ background: t.accent, color: '#FFFBF5' }}
                >
                  {me?.emoji}
                </div>
                <div className="text-left">
                  <div className="text-[11px] opacity-60 leading-none">
                    Lv.{myLevel.level} {myLevel.title}
                  </div>
                  <div className="text-sm font-bold leading-tight">{me?.name} 님</div>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-xl active:scale-90 transition-transform"
                  style={{ background: `${t.accent}15` }}
                >
                  <Share2 size={18} style={{ color: t.text }} />
                </button>
                <button
                  onClick={() => setView('inbox')}
                  className="relative p-2 rounded-xl active:scale-90 transition-transform"
                  style={{ background: `${t.accent}15` }}
                >
                  <Bell size={18} style={{ color: t.text }} />
                  {pendingForMe.length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce-in"
                      style={{ background: t.accent, color: '#FFFBF5' }}
                    >
                      {pendingForMe.length}
                    </span>
                  )}
                </button>
                <div
                  className="flex items-center gap-1 px-3 py-2 rounded-xl"
                  style={{ background: t.accent, color: '#FFFBF5' }}
                >
                  <Flame size={16} />
                  <span className="text-sm font-bold">{data.streak?.current ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.moodEmoji}</span>
                  <div>
                    <div className="text-[11px] opacity-60 leading-none">우리 집 상태</div>
                    <div className="text-base font-bold leading-tight">{t.mood}</div>
                  </div>
                </div>
                <div
                  className="text-3xl font-black tracking-tight font-display"
                  style={{ color: t.accent }}
                >
                  {score}
                </div>
              </div>
              <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: `${t.accent}20` }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${score}%`,
                    background: `linear-gradient(90deg, ${t.accent} 0%, ${t.accentDark} 100%)`,
                    transition: 'width 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>

            <div className="px-3 py-2">
              <LivingRoom state={state} />
            </div>

            <div className="px-5 mt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold">오늘의 할 일</h2>
                <button
                  onClick={() => setView('tasks')}
                  className="text-[11px] opacity-70 flex items-center gap-0.5 px-2 py-1 rounded-md"
                  style={{ background: `${t.accent}15` }}
                >
                  관리 <ChevronRight size={11} />
                </button>
              </div>

              {data.tasks.length === 0 && (
                <div className="text-center py-8 rounded-2xl" style={{ background: cardBg }}>
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-sm font-bold mb-1">청소 항목이 없어요</div>
                  <div className="text-xs opacity-60 mb-3">첫 항목을 추가해보세요</div>
                  <button
                    onClick={openAddTask}
                    className="px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: t.accent, color: '#FFFBF5' }}
                  >
                    + 청소 항목 추가
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {data.tasks.map((task, idx) => {
                  const daysSince = getDaysSince(task.last_done_at);
                  const isDone = task.last_done_at && Date.now() - new Date(task.last_done_at).getTime() < 24 * 3600 * 1000;
                  const isPending = [...sentByMe, ...pendingForMe].some((v) => v.task_id === task.id);
                  const isOverdue = daysSince > task.cycle;
                  const isAssigned = !task.assigned_to || task.assigned_to === data.userId;

                  return (
                    <button
                      key={task.id}
                      onClick={() => !isDone && !isPending && isAssigned && handleCompleteTask(task)}
                      disabled={Boolean(isDone) || isPending || !isAssigned}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-[0.98] text-left animate-slide-up"
                      style={{
                        background: isDone ? `${t.accent}20` : cardBg,
                        border: `1.5px solid ${isOverdue ? t.accent : 'transparent'}`,
                        opacity: isDone ? 0.5 : !isAssigned ? 0.6 : 1,
                        animationDelay: `${idx * 60}ms`,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: isDone ? t.accent : `${t.accent}15` }}
                      >
                        {isDone ? <Check size={20} color="#FFFBF5" /> : task.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[15px] truncate">{task.name}</span>
                          {isOverdue && !isDone && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{ background: t.accent, color: '#FFFBF5' }}
                            >
                              밀림
                            </span>
                          )}
                          {isPending && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                              style={{ background: `${t.accent}30`, color: t.accent }}
                            >
                              <Clock size={8} /> 확인대기
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] opacity-60 mt-0.5 flex items-center gap-2">
                          <span>
                            {!task.assigned_to
                              ? '👥 공동'
                              : task.assigned_to === data.userId
                              ? '⭐ 내 담당'
                              : `🤝 ${data.members.find((m) => m.id === task.assigned_to)?.name ?? '파트너'}`}
                          </span>
                          <span>·</span>
                          <span>{task.cycle}일 주기</span>
                          {daysSince > 0 && (
                            <>
                              <span>·</span>
                              <span>{daysSince}일 경과</span>
                            </>
                          )}
                        </div>
                      </div>
                      {!isDone && !isPending && isAssigned && (
                        <ChevronRight size={18} style={{ color: t.accent }} className="flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 mt-5">
              <button
                onClick={() => setView('stats')}
                className="w-full rounded-2xl p-4 active:scale-[0.98] transition-transform"
                style={{ background: cardBg }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} style={{ color: t.accent }} />
                    <span className="font-bold text-sm">우리 파티</span>
                  </div>
                  <ChevronRight size={16} style={{ color: t.accent }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {data.members.slice(0, 2).map((m) => {
                    const s = data.scores.find((x) => x.user_id === m.id)?.score ?? 0;
                    const maxScore = Math.max(...data.scores.map((x) => x.score), 1);
                    return (
                      <div key={m.id} className="text-left">
                        <div className="text-[11px] opacity-60 mb-1">
                          {m.emoji} {m.name}
                        </div>
                        <div className="text-xl font-black font-display" style={{ color: t.accent }}>
                          {s}
                        </div>
                        <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: `${t.accent}20` }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(s / maxScore) * 100}%`, background: t.accent, transition: 'width 600ms' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ===== CAMERA ===== */}
        {view === 'camera' && currentTask && (
          <div className="animate-fade-in min-h-screen flex flex-col" style={{ background: '#1A1A1A', color: '#FFFBF5' }}>
            <div className="flex items-center justify-between p-5">
              <button onClick={() => { setCurrentTask(null); setView('home'); }} className="p-2 rounded-xl bg-white/10">
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
                onClick={handleSubmitVerification}
                disabled={saving}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}60` }}
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                인증 사진 보내기
              </button>
            </div>
          </div>
        )}

        {/* ===== WAITING ===== */}
        {view === 'waiting' && (
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
              onClick={() => setView('home')}
              className="px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: t.accent, color: '#FFFBF5' }}
            >
              홈으로
            </button>
          </div>
        )}

        {/* ===== INBOX ===== */}
        {view === 'inbox' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('home')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
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
                const requester = data.members.find((m) => m.id === verif.requested_by);
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
          </div>
        )}

        {/* ===== TASKS MANAGE ===== */}
        {view === 'tasks' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setView('home')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <div className="font-bold text-base">청소 항목 관리</div>
                  <div className="text-[11px] opacity-60">{data.tasks.length}개의 항목</div>
                </div>
              </div>
              <button
                onClick={openAddTask}
                className="p-2 rounded-xl"
                style={{ background: t.accent, color: '#FFFBF5' }}
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="px-5 space-y-2">
              {data.tasks.map((task, idx) => (
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
                        : ` ${data.members.find((m) => m.id === task.assigned_to)?.name ?? '담당자'}`}
                    </div>
                  </div>
                  <button onClick={() => openEditTask(task)} className="p-2 rounded-lg" style={{ background: `${t.accent}15` }}>
                    <Edit3 size={14} style={{ color: t.accent }} />
                  </button>
                  <button onClick={() => setDeletingTask(task)} className="p-2 rounded-lg" style={{ background: `${t.accent}15` }}>
                    <Trash2 size={14} style={{ color: t.accent }} />
                  </button>
                </div>
              ))}
              {data.tasks.length === 0 && (
                <div className="text-center py-16 opacity-50">
                  <div className="text-4xl mb-3">📋</div>
                  <div className="text-sm">등록된 청소 항목이 없어요</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ADD / EDIT TASK ===== */}
        {(view === 'add_task' || view === 'edit_task') && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => { setEditingTask(null); setView('tasks'); }} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div className="font-bold text-base">{view === 'add_task' ? '새 청소 항목' : '항목 수정'}</div>
            </div>
            <div className="px-5 space-y-5">
              <div>
                <label className="text-[11px] font-bold opacity-70 mb-2 block">이름</label>
                <input
                  type="text"
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
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
                      onClick={() => setTaskForm({ ...taskForm, emoji: e })}
                      className="aspect-square rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background: taskForm.emoji === e ? t.accent : `${t.accent}15`,
                        border: taskForm.emoji === e ? `2px solid ${t.accentDark}` : 'none',
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
                      onClick={() => setTaskForm({ ...taskForm, cycle: c.value })}
                      className="py-2.5 rounded-xl text-xs font-bold"
                      style={{
                        background: taskForm.cycle === c.value ? t.accent : `${t.accent}15`,
                        color: taskForm.cycle === c.value ? '#FFFBF5' : t.text,
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
                      onClick={() => setTaskForm({ ...taskForm, weight: w.value })}
                      className="py-3 rounded-xl text-sm font-bold"
                      style={{
                        background: taskForm.weight === w.value ? t.accent : `${t.accent}15`,
                        color: taskForm.weight === w.value ? '#FFFBF5' : t.text,
                      }}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={view === 'add_task' ? handleAddTask : handleSaveEdit}
                disabled={saving || !taskForm.name.trim()}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}50` }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {view === 'add_task' ? '추가하기' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        {/* ===== MYPAGE ===== */}
        {view === 'mypage' && me && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setView('home')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                  <ArrowLeft size={18} />
                </button>
                <div className="font-bold text-base">마이페이지</div>
              </div>
              <button
                onClick={openEditProfile}
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ background: `${t.accent}15`, color: t.accent }}
              >
                편집
              </button>
            </div>

            <div
              className="mx-5 rounded-2xl p-5 mb-4"
              style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accentDark})`, color: '#FFFBF5' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  {me.emoji}
                </div>
                <div>
                  <div className="text-xl font-black">{me.name}</div>
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    <Award size={12} /> Lv.{myLevel.level} · {myLevel.title}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1.5 opacity-90">
                  <span>{myLevel.currentXP} XP</span>
                  {myLevel.requiredXP && <span>다음까지 {myLevel.requiredXP - myLevel.currentXP} XP</span>}
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: myLevel.requiredXP ? `${(myLevel.currentXP / myLevel.requiredXP) * 100}%` : '100%',
                      background: '#FFFBF5',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="px-5">
              <h3 className="text-sm font-bold mb-3">내 기록</h3>
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="rounded-2xl p-3 text-center" style={{ background: cardBg }}>
                  <div className="text-xl mb-1">🔥</div>
                  <div className="text-xl font-black font-display" style={{ color: t.accent }}>
                    {data.streak?.current ?? 0}
                  </div>
                  <div className="text-[10px] opacity-60 font-bold">스트릭</div>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ background: cardBg }}>
                  <div className="text-xl mb-1">✅</div>
                  <div className="text-xl font-black font-display" style={{ color: t.accent }}>
                    {data.totals?.approved_count ?? 0}
                  </div>
                  <div className="text-[10px] opacity-60 font-bold">완료</div>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ background: cardBg }}>
                  <div className="text-xl mb-1">🏆</div>
                  <div className="text-xl font-black font-display" style={{ color: t.accent }}>
                    {data.badges.length}
                  </div>
                  <div className="text-[10px] opacity-60 font-bold">배지</div>
                </div>
              </div>
            </div>

            <div className="px-5 space-y-3">
              <button
                onClick={() => setView('achievements')}
                className="w-full rounded-2xl p-4 flex items-center justify-between"
                style={{ background: cardBg }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.accent}15` }}>
                    <Trophy size={16} style={{ color: t.accent }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">업적 & 배지</div>
                    <div className="text-[10px] opacity-50">
                      {data.badges.length}/{BADGES.length} 획득
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: t.accent }} />
              </button>

              <button
                onClick={() => setView('settings')}
                className="w-full rounded-2xl p-4 flex items-center justify-between"
                style={{ background: cardBg }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.accent}15` }}>
                    <Settings size={16} style={{ color: t.accent }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">설정</div>
                    <div className="text-[10px] opacity-50">알림, 파티, 로그아웃</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: t.accent }} />
              </button>
            </div>
          </div>
        )}

        {/* ===== EDIT PROFILE ===== */}
        {view === 'edit_profile' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('mypage')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div className="font-bold text-base">프로필 수정</div>
            </div>
            <div className="px-5 space-y-5">
              <div className="rounded-2xl p-5 text-center" style={{ background: cardBg }}>
                <div className="text-5xl mb-2">{profileForm.emoji}</div>
                <div className="text-lg font-bold">{profileForm.name || '이름 없음'}</div>
              </div>
              <div>
                <label className="text-[11px] font-bold opacity-70 mb-2 block">이름</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value.slice(0, 10) })}
                  placeholder="이름"
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none"
                  style={{ background: inputBg, color: t.text, border: `1.5px solid ${t.accent}30` }}
                  maxLength={10}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold opacity-70 mb-2 block">아바타</label>
                <div className="grid grid-cols-8 gap-2">
                  {AVATAR_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, emoji: e })}
                      className="aspect-square rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background: profileForm.emoji === e ? t.accent : `${t.accent}15`,
                        border: profileForm.emoji === e ? `2px solid ${t.accentDark}` : 'none',
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving || !profileForm.name.trim()}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}50` }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                저장하기
              </button>
            </div>
          </div>
        )}

        {/* ===== ACHIEVEMENTS ===== */}
        {view === 'achievements' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('mypage')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="font-bold text-base">업적 & 배지</div>
                <div className="text-[11px] opacity-60">
                  {data.badges.length}/{BADGES.length} 획득
                </div>
              </div>
            </div>
            <div className="px-5 grid grid-cols-2 gap-2.5">
              {BADGES.map((b, idx) => {
                const unlocked = data.badges.find((ub) => ub.badge_id === b.id);
                return (
                  <div
                    key={b.id}
                    className="rounded-2xl p-4 text-center animate-slide-up"
                    style={{ background: cardBg, opacity: unlocked ? 1 : 0.4, animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="text-4xl mb-2" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {b.icon}
                    </div>
                    <div className="text-sm font-bold mb-1">{b.name}</div>
                    <div className="text-[10px] opacity-70 leading-relaxed">{b.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== STATS ===== */}
        {view === 'stats' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('home')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="font-bold text-base">우리 파티</div>
                <div className="text-[11px] opacity-60">통계 및 기록</div>
              </div>
            </div>

            <div
              className="mx-5 rounded-2xl p-5 mb-4"
              style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accentDark})`, color: '#FFFBF5' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame size={18} />
                <span className="font-bold text-sm opacity-90">파티 스트릭</span>
              </div>
              <div className="text-5xl font-black font-display">{data.streak?.current ?? 0}일 🔥</div>
              <div className="text-xs opacity-80 mt-1">
                최장 {data.streak?.longest ?? 0}일 · 프리즈 {data.streak?.freezes ?? 0}개 남음
              </div>
            </div>

            <div className="px-5">
              <h3 className="text-sm font-bold mb-3">기여도 랭킹</h3>
              <div className="space-y-3">
                {[...data.members]
                  .map((m) => ({
                    ...m,
                    score: data.scores.find((s) => s.user_id === m.id)?.score ?? 0,
                  }))
                  .sort((a, b) => b.score - a.score)
                  .map((m, idx) => (
                    <div
                      key={m.id}
                      className="rounded-2xl p-4 flex items-center gap-3"
                      style={{ background: cardBg, border: idx === 0 ? `2px solid ${t.accent}` : 'none' }}
                    >
                      <div className="text-xs font-black opacity-40 w-4">{idx === 0 ? '🥇' : '🥈'}</div>
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                        style={{ background: `${t.accent}20` }}
                      >
                        {m.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{m.name}</div>
                      </div>
                      <div className="text-2xl font-black font-display" style={{ color: t.accent }}>
                        {m.score}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="px-5 mt-6">
              <button
                onClick={() => setView('activity')}
                className="w-full rounded-2xl p-4 flex items-center justify-between"
                style={{ background: cardBg }}
              >
                <div className="flex items-center gap-2">
                  <History size={16} style={{ color: t.accent }} />
                  <span className="font-bold text-sm">전체 활동 기록</span>
                </div>
                <ChevronRight size={16} style={{ color: t.accent }} />
              </button>
            </div>
          </div>
        )}

        {/* ===== ACTIVITY ===== */}
        {view === 'activity' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('stats')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="font-bold text-base">활동 기록</div>
                <div className="text-[11px] opacity-60">최근 {data.activity.length}개</div>
              </div>
            </div>
            <div className="px-5 space-y-1.5">
              {data.activity.map((a, idx) => {
                const actor = data.members.find((m) => m.id === a.actor_id);
                const md = a.metadata as { task_name?: string; emoji?: string };
                return (
                  <div
                    key={a.id}
                    className="rounded-xl p-3 flex items-center gap-3 animate-slide-up"
                    style={{ background: cardBg, animationDelay: `${Math.min(idx, 10) * 30}ms` }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${t.accent}15` }}
                    >
                      {a.type === 'approved' && <CheckCircle2 size={16} style={{ color: t.accent }} />}
                      {a.type === 'rejected' && <XCircle size={16} style={{ color: t.accent }} />}
                      {a.type === 'request' && <Clock size={16} style={{ color: t.accent }} />}
                      {a.type === 'task_added' && <Plus size={16} style={{ color: t.accent }} />}
                      {a.type === 'task_deleted' && <Trash2 size={16} style={{ color: t.accent }} />}
                      {a.type === 'party_created' && <Users size={16} style={{ color: t.accent }} />}
                      {a.type === 'member_joined' && <User size={16} style={{ color: t.accent }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">
                        {a.type === 'approved' && <>{actor?.name}님의 {md.emoji} {md.task_name} 인증 완료</>}
                        {a.type === 'rejected' && <>{md.emoji} {md.task_name} 재요청</>}
                        {a.type === 'request' && <>{actor?.name}님이 {md.emoji} {md.task_name} 요청</>}
                        {a.type === 'task_added' && <>{md.emoji} {md.task_name} 항목 추가</>}
                        {a.type === 'task_deleted' && <>{md.emoji} {md.task_name} 항목 삭제</>}
                        {a.type === 'party_created' && '우리 파티가 시작됐어요'}
                        {a.type === 'member_joined' && <>{actor?.name}님이 참여했어요</>}
                      </div>
                      <div className="text-[10px] opacity-50">{formatShortDateTime(a.created_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {view === 'settings' && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('mypage')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="font-bold text-base">설정</div>
                <div className="text-[11px] opacity-60">{data.party.name}</div>
              </div>
            </div>

            <div className="px-5 space-y-3">
              <button
                onClick={() => setView('notifications')}
                className="w-full rounded-2xl p-4 flex items-center justify-between"
                style={{ background: cardBg }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.accent}15` }}>
                    <Bell size={16} style={{ color: t.accent }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">알림 설정</div>
                    <div className="text-[10px] opacity-50">{data.notifications?.enabled ? '켜짐' : '꺼짐'}</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: t.accent }} />
              </button>

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
                      초대 코드: <span className="font-mono">{data.party.invite_code}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: t.accent }} />
              </button>

              <div className="rounded-2xl p-4" style={{ background: cardBg }}>
                <div className="text-xs font-bold opacity-70 mb-3">파티 멤버</div>
                {data.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `${t.accent}20` }}>
                      {m.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">
                        {m.name} {m.id === data.userId && <span className="text-[10px] opacity-60">(나)</span>}
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
          </div>
        )}

        {/* ===== NOTIFICATIONS ===== */}
        {view === 'notifications' && data.notifications && (
          <div className="animate-fade-in pb-24">
            <div className="flex items-center gap-3 p-5">
              <button onClick={() => setView('settings')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="font-bold text-base">알림 설정</div>
                <div className="text-[11px] opacity-60">브라우저 알림 기반</div>
              </div>
            </div>
            <div className="px-5 space-y-3">
              <div className="rounded-2xl p-4" style={{ background: cardBg }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: data.notifications.enabled ? t.accent : `${t.accent}15` }}
                    >
                      <Bell size={18} style={{ color: data.notifications.enabled ? '#FFFBF5' : t.accent }} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">알림 받기</div>
                      <div className="text-[10px] opacity-60">{data.notifications.enabled ? '활성화됨' : '비활성화됨'}</div>
                    </div>
                  </div>
                  <Toggle
                    checked={data.notifications.enabled}
                    onChange={() => handleToggleNotifications(!data.notifications!.enabled)}
                    color={t.accent}
                  />
                </div>
              </div>

              {data.notifications.enabled && (
                <>
                  {[
                    { k: 'verification_requests' as const, label: '인증 요청', desc: '파트너가 인증을 요청하면' },
                    { k: 'task_reminders' as const, label: '청소 리마인더', desc: '밀린 청소가 있을 때' },
                    { k: 'streak_reminders' as const, label: '스트릭 유지', desc: '오늘 인증이 없을 때' },
                    { k: 'party_updates' as const, label: '파티 소식', desc: '새 업적, 파트너 완료' },
                  ].map((item) => (
                    <div key={item.k} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: cardBg }}>
                      <div>
                        <div className="font-bold text-sm">{item.label}</div>
                        <div className="text-[10px] opacity-60">{item.desc}</div>
                      </div>
                      <Toggle
                        checked={data.notifications![item.k]}
                        onChange={() => handleToggleNotifSetting(item.k)}
                        color={t.accent}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* ===== REJECT DIALOG ===== */}
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

        {/* ===== DELETE CONFIRM ===== */}
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

        {/* ===== SHARE MODAL ===== */}
        {showShareModal && (
          <div
            className="fixed inset-0 z-40 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowShareModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-3xl p-6 animate-slide-up"
              style={{ background: bgInner }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: `${t.accent}30` }} />
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">💌</div>
                <div className="text-lg font-bold mb-1">파트너 초대</div>
                <div className="text-xs opacity-60">초대 코드를 공유해서 같은 파티에 들어오게 해요</div>
              </div>
              <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: `${t.accent}15` }}>
                <div className="text-[10px] opacity-70 mb-1">초대 코드</div>
                <div className="text-3xl font-black font-mono tracking-widest" style={{ color: t.accent }}>
                  {data.party.invite_code}
                </div>
              </div>
              <button
                onClick={handleShare}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mb-2"
                style={{ background: t.accent, color: '#FFFBF5', boxShadow: `0 8px 24px ${t.accent}50` }}
              >
                {typeof navigator !== 'undefined' && 'share' in navigator ? (
                  <><Share2 size={18} /> 공유하기</>
                ) : (
                  <><Copy size={18} /> 링크 복사</>
                )}
              </button>
              <button onClick={() => setShowShareModal(false)} className="w-full p-3 rounded-xl text-xs opacity-60">
                닫기
              </button>
            </div>
          </div>
        )}

        {/* ===== BOTTOM NAV (hidden on camera/waiting) ===== */}
        {!['camera', 'waiting', 'add_task', 'edit_task', 'edit_profile'].includes(view) && (
          <BottomNav
            state={state}
            inboxBadge={pendingForMe.length}
            activeKey={
              view === 'home' ? 'home' :
              view === 'inbox' ? 'inbox' :
              view === 'tasks' ? 'tasks' :
              (view === 'stats' || view === 'activity') ? 'stats' :
              'mypage'
            }
            onNavigate={(key) => {
              if (key === 'home') setView('home');
              else if (key === 'inbox') setView('inbox');
              else if (key === 'tasks') setView('tasks');
              else if (key === 'stats') setView('stats');
              else if (key === 'mypage') setView('mypage');
            }}
          />
        )}
      </div>
    </div>
  );
}
