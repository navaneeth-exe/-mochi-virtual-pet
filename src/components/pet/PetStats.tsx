import React from 'react';
import { Utensils, Heart, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface PetStatsProps {
  hunger: number;
  happiness: number;
  energy: number;
}

export const PetStats: React.FC<PetStatsProps> = ({ hunger, happiness, energy }) => {
  // Interpretation:
  // Fullness = 100 - hunger (Higher Fullness is better)
  const fullness = Math.max(0, Math.min(100, 100 - hunger));

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl p-2.5 sm:p-3 shadow-xs select-none">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {/* Fullness Stat */}
        <div className="flex flex-col justify-between gap-1 p-2 sm:p-2.5 rounded-xl bg-[#FDF0EB] border border-[#F6DACF] min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#C65A34] truncate">
              <Utensils size={11} className="shrink-0" />
              <span className="truncate">Fullness</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-bold text-[#C65A34]">
              {fullness}%
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-[#FFFFFF] rounded-full overflow-hidden p-0.5 border border-[#F6DACF]">
            <motion.div
              initial={false}
              animate={{ width: `${fullness}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="h-full bg-[#D46E4A] rounded-full"
            />
          </div>
          <span className="text-[9px] text-[#8C3D21] font-semibold truncate">
            {fullness > 70 ? 'Satisfied 🍙' : fullness > 35 ? 'Peckish 🥢' : 'Hungry! ⚠️'}
          </span>
        </div>

        {/* Happiness / Joy Stat */}
        <div className="flex flex-col justify-between gap-1 p-2 sm:p-2.5 rounded-xl bg-[#EFEAF8] border border-[#DED4EE] min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#5B488C] truncate">
              <Heart size={11} className="shrink-0" />
              <span className="truncate">Joy</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-bold text-[#5B488C]">
              {happiness}%
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-[#FFFFFF] rounded-full overflow-hidden p-0.5 border border-[#DED4EE]">
            <motion.div
              initial={false}
              animate={{ width: `${happiness}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="h-full bg-[#6B5696] rounded-full"
            />
          </div>
          <span className="text-[9px] text-[#483772] font-semibold truncate">
            {happiness > 70 ? 'Ecstatic ✨' : happiness > 35 ? 'Content 😊' : 'Needs Love 🥺'}
          </span>
        </div>

        {/* Energy Stat */}
        <div className="flex flex-col justify-between gap-1 p-2 sm:p-2.5 rounded-xl bg-[#E8F2EA] border border-[#D0E4D4] min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#2D6343] truncate">
              <Zap size={11} className="shrink-0" />
              <span className="truncate">Energy</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-bold text-[#2D6343]">
              {energy}%
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-[#FFFFFF] rounded-full overflow-hidden p-0.5 border border-[#D0E4D4]">
            <motion.div
              initial={false}
              animate={{ width: `${energy}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="h-full bg-[#407655] rounded-full"
            />
          </div>
          <span className="text-[9px] text-[#1E452E] font-semibold truncate">
            {energy > 60 ? 'Energetic ⚡' : energy > 25 ? 'Drowsy 🥱' : 'Sleepy! 💤'}
          </span>
        </div>
      </div>
    </div>
  );
};
