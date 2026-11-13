import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Monitor, RotateCcw, Info, Bell, CheckCircle2, Play } from 'lucide-react';
import { motion } from 'motion/react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendNotification,
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
  onViewOnboarding,
}) => {
  const [perm, setPerm] = useState<NotificationPermission>('default');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setPerm(getNotificationPermission());
  }, []);

  const handleEnableNotifications = async () => {
    sound.playChirp();
    const granted = await requestNotificationPermission();
    setPerm(getNotificationPermission());
    if (granted) {
      sendNotification('Mochi Reminders Enabled!', 'Mochi will remind you when daily tasks are waiting! 🍃');
    }
  };

  const handleTestChime = () => {
    sound.playVictory();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col p-4 sm:p-5 min-h-[560px] bg-[#FAF8F5] space-y-4"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D8]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-xl text-xs font-semibold text-[#18181B] transition-all shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Pet Room</span>
        </button>

        <h1 className="text-sm font-bold text-[#18181B]">Companion Settings</h1>

        <div className="w-16" />
      </div>

      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
        {/* Section 1: Audio & Sound Effects */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B]">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#18181B]">8-Bit Audio Synth</h3>
                <p className="text-[10px] text-[#71717A]">Procedural Web Audio chimes</p>
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

          {!isMuted && (
            <div className="pt-2 border-t border-[#F3EFE6] flex items-center justify-between">
              <span className="text-[11px] text-[#71717A]">Test Audio Synthesizer</span>
              <button
                onClick={handleTestChime}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#C65A34] hover:underline"
              >
                <Play size={12} />
                <span>Play Chime</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Display & Console Chassis */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B]">
              <Monitor size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#18181B]">Retro Console Mode</h3>
              <p className="text-[10px] text-[#71717A]">Physical Game Boy handheld chassis</p>
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
            {chassisMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Section 3: Daily Reminders */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B]">
              <Bell size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#18181B]">Companion Reminders</h3>
              <p className="text-[10px] text-[#71717A]">
                {perm === 'granted'
                  ? 'Browser push enabled'
                  : 'Get notified for daily tasks'}
              </p>
            </div>
          </div>

          {perm === 'granted' ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2D6343]">
              <CheckCircle2 size={13} />
              <span>Enabled</span>
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

        {/* Section 4: Onboarding Story */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B]">
              <Info size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#18181B]">Mochi's Origin Story</h3>
              <p className="text-[10px] text-[#71717A]">Semiconductor chip story & guide</p>
            </div>
          </div>

          <button
            onClick={onViewOnboarding}
            className="px-3 py-1 bg-[#F3EFE6] hover:bg-[#E8E3D8] text-[#18181B] rounded-full text-xs font-bold shadow-xs transition-all"
          >
            View Story
          </button>
        </div>

        {/* Section 5: Danger Zone (Reset Pet) */}
        <div className="p-4 bg-[#FFFFFF] border border-[#FCA5A5] rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626]">
                <RotateCcw size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#DC2626]">Reset Companion</h3>
                <p className="text-[10px] text-[#71717A]">Restore default stats & vitals</p>
              </div>
            </div>

            <button
              onClick={() => setShowResetConfirm((p) => !p)}
              className="px-3 py-1 bg-[#FEE2E2] hover:bg-[#FCD34D] text-[#DC2626] rounded-full text-xs font-bold transition-all"
            >
              {showResetConfirm ? 'Cancel' : 'Reset'}
            </button>
          </div>

          {showResetConfirm && (
            <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FCA5A5] space-y-2">
              <p className="text-[11px] text-[#991B1B]">
                Are you sure? This will reset Mochi's hunger, joy, and energy back to default 100.
              </p>
              <button
                onClick={() => {
                  onResetPet();
                  setShowResetConfirm(false);
                }}
                className="w-full py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFFFF] rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
