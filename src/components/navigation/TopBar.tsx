import React from 'react';
import { Users, Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { sound } from '../../core/audio';

interface TopBarProps {
  pairingCode: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTasks: () => void;
  onOpenShared: () => void;
  onOpenSettings: () => void;
  pendingTasksCount: number;
  berriesCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  pairingCode,
  isMuted,
  onToggleMute,
  onOpenShared,
  berriesCount = 3,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(pairingCode);
    setCopied(true);
    sound.playChirp();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E8E3D8] shadow-xs z-30">
      {/* Left: Room Pairing Code Pill with One-Click Copy */}
      <button
        onClick={() => {
          sound.playChirp();
          onOpenShared();
        }}
        className="group flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-xs font-semibold text-[#18181B] transition-all shadow-xs"
        title="View Co-Parent Room & Members"
      >
        <Users size={13} className="text-[#C65A34]" />
        <span>#{pairingCode}</span>
        <span
          onClick={handleCopyCode}
          className="ml-0.5 p-0.5 hover:text-[#C65A34] text-[#A1A1AA] transition-colors"
          title="Copy Room Code"
        >
          {copied ? <Check size={11} className="text-[#2D6343]" /> : <Copy size={11} />}
        </span>
      </button>

      {/* Right Controls: Berry Reserve & Audio Mute */}
      <div className="flex items-center gap-2">
        {/* Berry Reserve Counter */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FDF0EB] border border-[#F6DACF] rounded-full text-xs font-semibold text-[#C65A34]">
          <span>🍓</span>
          <span className="font-mono font-bold text-[11px]">{berriesCount}</span>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-[#52525B] hover:text-[#18181B] transition-colors shadow-xs"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </header>
  );
};
