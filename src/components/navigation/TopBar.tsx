import React from 'react';
import { Users, Volume2, VolumeX, Copy, Check, Home, CheckSquare, Settings, Monitor } from 'lucide-react';
import { ScreenType } from '../../types/pet';
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
  currentScreen?: ScreenType;
  onNavigate?: (screen: ScreenType) => void;
  chassisMode?: boolean;
  onToggleChassis?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  pairingCode,
  isMuted,
  onToggleMute,
  onOpenShared,
  berriesCount = 3,
  pendingTasksCount = 0,
  currentScreen = 'pet',
  onNavigate,
  chassisMode,
  onToggleChassis,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(pairingCode);
    setCopied(true);
    sound.playChirp();
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: 'pet' as ScreenType, label: 'Room', icon: Home },
    { id: 'tasks' as ScreenType, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'shared' as ScreenType, label: 'Shared', icon: Users },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E3D8] shadow-xs z-30 transition-all">
      {/* Left: Brand / Room Pairing Code Pill with One-Click Copy */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playChirp();
            onOpenShared();
          }}
          className="group flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-xs font-semibold text-[#18181B] transition-all shadow-xs"
          title="View Co-Parent Room & Members"
        >
          <Users size={13} className="text-[#C65A34]" />
          <span className="font-mono">#{pairingCode}</span>
          <span
            onClick={handleCopyCode}
            className="ml-0.5 p-0.5 hover:text-[#C65A34] text-[#A1A1AA] transition-colors"
            title="Copy Room Code"
          >
            {copied ? <Check size={11} className="text-[#2D6343]" /> : <Copy size={11} />}
          </span>
        </button>
      </div>

      {/* Center: Desktop Navigation Tabs (Visible on Tablet & Desktop >= 768px) */}
      {onNavigate && (
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF8F5] p-1 border border-[#E8E3D8] rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playChirp();
                  onNavigate(item.id);
                }}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#18181B] shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#C65A34]' : 'text-[#71717A]'} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#D46E4A] text-[#FFFFFF] text-[9px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Controls: Berry Reserve, Sound Toggle, Console Mode Switch */}
      <div className="flex items-center gap-2">
        {/* Berry Reserve Counter */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 bg-[#FDF0EB] border border-[#F6DACF] rounded-full text-xs font-semibold text-[#C65A34]"
          title="Mochi's Snack Reserve"
        >
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

        {/* Desktop Chassis Mode Quick Toggle */}
        {onToggleChassis && (
          <button
            onClick={onToggleChassis}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-xs border ${
              chassisMode
                ? 'bg-[#18181B] text-[#FFFFFF] border-[#18181B]'
                : 'bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#52525B] border-[#E8E3D8]'
            }`}
            title="Toggle between Modern View and Retro Console Frame"
          >
            <Monitor size={12} />
            <span className="text-[10px]">{chassisMode ? 'Retro' : 'Modern'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
