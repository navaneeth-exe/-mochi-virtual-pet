import React from 'react';
import { Utensils, Heart, Zap } from 'lucide-react';
import { SegmentGauge } from '../common/SegmentGauge';

interface PetStatsProps {
  hunger: number;
  happiness: number;
  energy: number;
}

export const PetStats: React.FC<PetStatsProps> = ({ hunger, happiness, energy }) => {
  return (
    <div className="retro-card p-3 w-full bg-[#EDECE6] border-2 border-[#111111] flex items-center justify-around gap-2">
      <SegmentGauge
        label="Hunger"
        value={hunger}
        icon={<Utensils size={12} className="text-[#111111]" />}
      />
      <div className="w-[1px] h-8 bg-[#D4D4CE]" />
      <SegmentGauge
        label="Joy"
        value={happiness}
        icon={<Heart size={12} className="text-[#111111]" />}
      />
      <div className="w-[1px] h-8 bg-[#D4D4CE]" />
      <SegmentGauge
        label="Energy"
        value={energy}
        icon={<Zap size={12} className="text-[#111111]" />}
      />
    </div>
  );
};

