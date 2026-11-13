import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType } from './types/pet';
import { sound } from './core/audio';
import { loadSettings, saveSettings, AppSettings } from './core/storage';
import { usePet } from './hooks/usePet';
import { useTasks } from './hooks/useTasks';

import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { ConsoleFrame } from './components/navigation/ConsoleFrame';
import { Toast } from './components/common/Toast';
import { SharedRoomModal } from './components/shared/SharedRoomModal';
import { SettingsModal } from './components/settings/SettingsModal';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { MainPetScreen } from './screens/MainPetScreen';
import { TasksScreen } from './screens/TasksScreen';
import { SharedPetScreen } from './screens/SharedPetScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export const App: React.FC = () => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Settings State (Persisted)
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  }, []);

  // Sync settings sound with audio synth
  useEffect(() => {
    sound.isMuted = settings.isMuted;
    saveSettings(settings);
  }, [settings]);

  const handleToggleMute = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.isMuted;
      sound.isMuted = next;
      if (!next) sound.playChirp();
      showToast(next ? 'Sound Muted' : 'Sound Enabled');
      return { ...prev, isMuted: next };
    });
  }, [showToast]);

  const handleToggleChassis = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.chassisMode;
      showToast(next ? 'Retro Console Enabled' : 'Modern View Enabled');
      return { ...prev, chassisMode: next };
    });
  }, [showToast]);

  // Tasks & Productivity State Hook
  const {
    tasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    triggerReminder,
    pendingCount,
    streakDays,
  } = useTasks(
    (amount) => {
      // Reward berries when task completed
      awardBerries(amount);
      sound.playVictory();
    },
    showToast
  );

  // Pet State Machine & Persistence Hook
  const {
    pet,
    speechText,
    currentUser,
    roomMembers,
    engineType,
    handleFeed,
    handlePlay,
    handlePet,
    handleToggleSleep,
    handleSpacebarRun,
    handleDoubleTap,
    handleResetPet,
    handleSetEmotionDirectly,
    awardBerries,
    handleCreateRoom,
    handleJoinRoom,
  } = usePet(tasks, showToast);

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center p-2 sm:p-6 transition-colors duration-500 overflow-x-hidden ${
        settings.chassisMode ? 'bg-[#1E1E22]' : 'bg-[#FAF8F5]'
      }`}
    >
      {/* Toast Alert */}
      <Toast message={toastMessage} />

      {/* Handheld Frame / Responsive Device Chassis Container */}
      <ConsoleFrame
        enabled={settings.chassisMode}
        onFeedButton={handleFeed}
        onPlayButton={handlePlay}
        onTasksButton={() => setCurrentScreen('tasks')}
        onSettingsButton={() => setIsSettingsModalOpen(true)}
      >
        <div className="w-full flex flex-col justify-between min-h-[640px] bg-[#FFFFFF] relative overflow-hidden transition-all">
          {/* Top Bar Navigation (when not on welcome) */}
          {currentScreen !== 'welcome' && (
            <TopBar
              pairingCode={pet.pairingCode}
              isMuted={settings.isMuted}
              onToggleMute={handleToggleMute}
              onOpenTasks={() => setCurrentScreen('tasks')}
              onOpenShared={() => setCurrentScreen('shared')}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              pendingTasksCount={pendingCount}
              berriesCount={pet.berriesCount}
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              chassisMode={settings.chassisMode}
              onToggleChassis={handleToggleChassis}
            />
          )}

          {/* Active Screen View */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {currentScreen === 'welcome' && (
              <WelcomeScreen
                onStart={() => setCurrentScreen('pet')}
                onJoinShared={() => setCurrentScreen('shared')}
              />
            )}

            {currentScreen === 'pet' && (
              <MainPetScreen
                pet={pet}
                onFeed={handleFeed}
                onPlay={handlePlay}
                onPet={handlePet}
                onToggleSleep={handleToggleSleep}
                onDoubleTap={handleDoubleTap}
                onSpacebarRun={handleSpacebarRun}
                speechText={speechText}
                onSetEmotionDirectly={handleSetEmotionDirectly}
                tasks={tasks}
                onToggleTask={toggleTask}
                onNavigate={(s) => setCurrentScreen(s)}
                streakDays={streakDays}
              />
            )}

            {currentScreen === 'tasks' && (
              <TasksScreen
                tasks={tasks}
                onAddTask={addTask}
                onEditTask={editTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onBack={() => setCurrentScreen('pet')}
                streakDays={streakDays}
                onTriggerReminder={triggerReminder}
              />
            )}

            {currentScreen === 'shared' && (
              <SharedPetScreen
                pairingCode={pet.pairingCode}
                onBack={() => setCurrentScreen('pet')}
                onJoinRoom={async (code) => {
                  await handleJoinRoom(code);
                  setCurrentScreen('pet');
                }}
                onCreateRoom={handleCreateRoom}
                roomMembers={roomMembers}
                currentUser={currentUser}
                engineType={engineType}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                onBack={() => setCurrentScreen('pet')}
                isMuted={settings.isMuted}
                onToggleMute={handleToggleMute}
                chassisMode={settings.chassisMode}
                onToggleChassis={handleToggleChassis}
                onResetPet={handleResetPet}
                onViewOnboarding={() => setCurrentScreen('welcome')}
              />
            )}
          </main>

          {/* Modern Mobile Bottom Navigation (Hidden on Tablet / Desktop md:) */}
          {currentScreen !== 'welcome' && (
            <BottomNav
              currentScreen={currentScreen}
              onNavigate={(screen) => setCurrentScreen(screen)}
              pendingTasksCount={pendingCount}
            />
          )}
        </div>
      </ConsoleFrame>

      {/* Shared Room Modal (Quick Access) */}
      <SharedRoomModal
        isOpen={isSharedModalOpen}
        onClose={() => setIsSharedModalOpen(false)}
        pairingCode={pet.pairingCode}
        roomMembers={roomMembers}
        engineType={engineType}
        onJoinRoom={async (code) => {
          await handleJoinRoom(code);
          setIsSharedModalOpen(false);
        }}
      />

      {/* Settings Modal (Quick Access) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetPet={handleResetPet}
        isMuted={settings.isMuted}
        onToggleMute={handleToggleMute}
        chassisMode={settings.chassisMode}
        onToggleChassis={handleToggleChassis}
        onBackToWelcome={() => {
          setIsSettingsModalOpen(false);
          setCurrentScreen('welcome');
        }}
      />
    </div>
  );
};
