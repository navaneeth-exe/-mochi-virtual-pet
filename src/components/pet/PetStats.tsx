import React from 'react';
import { Utensils, Heart, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface PetStatsProps {
  hunger: number;
  happiness: number;
  energy: number;
}

export const PetStats: React.FC<PetStatsProps> = ({ hunger, happiness, energy }) => {
  // Interpretations:
  // Hunger: higher means more hungry. We show "Fullness" or Hunger clearly.
  // Fullness = 100 - hunger
  const fullness = Math.max(0, Math.min(100, 100 - hunger));

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl p-3 shadow-sm flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2">
        {/* Fullness / Hunger Stat */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#FDF0EB] border border-[#F6DACF]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#C65A34]">
              <Utensils size={12} />
              <span>Fullness</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#C65A34]">
              {fullness}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden p-0.5 border border-[#F6DACF]">
            <motion.div
              initial={false}
              animate={{ width: `${fullness}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="h-full bg-[#D46E4A] rounded-full"
            />
          </div>
          <span className="text-[9px] text-[#8C3D21] font-medium">
            {fullness > 70 ? 'Satisfied 🍙' : fullness > 35 ? 'Peckish 🥢' : 'Hungry! ⚠️'}
          </span>
        </div>

        {/* Happiness / Joy Stat */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#EFEAF8] border border-[#DED4EE]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#5B488C]">
              <Heart size={12} />
              <span>Joy</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#5B488C]">
              {happiness}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden p-0.5 border border-[#DED4EE]">
            <motion.div
              initial={false}
              animate={{ width: `${happiness}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="h-full bg-[#6B5696] rounded-full"
            />
          </div>
          <span className="text-[9px] text-[#483772] font-medium">
            {happiness > 70 ? 'Ecstatic ✨' : happiness > 35 ? 'Content 😊' : 'Needs Love 🥺'}
          </span>
        </div>

        {/* Energy Stat */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#E8F2EA] border border-[#D0E4D4]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2D6343]">
              <Zap size={12} />
              <span>Energy</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#2D6343]">
              {energy}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden p-0.5 border border-[#D0E4D4]">
            <motion.div
              initial={false}
              animate={{ width: `${energy}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="h-full bg-[#407655] rounded-full"
            />
          </div>
          <span className="text-[9px] text-[#1E452E] font-medium">
            {energy > 60 ? 'Energetic ⚡' : energy > 25 ? 'Drowsy 🥱' : 'Sleepy! 💤'}
          </span>
        </div>
      </div>
    </div>
  );
};
