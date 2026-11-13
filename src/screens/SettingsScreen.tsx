import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Monitor, RotateCcw, Info, Sparkles, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendNotification
} from '../core/notifications';
import { sound } from '../core/audio';

interface SettingsScreenProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  chassisMode: boolean;
  onToggleChassis: () => void;
  onResetPet: () => void;
  onViewOnboarding: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  isMuted,
  onToggleMute,
  chassisMode,
  onToggleChassis,
  onResetPet,
  onViewOnboarding
}) => {
  const [perm, setPerm] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPerm(getNotificationPermission());
  }, []);

  const handleEnableNotifications = async () => {
    sound.playChirp();
    const granted = await requestNotificationPermission();
    setPerm(getNotificationPermission());
    if (granted) {
      sendNotification("Mochi Reminders Enabled!", "Mochi will remind you when daily tasks are waiting! 🍃");
    }
  };

  return (
    <div className="flex flex-col p-4 min-h-[520px] bg-[#EDECE6] space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]">
        <Button variant="light" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
          Pet Room
        </Button>
        <h1 className="text-xs font-pixel font-bold uppercase tracking-wider text-[#111111]">
          Settings
        </h1>
        <div className="w-16" />
      </div>

      <div className="space-y-3 flex-1">
        {/* Audio Setting */}
        <div className="flex items-center justify-between p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111]">
          <div className="flex items-center gap-2.5">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <div>
              <div className="font-mono font-bold text-xs">8-Bit Sound Synthesizer</div>
              <div className="text-[10px] text-[#4B5563]">Procedural retro audio chimes</div>
            </div>
          </div>
          <Button variant={isMuted ? 'light' : 'dark'} size="sm" onClick={onToggleMute}>
            {isMuted ? 'Muted' : 'Active'}
          </Button>
        </div>

        {/* Chassis Setting */}
        <div className="flex items-center justify-between p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111]">
          <div className="flex items-center gap-2.5">
            <Monitor size={16} />
            <div>
              <div className="font-mono font-bold text-xs">Console Chassis (Desktop)</div>
              <div className="text-[10px] text-[#4B5563]">Retro handheld physical frame</div>
            </div>
          </div>
          <Button variant={chassisMode ? 'dark' : 'light'} size="sm" onClick={onToggleChassis}>
            {chassisMode ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {/* Reminders / Notifications */}
        <div className="flex items-center justify-between p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111]">
          <div className="flex items-center gap-2.5">
            <Bell size={16} />
            <div>
              <div className="font-mono font-bold text-xs">Daily Habit Reminders</div>
              <div className="text-[10px] text-[#4B5563]">
                {perm === 'granted'
                  ? 'Browser push active'
                  : perm === 'denied'
                  ? 'Blocked in browser permissions'
                  : isNotificationSupported()
                  ? 'Click to enable optional push'
                  : 'In-app toasts active (browser unsupported)'}
              </div>
            </div>
          </div>
          {perm === 'granted' ? (
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-[#DCFCE7] text-[#166534] border border-[#166534] rounded">
              <CheckCircle2 size={11} />
              Active
            </span>
          ) : perm === 'denied' ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] border border-[#991B1B] rounded">
              Blocked
            </span>
          ) : (
            <Button variant="dark" size="sm" onClick={handleEnableNotifications}>
              Enable
            </Button>
          )}
        </div>

        {/* About Mochi Narrative */}
        <div className="p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase tracking-wider text-[#111111]">
            <Info size={14} />
            Task 1 Companion Story
          </div>
          <p className="text-[11px] font-mono text-[#4B5563] leading-relaxed italic">
            "My companion's name is Mochi. He came to me from inside a chip. I make him run, jump,
            feed him, sing songs, and do all sorts of things with him."
          </p>
        </div>

        {/* Reset Actions */}
        <div className="pt-1 space-y-2">
          <Button
            variant="light"
            size="md"
            onClick={onViewOnboarding}
            icon={<Sparkles size={14} />}
            className="w-full"
          >
            Review Welcome Onboarding
          </Button>

          <Button
            variant="light"
            size="md"
            onClick={() => {
              if (window.confirm('Reset Mochi stats to default?')) {
                onResetPet();
              }
            }}
            icon={<RotateCcw size={14} />}
            className="w-full text-red-600"
          >
            Reset Companion Vitals
          </Button>
        </div>
      </div>
    </div>
  );
};
