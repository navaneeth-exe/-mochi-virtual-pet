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
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl p-2 shadow-sm flex items-center justify-between gap-2">
      {/* Feed Button */}
      <motion.button
        whileHover={!isSleeping && berriesCount > 0 ? { scale: 1.03 } : {}}
        whileTap={!isSleeping && berriesCount > 0 ? { scale: 0.95 } : {}}
        onClick={onFeed}
        disabled={isSleeping || berriesCount <= 0}
        title="Feed Mochi a delicious snack"
        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
          isSleeping || berriesCount <= 0
            ? 'opacity-40 cursor-not-allowed bg-[#F3EFE6] text-[#A1A1AA]'
            : 'bg-[#FDF0EB] text-[#C65A34] hover:bg-[#FBE5DC] border border-[#F6DACF]'
        }`}
      >
        <Utensils size={15} />
        <span className="text-[11px] sm:text-xs">Feed</span>
        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#FFFFFF] rounded-full border border-[#F6DACF]">
          {berriesCount}
        </span>
      </motion.button>

      {/* Play Button */}
      <motion.button
        whileHover={!isSleeping ? { scale: 1.03 } : {}}
        whileTap={!isSleeping ? { scale: 0.95 } : {}}
        onClick={onPlay}
        disabled={isSleeping}
        title="Play a quick game with Mochi"
        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
          isSleeping
            ? 'opacity-40 cursor-not-allowed bg-[#F3EFE6] text-[#A1A1AA]'
            : 'bg-[#EBF4FC] text-[#2C6496] hover:bg-[#DEEEFB] border border-[#D0E4F5]'
        }`}
      >
        <Play size={15} />
        <span className="text-[11px] sm:text-xs">Play</span>
      </motion.button>

      {/* Pet Button */}
      <motion.button
        whileHover={!isSleeping ? { scale: 1.03 } : {}}
        whileTap={!isSleeping ? { scale: 0.95 } : {}}
        onClick={onPet}
        disabled={isSleeping}
        title="Gently pet Mochi"
        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
          isSleeping
            ? 'opacity-40 cursor-not-allowed bg-[#F3EFE6] text-[#A1A1AA]'
            : 'bg-[#EFEAF8] text-[#5B488C] hover:bg-[#E4DAF3] border border-[#DED4EE]'
        }`}
      >
        <Sparkles size={15} />
        <span className="text-[11px] sm:text-xs">Pet</span>
      </motion.button>

      {/* Sleep / Wake Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleSleep}
        title={isSleeping ? 'Wake up Mochi' : 'Tuck Mochi into bed'}
        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
          isSleeping
            ? 'bg-[#18181B] text-[#FFFFFF] hover:bg-[#27272A]'
            : 'bg-[#F3EFE6] text-[#52525B] hover:bg-[#EAE4D5] border border-[#E8E3D8]'
        }`}
      >
        {isSleeping ? <Sun size={15} /> : <Moon size={15} />}
        <span className="text-[11px] sm:text-xs">{isSleeping ? 'Wake' : 'Rest'}</span>
      </motion.button>
    </div>
  );
};
