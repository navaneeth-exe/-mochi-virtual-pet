import React from 'react';
import { motion } from 'motion/react';
import { PetState, Emotion } from '../types/pet';
import { MochiCharacter } from '../components/pet/MochiCharacter';
import { PetStats } from '../components/pet/PetStats';
import { ActionDock } from '../components/pet/ActionDock';
import { Sparkles, Moon } from 'lucide-react';

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
  const emotionEmojiMap: Record<Emotion, string> = {
    idle: '🌱 Content',
    happy: '💖 Joyful',
    sad: '💧 Sad',
    surprised: '✨ Curious',
    angry: '💢 Pouty',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative flex flex-col justify-between p-4 sm:p-5 min-h-[560px] w-full transition-colors duration-700 overflow-hidden ${
        pet.isSleeping
          ? 'bg-gradient-to-b from-[#24242C] via-[#1E1E26] to-[#16161C] text-[#E4E4E7]'
          : 'bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EAE3D2] text-[#18181B]'
      }`}
    >
      {/* Ambient Decorative Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {pet.isSleeping ? (
          <>
            <div className="absolute top-6 left-8 w-1 h-1 rounded-full bg-white opacity-60 animate-ping" />
            <div className="absolute top-14 right-12 w-1.5 h-1.5 rounded-full bg-white opacity-40" />
            <div className="absolute top-28 left-20 w-1 h-1 rounded-full bg-white opacity-50" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#3B3B54] opacity-20 filter blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#FDF0EB] opacity-60 filter blur-3xl" />
            <div className="absolute top-32 -right-16 w-56 h-56 rounded-full bg-[#EFEAF8] opacity-50 filter blur-3xl" />
          </>
        )}
      </div>

      {/* Top Section: Room Header & Status Message */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              pet.isSleeping ? 'bg-[#A1A1AA]' : 'bg-[#407655] animate-pulse'
            }`}
          />
          <h2 className="text-xs sm:text-sm font-semibold tracking-tight">
            {pet.name}'s Cozy Room
          </h2>
        </div>

        {/* Emotion Indicator Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium shadow-sm backdrop-blur-sm transition-all ${
            pet.isSleeping
              ? 'bg-[#2E2E38]/80 border-[#3F3F4E] text-[#D4D4D8]'
              : 'bg-[#FFFFFF]/90 border-[#E8E3D8] text-[#18181B]'
          }`}
        >
          {pet.isSleeping ? (
            <>
              <Moon size={12} className="text-[#A1A1AA]" />
              <span>Resting Zzz</span>
            </>
          ) : (
            <>
              <Sparkles size={12} className="text-[#C65A34]" />
              <span>{emotionEmojiMap[pet.currentEmotion]}</span>
            </>
          )}
        </div>
      </div>

      {/* Center Section: Living Mochi Canvas & Gestures */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center">
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
          <div className="mt-3 flex items-center gap-1 bg-[#FFFFFF]/90 backdrop-blur-sm px-2.5 py-1.5 border border-[#E8E3D8] rounded-full shadow-sm">
            <span className="text-[10px] font-sans font-semibold text-[#71717A] pr-1">
              Expression:
            </span>
            {(['idle', 'happy', 'sad', 'surprised', 'angry'] as Emotion[]).map((emo) => (
              <button
                key={emo}
                onClick={() => onSetEmotionDirectly(emo)}
                className={`text-[10px] font-sans px-2 py-0.5 rounded-full capitalize transition-all ${
                  pet.currentEmotion === emo
                    ? 'bg-[#18181B] text-[#FFFFFF] font-bold shadow-sm'
                    : 'text-[#52525B] hover:bg-[#F3EFE6]'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: Vitals Shelf & Action Controls */}
      <div className="relative z-10 space-y-2.5 pt-2">
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
    </motion.div>
  );
};
