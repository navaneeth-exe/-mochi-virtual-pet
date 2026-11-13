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
      <div
        data-chassis="false"
        className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-[#FFFFFF] rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(24,24,27,0.06)] border border-[#E8E3D8] overflow-hidden flex flex-col transition-all duration-300"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-chassis="true"
      className="handheld-chassis max-w-[460px] w-full mx-auto my-2 sm:my-6 flex flex-col items-center overflow-hidden transition-all duration-300 pt-3 pb-2 px-2.5 sm:px-3 bg-[#1A1A1E] rounded-[36px] shadow-[0_24px_70px_rgba(0,0,0,0.6)] border-4 border-[#111113]"
    >
      {/* Console Brand Header with Ample Top Breathing Room */}
      <div className="w-full flex items-center justify-between px-3 pt-2 pb-3 text-[#A1A1AA]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-[10px] font-mono tracking-widest font-bold text-[#E4E4E7]">BATTERY</span>
        </div>
        <div className="font-pixel text-[11px] tracking-widest font-bold text-[#F4F4F5] drop-shadow-sm">
          ★ MOCHI POCKET ★
        </div>
        <div className="text-[9px] font-mono tracking-wider font-semibold text-[#A1A1AA]">DOT MATRIX</div>
      </div>

      {/* Screen Window Viewport */}
      <div className="w-full rounded-2xl overflow-hidden shadow-inner border-2 border-[#111111] bg-[#FAF8F5]">
        {children}
      </div>

      {/* Physical Hardware Controls Dock */}
      <div className="w-full pt-4 sm:pt-6 pb-2 px-2 sm:px-4 flex items-center justify-between scale-[0.85] min-[380px]:scale-90 sm:scale-100 origin-center transition-transform">
        {/* Left: Directional D-Pad */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute w-8 h-24 bg-[#232328] border-2 border-[#0D0D0E] rounded-md shadow-lg flex flex-col justify-between items-center py-1">
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#E4E4E7] text-[10px] font-bold active:translate-y-0.5 hover:text-[#FFFFFF] transition-colors"
              title="D-Pad Up"
            >
              ▲
            </button>
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#E4E4E7] text-[10px] font-bold active:translate-y-0.5 hover:text-[#FFFFFF] transition-colors"
              title="D-Pad Down"
            >
              ▼
            </button>
          </div>
          <div className="absolute w-24 h-8 bg-[#232328] border-2 border-[#0D0D0E] rounded-md shadow-lg flex justify-between items-center px-1">
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#E4E4E7] text-[10px] font-bold active:translate-x-0.5 hover:text-[#FFFFFF] transition-colors"
              title="D-Pad Left"
            >
              ◀
            </button>
            <button
              onClick={() => sound.playChirp()}
              className="w-6 h-6 text-[#E4E4E7] text-[10px] font-bold active:translate-x-0.5 hover:text-[#FFFFFF] transition-colors"
              title="D-Pad Right"
            >
              ▶
            </button>
          </div>
          <div className="absolute w-5 h-5 rounded-full bg-[#16161A] shadow-inner" />
        </div>

        {/* Center: System Start / Select Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sound.playChirp();
                onTasksButton();
              }}
              className="w-10 h-3.5 bg-[#3F3F46] hover:bg-[#52525B] rounded-full -rotate-25 border border-[#18181B] shadow-md active:translate-y-0.5 transition-all"
              title="Tasks Shortcut"
            />
            <span className="text-[9px] font-mono font-bold text-[#D4D4D8] mt-1.5 tracking-wider">TASKS</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                sound.playChirp();
                onSettingsButton();
              }}
              className="w-10 h-3.5 bg-[#3F3F46] hover:bg-[#52525B] rounded-full -rotate-25 border border-[#18181B] shadow-md active:translate-y-0.5 transition-all"
              title="Config Shortcut"
            />
            <span className="text-[9px] font-mono font-bold text-[#D4D4D8] mt-1.5 tracking-wider">CONFIG</span>
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
              className="w-10 h-10 rounded-full bg-[#27272A] hover:bg-[#3F3F46] border-2 border-[#111113] text-[#F4F4F5] font-pixel text-[11px] font-bold shadow-md active:translate-y-1 flex items-center justify-center transition-all"
              title="B Button (Feed)"
            >
              B
            </button>
            <span className="text-[9px] font-mono font-bold text-[#D4D4D8] mt-1 tracking-wider">FEED</span>
          </div>
          <div className="flex flex-col items-center -mt-4">
            <button
              onClick={() => {
                sound.playVictory();
                onPlayButton();
              }}
              className="w-10 h-10 rounded-full bg-[#3F3F46] hover:bg-[#52525B] border-2 border-[#111113] text-[#FFFFFF] font-pixel text-[11px] font-bold shadow-md active:translate-y-1 flex items-center justify-center transition-all"
              title="A Button (Play)"
            >
              A
            </button>
            <span className="text-[9px] font-mono font-bold text-[#D4D4D8] mt-1 tracking-wider">PLAY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
