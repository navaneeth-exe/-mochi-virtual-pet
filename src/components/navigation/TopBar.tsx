import React from 'react';
import { Users, Volume2, VolumeX, CheckSquare, Settings } from 'lucide-react';
import { sound } from '../../core/audio';

interface TopBarProps {
  pairingCode: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTasks: () => void;
  onOpenShared: () => void;
  onOpenSettings: () => void;
  pendingTasksCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  pairingCode,
  isMuted,
  onToggleMute,
  onOpenTasks,
  onOpenShared,
  onOpenSettings,
  pendingTasksCount
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[#FFFFFF] border-b-2 border-[#111111] shadow-[0_2px_0px_rgba(0,0,0,0.06)]">
      {/* Left: Room Pairing Code Pill */}
      <button
        onClick={() => {
          sound.playChirp();
          onOpenShared();
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EDECE6] hover:bg-[#D4D4CE] border border-[#111111] rounded-full text-[10px] font-mono font-bold text-[#111111] transition-colors shadow-[1px_1px_0px_#111111]"
        title="View Shared Pet Room"
      >
        <Users size={12} />
        <span>#{pairingCode}</span>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        {/* Tasks Button with badge */}
        <button
          onClick={() => {
            sound.playChirp();
            onOpenTasks();
          }}
          className="relative p-1.5 bg-[#EDECE6] hover:bg-[#D4D4CE] border border-[#111111] rounded text-[#111111] transition-colors shadow-[1px_1px_0px_#111111]"
          title="Companion Tasks"
        >
          <CheckSquare size={14} />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#111111] text-[#FFFFFF] text-[8px] font-mono font-bold rounded-full flex items-center justify-center">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 bg-[#EDECE6] hover:bg-[#D4D4CE] border border-[#111111] rounded text-[#111111] transition-colors shadow-[1px_1px_0px_#111111]"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            sound.playChirp();
            onOpenSettings();
          }}
          className="p-1.5 bg-[#EDECE6] hover:bg-[#D4D4CE] border border-[#111111] rounded text-[#111111] transition-colors shadow-[1px_1px_0px_#111111]"
          title="Companion Settings"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
};

