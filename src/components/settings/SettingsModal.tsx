import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Info, Bell, Monitor, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { sound } from '../../core/audio';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendNotification
} from '../../core/notifications';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPet: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  chassisMode: boolean;
  onToggleChassis: () => void;
  onBackToWelcome: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetPet,
  isMuted,
  onToggleMute,
  chassisMode,
  onToggleChassis,
  onBackToWelcome
}) => {
  const [perm, setPerm] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (isOpen) {
      setPerm(getNotificationPermission());
    }
  }, [isOpen]);

  const handleEnableNotifications = async () => {
    sound.playChirp();
    const granted = await requestNotificationPermission();
    setPerm(getNotificationPermission());
    if (granted) {
      sendNotification("Mochi Reminders Enabled!", "Mochi will remind you when daily tasks are waiting! 🍃");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Companion Settings">
      <div className="space-y-3.5">
        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-2.5 bg-[#EDECE6] border border-[#111111] rounded">
          <div className="flex items-center gap-2">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <div>
              <div className="font-bold text-xs">8-Bit Sound Synthesizer</div>
              <div className="text-[10px] text-[#4B5563]">Procedural retro audio chimes</div>
            </div>
          </div>
          <Button
            variant={isMuted ? 'light' : 'dark'}
            size="sm"
            onClick={onToggleMute}
          >
            {isMuted ? 'Muted' : 'Enabled'}
          </Button>
        </div>

        {/* Console Chassis Toggle (Desktop) */}
        <div className="flex items-center justify-between p-2.5 bg-[#EDECE6] border border-[#111111] rounded">
          <div className="flex items-center gap-2">
            <Monitor size={16} />
            <div>
              <div className="font-bold text-xs">Handheld Console Bezel</div>
              <div className="text-[10px] text-[#4B5563]">Retro hardware chassis framing</div>
            </div>
          </div>
          <Button
            variant={chassisMode ? 'dark' : 'light'}
            size="sm"
            onClick={onToggleChassis}
          >
            {chassisMode ? 'Active' : 'Off'}
          </Button>
        </div>

        {/* Notifications & Reminders */}
        <div className="flex items-center justify-between p-2.5 bg-[#EDECE6] border border-[#111111] rounded">
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <div>
              <div className="font-bold text-xs">Daily Habit Reminders</div>
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
            <Button
              variant="dark"
              size="sm"
              onClick={handleEnableNotifications}
            >
              Enable
            </Button>
          )}
        </div>

        {/* Pet Origin Narrative */}
        <div className="p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#111111]">
            <Info size={14} />
            About Mochi (Task 1 Story)
          </div>
          <p className="text-[11px] text-[#4B5563] leading-relaxed italic">
            "My companion's name is Mochi. He came to me from inside a chip. I make him run, jump,
            feed him, sing songs, and do all sorts of things with him."
          </p>
        </div>

        {/* Onboarding Restart & Reset Actions */}
        <div className="pt-2 border-t border-[#D4D4CE] flex items-center justify-between gap-2">
          <Button variant="light" size="sm" onClick={onBackToWelcome}>
            View Onboarding
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset Mochi vitals to healthy defaults?')) {
                sound.playChirp();
                onResetPet();
              }
            }}
            icon={<RotateCcw size={13} />}
          >
            Reset Vitals
          </Button>
        </div>
      </div>
    </Modal>
  );
};
