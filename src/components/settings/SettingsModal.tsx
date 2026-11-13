import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Info, Bell, Monitor, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { sound } from '../../core/audio';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendNotification,
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
  onBackToWelcome,
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
      sendNotification('Mochi Reminders Enabled!', 'Mochi will remind you when daily tasks are waiting! 🍃');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Companion Settings">
      <div className="space-y-3.5">
        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E8E3D8] text-[#18181B]">
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </div>
            <div>
              <div className="font-semibold text-xs text-[#18181B]">8-Bit Audio Synth</div>
              <div className="text-[10px] text-[#71717A]">Procedural audio chimes</div>
            </div>
          </div>
          <button
            onClick={onToggleMute}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
              isMuted
                ? 'bg-[#F3EFE6] text-[#71717A]'
                : 'bg-[#18181B] text-[#FFFFFF]'
            }`}
          >
            {isMuted ? 'Muted' : 'Active'}
          </button>
        </div>

        {/* Console Chassis Toggle (Desktop) */}
        <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E8E3D8] text-[#18181B]">
              <Monitor size={15} />
            </div>
            <div>
              <div className="font-semibold text-xs text-[#18181B]">Handheld Console Bezel</div>
              <div className="text-[10px] text-[#71717A]">Physical retro chassis</div>
            </div>
          </div>
          <button
            onClick={onToggleChassis}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
              chassisMode
                ? 'bg-[#18181B] text-[#FFFFFF]'
                : 'bg-[#F3EFE6] text-[#71717A]'
            }`}
          >
            {chassisMode ? 'Active' : 'Off'}
          </button>
        </div>

        {/* Notifications & Reminders */}
        <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E8E3D8] text-[#18181B]">
              <Bell size={15} />
            </div>
            <div>
              <div className="font-semibold text-xs text-[#18181B]">Daily Habit Reminders</div>
              <div className="text-[10px] text-[#71717A]">
                {perm === 'granted'
                  ? 'Browser push active'
                  : perm === 'denied'
                  ? 'Blocked in browser permissions'
                  : isNotificationSupported()
                  ? 'Click to enable optional push'
                  : 'In-app toasts active'}
              </div>
            </div>
          </div>
          {perm === 'granted' ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2D6343]">
              <CheckCircle2 size={13} />
              <span>Active</span>
            </span>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="px-3 py-1 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] rounded-full text-xs font-bold shadow-xs transition-all"
            >
              Enable
            </button>
          )}
        </div>

        {/* Pet Origin Narrative */}
        <div className="p-3.5 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B]">
            <Info size={14} className="text-[#C65A34]" />
            <span>About Mochi</span>
          </div>
          <p className="text-[11px] text-[#71717A] leading-relaxed italic">
            "My companion's name is Mochi. He came to me from inside a chip. I make him run, jump,
            feed him, sing songs, and do all sorts of things with him."
          </p>
        </div>

        {/* Onboarding Restart & Reset Actions */}
        <div className="pt-2 border-t border-[#E8E3D8] flex items-center justify-between gap-2">
          <button
            onClick={onBackToWelcome}
            className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-xl text-xs font-semibold text-[#18181B] transition-all"
          >
            View Onboarding
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset Mochi vitals to healthy defaults?')) {
                sound.playChirp();
                onResetPet();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FEE2E2] hover:bg-[#FCD34D] text-[#DC2626] rounded-xl text-xs font-semibold transition-all"
          >
            <RotateCcw size={12} />
            <span>Reset Vitals</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
