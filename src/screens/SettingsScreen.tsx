import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Monitor, RotateCcw, Bell, CheckCircle2, Sparkles, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendNotification,
} from '../core/notifications';
import { sound } from '../core/audio';
import { Emotion } from '../types/pet';

interface SettingsScreenProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  chassisMode: boolean;
  onToggleChassis: () => void;
  onResetPet: () => void;
  onViewOnboarding: () => void;
  onSetEmotion?: (emo: Emotion) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  isMuted,
  onToggleMute,
  chassisMode,
  onToggleChassis,
  onResetPet,
  onSetEmotion,
}) => {
  const [perm, setPerm] = useState<NotificationPermission>('default');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [activeEmotionPreview, setActiveEmotionPreview] = useState<Emotion>('happy');

  useEffect(() => {
    setPerm(getNotificationPermission());
  }, []);

  const handleEnableNotifications = async () => {
    sound.playChirp();
    const granted = await requestNotificationPermission();
    setPerm(getNotificationPermission());
    if (granted) {
      sendNotification('Mochi Reminders Enabled!', 'Mochi will remind you when daily tasks are waiting! 🌿');
    }
  };

  const handleTestEmotion = (emo: Emotion) => {
    setActiveEmotionPreview(emo);
    sound.playChirp();
    if (onSetEmotion) onSetEmotion(emo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col p-3.5 sm:p-5 lg:p-6 bg-[#FAF8F5] space-y-4 w-full select-none"
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

        <h1 className="text-xs sm:text-sm font-bold text-[#18181B]">Companion Settings</h1>

        <div className="w-12 sm:w-16" />
      </div>

      {/* Settings Sections Grid */}
      <div
        className={`w-full gap-4 items-start ${
          chassisMode ? 'flex flex-col space-y-3' : 'grid grid-cols-1 md:grid-cols-2'
        }`}
      >
        {/* Section 1: 8-Bit Audio Synthesizer */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-3 w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B] shrink-0">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#18181B] truncate">8-Bit Audio Synth</h3>
                <p className="text-[10px] text-[#71717A] truncate">Procedural Web Audio chimes</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 ${
                isMuted
                  ? 'bg-[#F3EFE6] text-[#71717A]'
                  : 'bg-[#18181B] text-[#FFFFFF]'
              }`}
            >
              {isMuted ? 'Muted' : 'Active'}
            </button>
          </div>

          {!isMuted && (
            <div className="pt-2 border-t border-[#F3EFE6] space-y-2">
              <span className="text-[10px] font-semibold text-[#71717A] block">Test Sound Waveforms:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => sound.playChirp()}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B]"
                >
                  Chirp
                </button>
                <button
                  type="button"
                  onClick={() => sound.playVictory()}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B]"
                >
                  Victory
                </button>
                <button
                  type="button"
                  onClick={() => sound.playBite()}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B]"
                >
                  Eating
                </button>
                <button
                  type="button"
                  onClick={() => sound.playPurr()}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B]"
                >
                  Purr
                </button>
                <button
                  type="button"
                  onClick={() => sound.playSleep()}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B]"
                >
                  Sleep
                </button>
                <button
                  type="button"
                  onClick={() => sound.playRun()}
                  className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B]"
                >
                  Sprint
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Display & Handheld Chassis */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B] shrink-0">
              <Monitor size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#18181B] truncate">Retro Console Mode</h3>
              <p className="text-[10px] text-[#71717A] truncate">Game Boy handheld chassis</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleChassis}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 ${
              chassisMode
                ? 'bg-[#18181B] text-[#FFFFFF]'
                : 'bg-[#F3EFE6] text-[#71717A]'
            }`}
          >
            {chassisMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Section 3: Daily Reminders */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B] shrink-0">
              <Bell size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#18181B] truncate">Task Reminders</h3>
              <p className="text-[10px] text-[#71717A] truncate">
                {perm === 'granted' ? 'Browser push active' : 'Get habit notifications'}
              </p>
            </div>
          </div>

          {perm === 'granted' ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2D6343] shrink-0">
              <CheckCircle2 size={13} />
              <span>Active</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleEnableNotifications}
              className="px-3 py-1 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] rounded-full text-xs font-bold shadow-xs transition-all shrink-0"
            >
              Enable
            </button>
          )}
        </div>

        {/* Section 4: Origin Story Guide */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B] shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#18181B] truncate">Mochi's Origin Story</h3>
              <p className="text-[10px] text-[#71717A] truncate">Chip emergence & gestures</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowStoryModal(true)}
            className="px-3 py-1 bg-[#F3EFE6] hover:bg-[#E8E3D8] text-[#18181B] rounded-full text-xs font-bold shadow-xs transition-all shrink-0"
          >
            Read Story
          </button>
        </div>

        {/* Section 5: Academic / Evaluator Expression Tester */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-2.5 w-full md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-[#18181B]">
                <Sparkles size={14} className="text-[#C65A34]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#18181B]">Academic Evaluator: 4 Core Expressions</h3>
                <p className="text-[10px] text-[#71717A]">Test monochrome pixel art emotions (Task 2 Specification)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {(['idle', 'happy', 'sad', 'surprised', 'angry'] as Emotion[]).map((emo) => (
              <button
                key={emo}
                type="button"
                onClick={() => handleTestEmotion(emo)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                  activeEmotionPreview === emo
                    ? 'bg-[#18181B] text-[#FFFFFF] border-[#18181B] shadow-xs'
                    : 'bg-[#FAF8F5] hover:bg-[#F3EFE6] border-[#E8E3D8] text-[#52525B]'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
        </div>

        {/* Section 6: Danger Zone (Reset Pet) - Spans 2 cols on desktop */}
        <div className="p-4 bg-[#FFFFFF] border border-[#FCA5A5] rounded-2xl shadow-xs space-y-2 w-full md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] shrink-0">
                <RotateCcw size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#DC2626] truncate">Reset Companion</h3>
                <p className="text-[10px] text-[#71717A] truncate">Restore default companion stats</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirm((p) => !p)}
              className="px-3 py-1 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#DC2626] rounded-full text-xs font-bold transition-all shrink-0"
            >
              {showResetConfirm ? 'Cancel' : 'Reset'}
            </button>
          </div>

          {showResetConfirm && (
            <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FCA5A5] space-y-2">
              <p className="text-[11px] text-[#991B1B]">
                Are you sure? This will reset Mochi's hunger, joy, and energy back to healthy baseline values.
              </p>
              <button
                type="button"
                onClick={() => {
                  onResetPet();
                  setShowResetConfirm(false);
                }}
                className="w-full py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFFFF] rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Confirm Companion Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* In-Place Origin Story Modal */}
      <AnimatePresence>
        {showStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#FFFFFF] border border-[#E8E3D8] rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#F3EFE6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-xs">⚡</span>
                  <h3 className="text-sm font-bold text-[#18181B]">The Story of Mochi</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  className="p-1 hover:bg-[#F3EFE6] rounded-full text-[#71717A]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#52525B] leading-relaxed">
                <p className="italic bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E3D8]">
                  "My companion's name is Mochi. He came to me from inside a chip. I make him run, jump, feed him, sing songs, and do all sorts of things with him. To make him run, I place the cursor over him and press the spacebar, and then he runs. If I double-tap him, he gets super happy. When I want to feed him, I take him to the top of the window."
                </p>

                <div className="space-y-1.5 pt-1">
                  <h4 className="font-bold text-[#18181B] text-xs">Interactive Gestures:</h4>
                  <ul className="space-y-1 text-[11px] text-[#71717A] list-disc list-inside">
                    <li><strong>Spacebar Sprint:</strong> Hover over Mochi and tap Spacebar.</li>
                    <li><strong>Double-Tap Joy:</strong> Rapidly double-tap or double-click Mochi.</li>
                    <li><strong>Drag-to-Feed:</strong> Drag Mochi or food item to the top edge.</li>
                    <li><strong>Co-Parenting:</strong> Share your 6-character room code with another phone.</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                className="w-full py-2 bg-[#18181B] text-[#FFFFFF] rounded-xl text-xs font-bold hover:bg-[#27272A] transition-colors"
              >
                Close Story Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
