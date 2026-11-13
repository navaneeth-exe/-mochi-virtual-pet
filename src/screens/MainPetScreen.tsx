import React from 'react';
import { motion } from 'motion/react';
import { PetState, Emotion, TaskItem, ScreenType } from '../types/pet';
import { MochiCharacter } from '../components/pet/MochiCharacter';
import { PetStats } from '../components/pet/PetStats';
import { ActionDock } from '../components/pet/ActionDock';
import { Sparkles, Moon, CheckCircle2, Flame, ArrowRight, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../core/audio';

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
  tasks?: TaskItem[];
  onToggleTask?: (id: string) => void;
  onNavigate?: (screen: ScreenType) => void;
  streakDays?: number;
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
  tasks = [],
  onToggleTask,
  onNavigate,
  streakDays = 3,
}) => {
  const emotionEmojiMap: Record<Emotion, string> = {
    idle: '🌱 Content',
    happy: '💖 Joyful',
    sad: '💧 Sad',
    surprised: '✨ Curious',
    angry: '💢 Pouty',
  };

  const handleTaskCheck = (taskId: string, isCompleted: boolean, e: React.MouseEvent) => {
    if (!onToggleTask) return;
    sound.playVictory();
    if (!isCompleted) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ['#407655', '#D46E4A', '#6B5696'],
        disableForReducedMotion: true,
      });
    }
    onToggleTask(taskId);
  };

  const pendingTasks = tasks.filter((t) => !t.isCompleted).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative w-full min-h-[580px] lg:min-h-[660px] p-3.5 sm:p-5 lg:p-6 transition-colors duration-700 overflow-hidden flex flex-col justify-between ${
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

      {/* Top Header & Status Bar */}
      <div className="relative z-10 flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              pet.isSleeping ? 'bg-[#A1A1AA]' : 'bg-[#407655] animate-pulse'
            }`}
          />
          <h2 className="text-xs sm:text-sm font-semibold tracking-tight">
            {pet.name}'s Cozy Sanctuary
          </h2>
        </div>

        {/* Emotion Indicator Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium shadow-xs backdrop-blur-sm transition-all ${
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

      {/* Main Responsive Layout: Single Column on Mobile, Dual Column on Desktop (lg:) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center my-auto">
        {/* Left Column (Mochi Character Stage & Mobile Actions) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center py-2 sm:py-4">
          <MochiCharacter
            emotion={pet.currentEmotion}
            isSleeping={pet.isSleeping}
            onDoubleTap={onDoubleTap}
            onFeedAtTop={onFeed}
            onSpacebarRun={onSpacebarRun}
            speechText={speechText}
          />

          {/* Manual Emotion Expression Switcher */}
          {onSetEmotionDirectly && !pet.isSleeping && (
            <div className="mt-3 flex items-center gap-1 bg-[#FFFFFF]/90 backdrop-blur-sm px-2.5 py-1.5 border border-[#E8E3D8] rounded-full shadow-xs">
              <span className="text-[10px] font-sans font-semibold text-[#71717A] pr-1">
                Expression:
              </span>
              {(['idle', 'happy', 'sad', 'surprised', 'angry'] as Emotion[]).map((emo) => (
                <button
                  key={emo}
                  onClick={() => onSetEmotionDirectly(emo)}
                  className={`text-[10px] font-sans px-2 py-0.5 rounded-full capitalize transition-all ${
                    pet.currentEmotion === emo
                      ? 'bg-[#18181B] text-[#FFFFFF] font-bold shadow-xs'
                      : 'text-[#52525B] hover:bg-[#F3EFE6]'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          )}

          {/* Action Dock (Always directly under Mochi) */}
          <div className="w-full max-w-sm mt-4">
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

        {/* Right Column (Desktop Companion Drawer - Visible on lg:) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col gap-4 self-stretch justify-center">
          {/* Vitals Shelf in Desktop Side Panel */}
          <PetStats
            hunger={pet.hunger}
            happiness={pet.happiness}
            energy={pet.energy}
          />

          {/* Desktop Daily Habits & Quick Tasks Card */}
          <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#E8F2EA] rounded-xl text-[#2D6343]">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#18181B]">Companion Habits</h4>
                  <p className="text-[10px] text-[#71717A]">Check off to award berries</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FDF0EB] border border-[#F6DACF] rounded-full text-[10px] font-bold text-[#C65A34]">
                <Flame size={12} className="fill-[#C65A34]" />
                <span>{streakDays}d Streak</span>
              </div>
            </div>

            {/* Quick Task List */}
            <div className="space-y-1.5">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={(e) => handleTaskCheck(t.id, t.isCompleted, e)}
                    className="flex items-center justify-between p-2 rounded-xl border border-[#E8E3D8] hover:border-[#18181B] bg-[#FAF8F5] cursor-pointer transition-all text-xs"
                  >
                    <span className="truncate pr-2 font-medium text-[#18181B]">{t.title}</span>
                    <span className="shrink-0 text-[10px] text-[#C65A34] font-semibold">+1 🍓</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-[11px] text-[#71717A]">
                  All daily tasks completed! 🎉
                </div>
              )}
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('tasks')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-[#18181B] hover:text-[#C65A34] transition-colors border-t border-[#F3EFE6] pt-2"
              >
                <span>Manage All Tasks</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>

          {/* Desktop Co-Parenting Summary Card */}
          <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#FDF0EB] rounded-xl text-[#C65A34]">
                <Users size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18181B]">Shared Pet Room</p>
                <p className="text-[10px] font-mono text-[#71717A]">Code: #{pet.pairingCode}</p>
              </div>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('shared')}
                className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-lg text-[10px] font-semibold text-[#18181B] transition-colors"
              >
                View Room
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Vitals Shelf (Mobile-Only - visible on < lg:) */}
      <div className="relative z-10 lg:hidden pt-2">
        <PetStats
          hunger={pet.hunger}
          happiness={pet.happiness}
          energy={pet.energy}
        />
      </div>
    </motion.div>
  );
};
