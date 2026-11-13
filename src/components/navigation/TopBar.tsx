import React, { useState } from 'react';
import { Users, Volume2, VolumeX, Copy, Check, Home, CheckSquare, Settings, Gamepad2, Monitor } from 'lucide-react';
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
  chassisMode = false,
  onToggleChassis,
}) => {
  const [copied, setCopied] = useState(false);

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
    <header className="w-full flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E3D8] shadow-xs z-30 transition-all select-none">
      {/* Left: Room Pairing Code Pill with 1-Click Copy */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            sound.playChirp();
            onOpenShared();
          }}
          className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-xs font-semibold text-[#18181B] transition-all shadow-xs"
          title="Open Co-Parenting Room"
        >
          <Users size={13} className="text-[#C65A34] shrink-0" />
          <span className="font-mono text-[11px] sm:text-xs">#{pairingCode}</span>
          <span
            onClick={handleCopyCode}
            className="p-0.5 hover:text-[#C65A34] text-[#A1A1AA] transition-colors"
            title="Copy Room Code"
          >
            {copied ? <Check size={12} className="text-[#2D6343]" /> : <Copy size={12} />}
          </span>
        </button>
      </div>

      {/* Center: Desktop Navigation Tabs (Visible on Tablet & Desktop >= 768px ONLY in Modern Mode) */}
      {onNavigate && !chassisMode && (
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF8F5] p-1 border border-[#E8E3D8] rounded-2xl mx-2">
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
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#18181B] shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#C65A34]' : 'text-[#71717A]'} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-[#D46E4A] text-[#FFFFFF] text-[9px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Controls: Berry Reserve, Sound Toggle, Chassis Mode Switch */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Berry Reserve Counter */}
        <div
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-[#FDF0EB] border border-[#F6DACF] rounded-full text-xs font-semibold text-[#C65A34] shadow-xs"
          title="Mochi's Snack Reserve"
        >
          <span className="text-xs">🍓</span>
          <span className="font-mono font-bold text-[11px] sm:text-xs">{berriesCount}</span>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-[#52525B] hover:text-[#18181B] transition-colors shadow-xs"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* Chassis Mode Quick Toggle */}
        {onToggleChassis && (
          <button
            onClick={onToggleChassis}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-xs border ${
              chassisMode
                ? 'bg-[#18181B] text-[#FFFFFF] border-[#18181B]'
                : 'bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#52525B] border-[#E8E3D8]'
            }`}
            title={chassisMode ? 'Switch to Modern Responsive View' : 'Switch to Retro Handheld Console Frame'}
          >
            {chassisMode ? <Monitor size={12} /> : <Gamepad2 size={12} />}
            <span className="text-[10px] hidden sm:inline">{chassisMode ? 'Modern' : 'Retro'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
