import React from 'react';
import { Home, CheckSquare, Users, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '../../types/pet';
import { sound } from '../../core/audio';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  pendingTasksCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  pendingTasksCount,
}) => {
  const tabs = [
    { id: 'pet' as ScreenType, label: 'Room', icon: Home },
    { id: 'tasks' as ScreenType, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'shared' as ScreenType, label: 'Shared', icon: Users },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-full bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E8E3D8] px-3 py-1.5 flex items-center justify-around z-40 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.playChirp();
              onNavigate(tab.id);
            }}
            className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all focus:outline-none"
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-[#F3EFE6] rounded-xl -z-10"
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}

            <div className="relative">
              <Icon
                size={18}
                className={`transition-colors ${
                  isActive ? 'text-[#18181B] stroke-[2.5]' : 'text-[#71717A]'
                }`}
              />
              {/* Badge for Pending Tasks */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] bg-[#D46E4A] text-[#FFFFFF] text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] mt-0.5 font-medium transition-colors ${
                isActive ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
