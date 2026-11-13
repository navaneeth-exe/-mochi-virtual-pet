import React from 'react';
import { sound } from '../../core/audio';

interface ConsoleFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onFeedButton: () => void;
  onPlayButton: () => void;
  onTasksButton: () => void;
  onSettingsButton: () => void;
}

export const ConsoleFrame: React.FC<ConsoleFrameProps> = ({
  children,
  enabled,
  onFeedButton,
  onPlayButton,
  onTasksButton,
  onSettingsButton,
}) => {
  if (!enabled) {
    return (
      <div className="w-full max-w-[460px] mx-auto bg-[#FFFFFF] rounded-3xl shadow-[0_16px_48px_rgba(24,24,27,0.08)] border border-[#E8E3D8] overflow-hidden flex flex-col transition-all">
        {children}
      </div>
    );
  }

  return (
    <div className="handheld-chassis max-w-[460px] w-full mx-auto my-1 sm:my-4 flex flex-col items-center overflow-hidden transition-all">
      {/* Console Brand Header */}
      <div className="w-full flex items-center justify-between px-3 pb-3 text-[#9CA3AF]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest font-bold">BATTERY</span>
        </div>
        <div className="font-pixel text-[11px] tracking-wider text-[#D1D5DB]">
          ★ MOCHI POCKET ★
        </div>
        <div className="text-[9px] font-mono text-[#6B7280]">DOT MATRIX</div>
      </div>

      {/* Screen Window Viewport */}
      <div className="w-full rounded-2xl overflow-hidden shadow-inner border-2 border-[#111111] bg-[#FAF8F5]">
        {children}
      </div>

      {/* Physical Hardware Controls Dock */}
      <div className="w-full pt-4 sm:pt-6 pb-2 px-1 sm:px-4 flex items-center justify-between scale-[0.82] min-[380px]:scale-90 sm:scale-100 origin-center transition-transform">
        {/* Left: Directional D-Pad */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute w-8 h-24 bg-[#1E1E22] border-2 border-[#111111] rounded-md shadow-md flex flex-col justify-between items-center py-1">
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#9CA3AF] text-[9px] font-bold active:translate-y-0.5"
            >
              ▲
            </button>
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#9CA3AF] text-[9px] font-bold active:translate-y-0.5"
            >
              ▼
            </button>
          </div>
          <div className="absolute w-24 h-8 bg-[#1E1E22] border-2 border-[#111111] rounded-md shadow-md flex justify-between items-center px-1">
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#9CA3AF] text-[9px] font-bold active:translate-x-0.5"
            >
              ◀
            </button>
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#9CA3AF] text-[9px] font-bold active:translate-x-0.5"
            >
              ▶
            </button>
          </div>
          <div className="absolute w-5 h-5 rounded-full bg-[#141416]" />
        </div>

        {/* Center: System Start / Select Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sound.playChirp();
                onTasksButton();
              }}
              className="w-10 h-3 bg-[#374151] rounded-full -rotate-25 border border-[#111111] shadow active:translate-y-0.5"
            />
            <span className="text-[8px] font-mono text-[#9CA3AF] mt-1 tracking-tighter">TASKS</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sound.playChirp();
                onSettingsButton();
              }}
              className="w-10 h-3 bg-[#374151] rounded-full -rotate-25 border border-[#111111] shadow active:translate-y-0.5"
            />
            <span className="text-[8px] font-mono text-[#9CA3AF] mt-1 tracking-tighter">CONFIG</span>
          </div>
        </div>

        {/* Right: Round Action Buttons (B & A) */}
        <div className="flex items-center gap-3.5 -rotate-12">
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sound.playBite();
                onFeedButton();
              }}
              className="w-10 h-10 rounded-full bg-[#1F2937] border-2 border-[#111111] text-[#E5E7EB] font-pixel text-[10px] font-bold shadow-md active:translate-y-1 flex items-center justify-center"
            >
              B
            </button>
            <span className="text-[8px] font-mono text-[#9CA3AF] mt-1">FEED</span>
          </div>
          <div className="flex flex-col items-center -mt-4">
            <button
              onClick={() => {
                sound.playVictory();
                onPlayButton();
              }}
              className="w-10 h-10 rounded-full bg-[#374151] border-2 border-[#111111] text-[#FFFFFF] font-pixel text-[10px] font-bold shadow-md active:translate-y-1 flex items-center justify-center"
            >
              A
            </button>
            <span className="text-[8px] font-mono text-[#9CA3AF] mt-1">PLAY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
