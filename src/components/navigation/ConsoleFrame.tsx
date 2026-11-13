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
  onSettingsButton
}) => {
  if (!enabled) {
    return <div className="w-full max-w-md mx-auto">{children}</div>;
  }

  return (
    <div className="handheld-chassis max-w-[460px] w-full mx-auto my-1 sm:my-4 flex flex-col items-center overflow-hidden">
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
      <div className="w-full rounded-2xl overflow-hidden shadow-inner border-2 border-[#111111]">
        {children}
      </div>

      {/* Physical Hardware Controls Dock */}
      <div className="w-full pt-4 sm:pt-6 pb-2 px-1 sm:px-4 flex items-center justify-between scale-[0.82] min-[380px]:scale-90 sm:scale-100 origin-center transition-transform">
        {/* Left: Directional D-Pad */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Vertical bar */}
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
          {/* Horizontal bar */}
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
          {/* Center axis */}
          <div className="absolute w-5 h-5 rounded-full bg-[#141416]" />
        </div>

        {/* Center: SELECT / START Pill Buttons */}
        <div className="flex gap-4 -rotate-12 pt-6">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onTasksButton}
              className="w-10 h-3.5 bg-[#4B5563] border border-[#111111] rounded-full shadow active:translate-y-0.5"
              title="Open Tasks (SELECT)"
            />
            <span className="text-[8px] font-mono tracking-widest text-[#9CA3AF] font-bold">
              TASKS
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onSettingsButton}
              className="w-10 h-3.5 bg-[#4B5563] border border-[#111111] rounded-full shadow active:translate-y-0.5"
              title="Open Settings (START)"
            />
            <span className="text-[8px] font-mono tracking-widest text-[#9CA3AF] font-bold">
              CONFIG
            </span>
          </div>
        </div>

        {/* Right: A & B Action Buttons */}
        <div className="flex items-center gap-3 -rotate-12">
          {/* B Button (Play) */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onPlayButton}
              className="w-10 h-10 rounded-full bg-[#374151] text-[#E5E7EB] font-pixel text-xs font-bold border-2 border-[#111111] shadow-[2px_3px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5"
              title="Play (Button B)"
            >
              B
            </button>
            <span className="text-[8px] font-mono text-[#9CA3AF] font-bold">PLAY</span>
          </div>

          {/* A Button (Feed) */}
          <div className="flex flex-col items-center gap-1 -translate-y-3">
            <button
              onClick={onFeedButton}
              className="w-10 h-10 rounded-full bg-[#111111] text-[#FFFFFF] font-pixel text-xs font-bold border-2 border-[#111111] shadow-[2px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
              title="Feed (Button A)"
            >
              A
            </button>
            <span className="text-[8px] font-mono text-[#9CA3AF] font-bold">FEED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

