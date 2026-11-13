import React from 'react';
import { PetState, Emotion } from '../types/pet';
import { MochiCharacter } from '../components/pet/MochiCharacter';
import { PetStats } from '../components/pet/PetStats';
import { ActionDock } from '../components/pet/ActionDock';

interface MainPetScreenProps {
  pet: PetState;
  onFeed: () => void;
  onPlay: () => void;
  onPet: () => void;
  onToggleSleep: () => void;
  onDoubleTap: () => void;
  onSpacebarRun: () => void;
  speechText?: string;
  onSetEmotionDirectly?: (emotion: Emotion) => void;
}

export const MainPetScreen: React.FC<MainPetScreenProps> = ({
  pet,
  onFeed,
  onPlay,
  onPet,
  onToggleSleep,
  onDoubleTap,
  onSpacebarRun,
  speechText,
  onSetEmotionDirectly,
}) => {
  return (
    <div
      className={`flex flex-col justify-between p-4 min-h-[520px] transition-colors duration-500 ${
        pet.isSleeping ? 'bg-[#DCDBCF]' : 'bg-[#EDECE6]'
      }`}
    >
      {/* Top Section: Room Header & Status Message */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#111111]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#111111]">
            {pet.name}'s Room
          </span>
        </div>

        {/* Emotion Indicator Badge */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-[#4B5563]">Mood:</span>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FFFFFF] border border-[#111111] rounded shadow-[1px_1px_0px_#111111]">
            {pet.isSleeping ? 'Asleep' : pet.currentEmotion}
          </span>
        </div>
      </div>

      {/* Center Section: Living Mochi Canvas & Gestures */}
      <div className="my-auto py-2 flex flex-col items-center">
        <MochiCharacter
          emotion={pet.currentEmotion}
          isSleeping={pet.isSleeping}
          onDoubleTap={onDoubleTap}
          onFeedAtTop={onFeed}
          onSpacebarRun={onSpacebarRun}
          speechText={speechText}
        />

        {/* Manual Emotion Expression Switcher (for testing Task 2 compliance) */}
        {onSetEmotionDirectly && !pet.isSleeping && (
          <div className="mt-3 flex items-center gap-1 bg-[#FFFFFF] p-1 border border-[#111111] rounded shadow-[1px_1px_0px_#111111]">
            <span className="text-[9px] font-mono font-bold text-[#4B5563] px-1">Test Mood:</span>
            {(['idle', 'happy', 'sad', 'surprised', 'angry'] as Emotion[]).map((emo) => (
              <button
                key={emo}
                onClick={() => onSetEmotionDirectly(emo)}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-all ${
                  pet.currentEmotion === emo
                    ? 'bg-[#111111] text-[#FFFFFF] font-bold'
                    : 'text-[#111111] hover:bg-[#EDECE6]'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: Vitals Shelf & Action Controls */}
      <div className="space-y-3 pt-2">
        <PetStats
          hunger={pet.hunger}
          happiness={pet.happiness}
          energy={pet.energy}
        />

        <ActionDock
          onFeed={onFeed}
          onPlay={onPlay}
          onPet={onPet}
          onToggleSleep={onToggleSleep}
          isSleeping={pet.isSleeping}
          berriesCount={pet.berriesCount}
        />
      </div>
    </div>
  );
};

