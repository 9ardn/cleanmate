'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell } from 'lucide-react';
import { useAppData } from '../../_components/AppDataProvider';
import { useAppTheme } from '../../_components/useAppTheme';
import { Toggle } from '@/components/Toggle';
import { createClient } from '@/lib/supabase/client';
import { updateMyNotificationSettings } from '@/lib/db/notifications';
import {
  requestNotificationPermission, sendBrowserNotification,
} from '@/lib/utils/notification';
import type { NotificationSettings } from '@/types/app';

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const { data, reload, withSaving, showToast } = useAppData();
  const { t, cardBg } = useAppTheme();

  const settings = data!.notifications;

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
        [key]: !(settings as any)[key as string],
      });
      await reload();
    });
  }

  if (!settings) {
    return (
      <div className="animate-fade-in pb-24">
        <div className="flex items-center gap-3 p-5">
          <button onClick={() => router.push('/settings')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
            <ArrowLeft size={18} />
          </button>
          <div className="font-bold text-base">알림 설정</div>
        </div>
        <div className="px-5 text-center py-16 opacity-50 text-sm">알림 설정을 불러올 수 없어요</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center gap-3 p-5">
        <button onClick={() => router.push('/settings')} className="p-2 rounded-xl" style={{ background: `${t.accent}15` }}>
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
                style={{ background: settings.enabled ? t.accent : `${t.accent}15` }}
              >
                <Bell size={18} style={{ color: settings.enabled ? '#FFFBF5' : t.accent }} />
              </div>
              <div>
                <div className="font-bold text-sm">알림 받기</div>
                <div className="text-[10px] opacity-60">{settings.enabled ? '활성화됨' : '비활성화됨'}</div>
              </div>
            </div>
            <Toggle
              checked={settings.enabled}
              onChange={() => handleToggleNotifications(!settings.enabled)}
              color={t.accent}
            />
          </div>
        </div>

        {settings.enabled && (
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
                  checked={settings[item.k]}
                  onChange={() => handleToggleNotifSetting(item.k)}
                  color={t.accent}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
