import React from 'react';
import { ArrowRight, ShieldCheck, Users, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../core/audio';

interface WelcomeScreenProps {
  onStart: () => void;
  onJoinShared?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onJoinShared }) => {
  const handleMochiTap = () => {
    sound.playChirp();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center justify-between p-6 min-h-[560px] text-center bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EAE3D2] rounded-3xl"
    >
      {/* Top Header & Chip Origin Badge */}
      <div className="space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E8E3D8] rounded-full text-[11px] font-semibold text-[#18181B] shadow-xs">
          <Cpu size={13} className="text-[#C65A34]" />
          <span>BORN FROM A SEMICONDUCTOR CHIP</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18181B]">
          MOCHI
        </h1>
        <p className="text-xs text-[#71717A] max-w-xs mx-auto">
          Your tactile, living pocket companion. Care for Mochi, track daily goals, and co-parent across multiple phones.
        </p>
      </div>

      {/* Center Character Interactive Hero */}
      <div className="relative my-4 flex flex-col items-center">
        {/* Decorative Ambient Aura */}
        <div className="absolute inset-0 w-48 h-48 bg-[#FDF0EB] rounded-full filter blur-2xl opacity-60 -z-10" />

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleMochiTap}
          className="relative w-40 h-40 sm:w-48 sm:h-48 cursor-pointer select-none"
        >
          <motion.img
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            src="/assets/mochi/mochi-happy.png"
            alt="Mochi Mascot"
            className="w-full h-full object-contain pixelated filter drop-shadow-[0_10px_20px_rgba(24,24,27,0.15)]"
          />
        </motion.div>

        {/* Shadow */}
        <motion.div
          animate={{ scaleX: [1, 1.08, 1], opacity: [0.35, 0.45, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-32 h-2.5 bg-[#18181B] rounded-full mt-1 filter blur-[2px]"
        />

        {/* Narrative Card */}
        <div className="mt-4 p-3.5 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-sm max-w-xs text-left">
          <p className="text-xs text-[#52525B] leading-relaxed italic">
            "He emerged from an experimental semiconductor chip—an electrical spark that sprouted two tiny green leaves of curiosity."
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#A1A1AA] font-medium border-t border-[#F3EFE6] pt-1.5">
            <span>Hover + Space = Sprint</span>
            <span>Double-tap = Joy</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-xs space-y-2.5 pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full py-3.5 px-4 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] text-xs sm:text-sm font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <span>ENTER MOCHI'S ROOM</span>
          <ArrowRight size={16} />
        </motion.button>

        {onJoinShared && (
          <button
            onClick={onJoinShared}
            className="w-full py-2.5 px-4 bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#E8E3D8] text-[#18181B] text-xs font-semibold rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Users size={14} className="text-[#C65A34]" />
            <span>Join Existing Pet Room</span>
          </button>
        )}

        <div className="flex items-center justify-center gap-1 text-[10px] text-[#71717A] pt-1">
          <ShieldCheck size={12} className="text-[#407655]" />
          <span>Real-time Multi-Device Sync • Offline PWA Support</span>
        </div>
      </div>
    </motion.div>
  );
};
