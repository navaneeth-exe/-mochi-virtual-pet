import React from 'react';
import { Utensils, Play, Sparkles, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

interface ActionDockProps {
  onFeed: () => void;
  onPlay: () => void;
  onPet: () => void;
  onToggleSleep: () => void;
  isSleeping: boolean;
  berriesCount: number;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  onFeed,
  onPlay,
  onPet,
  onToggleSleep,
  isSleeping,
  berriesCount,
}) => {
  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl p-1.5 sm:p-2 shadow-xs grid grid-cols-4 gap-1.5 sm:gap-2 select-none">
      {/* Feed Button */}
      <motion.button
        whileHover={!isSleeping && berriesCount > 0 ? { scale: 1.02 } : {}}
        whileTap={!isSleeping && berriesCount > 0 ? { scale: 0.96 } : {}}
        onClick={onFeed}
        disabled={isSleeping || berriesCount <= 0}
        title="Feed Mochi a delicious snack"
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] min-w-0 ${
          isSleeping || berriesCount <= 0
            ? 'opacity-40 cursor-not-allowed bg-[#F3EFE6] text-[#A1A1AA]'
            : 'bg-[#FDF0EB] text-[#C65A34] hover:bg-[#FBE5DC] border border-[#F6DACF]'
        }`}
      >
        <Utensils size={14} className="shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold truncate">Feed</span>
        <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1 sm:px-1.5 py-0.2 bg-[#FFFFFF] rounded-full border border-[#F6DACF] shrink-0">
          {berriesCount}
        </span>
      </motion.button>

      {/* Play Button */}
      <motion.button
        whileHover={!isSleeping ? { scale: 1.02 } : {}}
        whileTap={!isSleeping ? { scale: 0.96 } : {}}
        onClick={onPlay}
        disabled={isSleeping}
        title="Play a quick game with Mochi"
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] min-w-0 ${
          isSleeping
            ? 'opacity-40 cursor-not-allowed bg-[#F3EFE6] text-[#A1A1AA]'
            : 'bg-[#EBF4FC] text-[#2C6496] hover:bg-[#DEEEFB] border border-[#D0E4F5]'
        }`}
      >
        <Play size={14} className="shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold truncate">Play</span>
      </motion.button>

      {/* Pet Button */}
      <motion.button
        whileHover={!isSleeping ? { scale: 1.02 } : {}}
        whileTap={!isSleeping ? { scale: 0.96 } : {}}
        onClick={onPet}
        disabled={isSleeping}
        title="Gently pet Mochi"
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] min-w-0 ${
          isSleeping
            ? 'opacity-40 cursor-not-allowed bg-[#F3EFE6] text-[#A1A1AA]'
            : 'bg-[#EFEAF8] text-[#5B488C] hover:bg-[#E4DAF3] border border-[#DED4EE]'
        }`}
      >
        <Sparkles size={14} className="shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold truncate">Pet</span>
      </motion.button>

      {/* Sleep / Wake Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onToggleSleep}
        title={isSleeping ? 'Wake up Mochi' : 'Tuck Mochi into bed'}
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] min-w-0 ${
          isSleeping
            ? 'bg-[#18181B] text-[#FFFFFF] hover:bg-[#27272A]'
            : 'bg-[#F3EFE6] text-[#52525B] hover:bg-[#EAE4D5] border border-[#E8E3D8]'
        }`}
      >
        {isSleeping ? <Sun size={14} className="shrink-0 text-[#F59E0B]" /> : <Moon size={14} className="shrink-0" />}
        <span className="text-[10px] sm:text-xs font-bold truncate">{isSleeping ? 'Wake' : 'Rest'}</span>
      </motion.button>
    </div>
  );
};
