import React, { useState, useEffect, useRef } from 'react';
import { Emotion } from '../../types/pet';
import { sound } from '../../core/audio';

interface MochiCharacterProps {
  emotion: Emotion;
  isSleeping: boolean;
  onDoubleTap: () => void;
  onFeedAtTop: () => void;
  onSpacebarRun: () => void;
  speechText?: string;
}

export const MochiCharacter: React.FC<MochiCharacterProps> = ({
  emotion,
  isSleeping,
  onDoubleTap,
  onFeedAtTop,
  onSpacebarRun,
  speechText
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSuperHappy, setIsSuperHappy] = useState(false);
  const [isChomping, setIsChomping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map emotion to sprite asset
  const spriteMap: Record<Emotion, string> = {
    idle: '/assets/mochi/mochi-idle.png',
    happy: '/assets/mochi/mochi-happy.png',
    sad: '/assets/mochi/mochi-sad.png',
    surprised: '/assets/mochi/mochi-surprised.png',
    angry: '/assets/mochi/mochi-angry.png'
  };

  // Keyboard Spacebar Listener: When hovered over Mochi and Space is pressed -> Run
  // Strictly guarded to never trigger while the user is typing inside an input or textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput) return;

      if (e.code === 'Space' && isHovered && !isSleeping) {
        e.preventDefault();
        triggerRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, isSleeping]);

  const triggerRun = () => {
    sound.playRun();
    setIsRunning(true);
    onSpacebarRun();
    setTimeout(() => {
      setIsRunning(false);
    }, 1600);
  };

  // Unified Pointer Down handler (Mouse, Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSleeping) return;
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 340 && timeDiff > 0) {
      // Double-tap / double-click detected!
      sound.playVictory();
      setIsSuperHappy(true);
      onDoubleTap();
      setTimeout(() => setIsSuperHappy(false), 1200);
    } else {
      // Single tap: playful chirp
      sound.playChirp();
    }
    lastTapRef.current = now;
    setIsDragging(true);
    setDragY(e.clientY);
  };

  // Drag interaction to window top for feeding (Task 1 Gesture 3)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSleeping) return;
    setDragY(e.clientY);

    // If dragged to the top 65px of the window
    if (e.clientY <= 65) {
      setIsDragging(false);
      triggerFeed();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragY(0);
  };

  const triggerFeed = () => {
    sound.playBite();
    setIsChomping(true);
    onFeedAtTop();
    setTimeout(() => setIsChomping(false), 1000);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-4 cursor-pointer select-none touch-none focus:outline-none focus:ring-1 focus:ring-[#111111] rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      tabIndex={0}
      role="region"
      aria-label={`Mochi companion character, feeling ${emotion}${isSleeping ? ', asleep' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          if (!isSleeping) {
            e.preventDefault();
            triggerRun();
          }
        }
      }}
    >
      {/* Speech Bubble / Thought Banner */}
      {speechText && !isSleeping && (
        <div className="speech-bubble mb-3 animate-fade-in">
          {speechText}
        </div>
      )}

      {/* Sleeping Floating Zzz */}
      {isSleeping && (
        <div className="absolute -top-6 right-8 text-sm font-bold tracking-widest text-[#111111] animate-zzz flex gap-1">
          <span>Z</span>
          <span className="text-xs">z</span>
          <span className="text-[10px]">z</span>
        </div>
      )}

      {/* Dragging instruction indicator */}
      {isDragging && (
        <div className="absolute -top-12 px-3 py-1 bg-[#111111] text-[#FFFFFF] text-[10px] font-bold rounded-full animate-pulse border border-[#FFFFFF]">
          ↑ Drag to top to feed! Y: {Math.round(dragY)}px
        </div>
      )}

      {/* Mochi Character Sprite */}
      <div
        className={`relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transition-transform ${
          isRunning
            ? 'animate-run'
            : isSuperHappy
            ? 'animate-super-happy'
            : isChomping
            ? 'animate-chomp'
            : isSleeping
            ? 'opacity-80 scale-95'
            : 'animate-idle'
        }`}
      >
        <img
          src={isSleeping ? '/assets/mochi/mochi-idle.png' : spriteMap[emotion]}
          alt={`Mochi is ${emotion}`}
          className="w-full h-full object-contain pixelated filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
          draggable={false}
        />

        {/* Eating Heart particle */}
        {isChomping && (
          <div className="absolute top-0 right-4 text-xl animate-bounce">
            ❤️
          </div>
        )}
      </div>

      {/* Ground Shadow */}
      <div className="w-36 h-3 bg-[#D4D4CE] rounded-full mt-1 opacity-70 filter blur-[1px]" />

      {/* Hover Keyboard Prompt Hint */}
      {isHovered && !isSleeping && (
        <div className="mt-2 text-[10px] font-mono text-[#4B5563] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#111111] shadow-[1px_1px_0px_#111111]">
          [SPACE] to run • Double-click for Super Happy!
        </div>
      )}
    </div>
  );
};

