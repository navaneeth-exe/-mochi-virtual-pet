import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-between p-6 min-h-[520px] text-center bg-[#EDECE6]">
      {/* Top Header */}
      <div className="space-y-1.5 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border-2 border-[#111111] rounded-full text-[10px] font-mono font-bold text-[#111111] shadow-[2px_2px_0px_#111111]">
          <Sparkles size={12} />
          <span>VIRTUAL PET COMPANION</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-pixel tracking-wider text-[#111111] pt-1">
          MOCHI
        </h1>
        <p className="text-xs font-mono text-[#4B5563]">
          Your retro pocket companion from inside a microchip.
        </p>
      </div>

      {/* Center Character Hero Preview */}
      <div className="relative my-4 flex flex-col items-center">
        <div className="w-36 h-36 sm:w-44 sm:h-44 relative animate-idle">
          <img
            src="/assets/mochi/mochi-happy.png"
            alt="Mochi Mascot"
            className="w-full h-full object-contain pixelated filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
        <div className="w-28 h-2.5 bg-[#D4D4CE] rounded-full mt-1 opacity-70 filter blur-[1px]" />
        
        {/* Story Snippet Card */}
        <div className="mt-4 p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] max-w-xs text-left">
          <p className="text-[11px] font-mono text-[#111111] leading-relaxed italic">
            "He came to me from inside a chip. Hover and press Space to run, double-tap for happiness,
            and feed him at the top of the window!"
          </p>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-xs space-y-3 pb-2">
        <Button
          variant="dark"
          size="lg"
          onClick={onStart}
          icon={<ArrowRight size={16} />}
          className="w-full text-xs font-pixel py-3 shadow-[3px_3px_0px_rgba(0,0,0,0.4)]"
        >
          ENTER MOCHI'S ROOM
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#4B5563]">
          <ShieldCheck size={13} />
          <span>PWA Ready • Multi-Phone Co-Parenting</span>
        </div>
      </div>
    </div>
  );
};

