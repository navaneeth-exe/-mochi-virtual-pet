import React from 'react';
import { Utensils, Play, Sparkles, Moon, Sun } from 'lucide-react';
import { Button } from '../common/Button';

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
    <div className="flex items-center justify-center gap-2.5 p-2 bg-[#FFFFFF] border-2 border-[#111111] rounded-xl shadow-[3px_3px_0px_#111111] w-full">
      {/* Feed Button */}
      <Button
        variant="light"
        size="md"
        onClick={onFeed}
        disabled={isSleeping || berriesCount <= 0}
        icon={<Utensils size={14} />}
        className="flex-1"
        title="Feed Mochi"
      >
        <span>Feed</span>
        <span className="ml-1 px-1.5 py-0.2 bg-[#EDECE6] border border-[#111111] rounded-full text-[9px] font-mono">
          {berriesCount}
        </span>
      </Button>

      {/* Play Button */}
      <Button
        variant="light"
        size="md"
        onClick={onPlay}
        disabled={isSleeping}
        icon={<Play size={14} />}
        className="flex-1"
        title="Play with Mochi"
      >
        Play
      </Button>

      {/* Pet Button */}
      <Button
        variant="light"
        size="md"
        onClick={onPet}
        disabled={isSleeping}
        icon={<Sparkles size={14} />}
        className="flex-1"
        title="Pet Mochi"
      >
        Pet
      </Button>

      {/* Sleep / Wake Button */}
      <Button
        variant={isSleeping ? 'dark' : 'light'}
        size="md"
        onClick={onToggleSleep}
        icon={isSleeping ? <Sun size={14} /> : <Moon size={14} />}
        className="flex-1"
        title={isSleeping ? 'Wake up Mochi' : 'Put Mochi to sleep'}
      >
        {isSleeping ? 'Wake' : 'Sleep'}
      </Button>
    </div>
  );
};

