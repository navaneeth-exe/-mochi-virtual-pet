import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Emotion } from '../../types/pet';
import { sound } from '../../core/audio';
import confetti from 'canvas-confetti';

interface MochiCharacterProps {
  emotion: Emotion;
  isSleeping: boolean;
  onDoubleTap: () => void;
  onFeedAtTop: () => void;
  onSpacebarRun: () => void;
  speechText?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  icon: string;
}

export const MochiCharacter: React.FC<MochiCharacterProps> = ({
  emotion,
  isSleeping,
  onDoubleTap,
  onFeedAtTop,
  onSpacebarRun,
  speechText,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSuperHappy, setIsSuperHappy] = useState(false);
  const [isChomping, setIsChomping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1 as dragged upward
  const [particles, setParticles] = useState<Particle[]>([]);

  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef<number>(0);

  // Map emotion to sprite asset (Strictly monochrome)
  const spriteMap: Record<Emotion, string> = {
    idle: '/assets/mochi/mochi-idle.png',
    happy: '/assets/mochi/mochi-happy.png',
    sad: '/assets/mochi/mochi-sad.png',
    surprised: '/assets/mochi/mochi-surprised.png',
    angry: '/assets/mochi/mochi-angry.png',
  };

  // Keyboard Spacebar Listener: When hovered over Mochi and Space is pressed -> Run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isInput) return;

      if (e.code === 'Space' && isHovered && !isSleeping && !isRunning) {
        e.preventDefault();
        triggerRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, isSleeping, isRunning]);

  const triggerRun = () => {
    sound.playRun();
    setIsRunning(true);
    onSpacebarRun();
    setTimeout(() => {
      setIsRunning(false);
    }, 1800);
  };

  // Spawn visual floating particle on pet or interaction
  const spawnParticle = (clientX: number, clientY: number, icon = '❤️') => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left + (Math.random() * 20 - 10);
    const y = clientY - rect.top;
    
    const newId = ++particleIdRef.current;
    setParticles((prev) => [...prev, { id: newId, x, y, icon }]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 1000);
  };

  // Unified Pointer Down handler (Mouse, Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSleeping) return;
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    if (timeDiff < 340 && timeDiff > 0) {
      // Double-tap detected -> Super Happy!
      sound.playVictory();
      setIsSuperHappy(true);
      onDoubleTap();

      // Trigger celebratory mini confetti
      confetti({
        particleCount: 25,
        spread: 50,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ['#18181B', '#E5E5E5', '#A1A1AA'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setIsSuperHappy(false), 1400);
    } else {
      // Single tap: cheerful chirp & heart particle
      sound.playChirp();
      spawnParticle(e.clientX, e.clientY, '✨');
    }
    lastTapRef.current = now;
  };

  // Drag handler for feeding at the top of the window
  const handleDrag = (_: unknown, info: { point: { x: number; y: number }; offset: { y: number } }) => {
    if (isSleeping) return;
    setIsDragging(true);

    const clientY = info.point.y;
    // Calculate drag progress towards top (0 at start, 1 when <= 80px from top)
    const progress = Math.min(Math.max((window.innerHeight * 0.4 - clientY) / (window.innerHeight * 0.4 - 80), 0), 1);
    setDragProgress(progress);

    if (clientY <= 80) {
      setIsDragging(false);
      setDragProgress(0);
      triggerFeed();
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragProgress(0);
  };

  const triggerFeed = () => {
    sound.playBite();
    setIsChomping(true);
    onFeedAtTop();
    spawnParticle(window.innerWidth / 2, 100, '🍓');
    setTimeout(() => setIsChomping(false), 1200);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-3 select-none touch-none focus:outline-none rounded-2xl w-full max-w-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      tabIndex={0}
      role="region"
      aria-label={`Mochi companion character, feeling ${emotion}${isSleeping ? ', asleep' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isSleeping) {
          e.preventDefault();
          triggerRun();
        }
      }}
    >
      {/* Top Feed Drop Zone Illuminator (Animates when dragging upwards) */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full border-2 border-[#18181B] bg-[#FFFFFF] shadow-xl flex items-center gap-2 pointer-events-none"
            style={{
              borderColor: dragProgress > 0.7 ? '#D46E4A' : '#18181B',
              backgroundColor: dragProgress > 0.7 ? '#FDF0EB' : '#FFFFFF',
            }}
          >
            <span className="text-base animate-bounce">🍙</span>
            <span className="text-xs font-bold font-sans text-[#18181B]">
              {dragProgress > 0.7 ? 'Drop to Feed Mochi!' : 'Drag to top to feed...'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Container */}
      <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.6, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1.3, y: p.y - 60 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute text-lg"
          >
            {p.icon}
          </motion.div>
        ))}
      </div>

      {/* Dynamic Thought / Speech Bubble */}
      <AnimatePresence mode="wait">
        {speechText && !isSleeping && (
          <motion.div
            key={speechText}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            className="speech-bubble-modern mb-3 z-20 cursor-default"
          >
            {speechText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleeping Floating Zzz */}
      <AnimatePresence>
        {isSleeping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-4 right-10 flex items-baseline gap-1 font-bold text-[#71717A] z-20 pointer-events-none"
          >
            <motion.span
              animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-base font-pixel"
            >
              Z
            </motion.span>
            <motion.span
              animate={{ y: [0, -10, 0], opacity: [0.2, 0.9, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: 'easeInOut' }}
              className="text-xs font-pixel"
            >
              z
            </motion.span>
            <motion.span
              animate={{ y: [0, -8, 0], opacity: [0.1, 0.8, 0.1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.8, ease: 'easeInOut' }}
              className="text-[10px] font-pixel"
            >
              z
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Draggable & Animatable Character Container */}
      <motion.div
        drag={!isSleeping}
        dragConstraints={{ top: -260, bottom: 20, left: -60, right: 60 }}
        dragElastic={0.25}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        whileHover={!isSleeping ? { scale: 1.03 } : {}}
        whileTap={!isSleeping ? { scale: 0.96 } : {}}
        className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      >
        <motion.div
          animate={
            isRunning
              ? {
                  x: [0, 80, -80, 0],
                  scaleX: [1, 1, -1, 1],
                  y: [0, -10, 0, -10, 0],
                  transition: { duration: 1.6, ease: 'easeInOut' },
                }
              : isSuperHappy
              ? {
                  y: [0, -36, 0, -20, 0],
                  scale: [1, 1.18, 0.92, 1.08, 1],
                  rotate: [0, -6, 6, -4, 0],
                  transition: { duration: 1.2, ease: 'easeOut' },
                }
              : isChomping
              ? {
                  scale: [1, 1.15, 0.92, 1.1, 1],
                  rotate: [0, -4, 4, -2, 0],
                  transition: { duration: 0.8, repeat: 1 },
                }
              : isSleeping
              ? {
                  scale: [0.94, 0.96, 0.94],
                  y: [0, 2, 0],
                  transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                }
              : {
                  y: [0, -5, 0],
                  scale: [1, 1.015, 1],
                  transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                }
          }
          className="w-full h-full flex items-center justify-center"
        >
          {/* Strict Monochrome Character Sprite */}
          <img
            src={isSleeping ? '/assets/mochi/mochi-idle.png' : spriteMap[emotion]}
            alt={`Mochi feeling ${emotion}`}
            className="w-full h-full object-contain pixelated filter drop-shadow-[0_8px_16px_rgba(24,24,27,0.12)]"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* Harmonic Ground Shadow */}
      <motion.div
        animate={
          isSuperHappy
            ? { scaleX: [1, 0.6, 1.1, 0.8, 1], opacity: [0.4, 0.15, 0.5, 0.3, 0.4] }
            : isRunning
            ? { x: [0, 80, -80, 0], opacity: [0.4, 0.2, 0.2, 0.4] }
            : isSleeping
            ? { scaleX: 0.9, opacity: 0.25 }
            : { scaleX: [1, 1.05, 1], opacity: [0.35, 0.45, 0.35] }
        }
        transition={{ repeat: isSleeping ? 0 : Infinity, duration: isRunning ? 1.6 : 2.2, ease: 'easeInOut' }}
        className="w-32 h-2.5 bg-[#18181B] rounded-full mt-1 filter blur-[2px] pointer-events-none"
      />

      {/* Helpful Hint Pill on Hover */}
      <AnimatePresence>
        {isHovered && !isSleeping && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-3 px-3 py-1 bg-[#FFFFFF] border border-[#E8E3D8] rounded-full text-[11px] font-sans font-medium text-[#71717A] shadow-sm flex items-center gap-2"
          >
            <span>⌨️ <strong className="text-[#18181B]">Space</strong> to run</span>
            <span>•</span>
            <span>👆 <strong className="text-[#18181B]">Double-click</strong> joy</span>
            <span>•</span>
            <span>🖐️ <strong className="text-[#18181B]">Drag up</strong> to feed</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
