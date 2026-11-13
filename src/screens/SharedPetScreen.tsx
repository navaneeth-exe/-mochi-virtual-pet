import React, { useState } from 'react';
import { ArrowLeft, Users, Copy, Check, Smartphone, KeyRound, Radio, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { RoomMember, EngineType } from '../core/sync/syncEngine';
import { MochiUser } from '../core/firebase/auth';
import { sound } from '../core/audio';

interface SharedPetScreenProps {
  pairingCode: string;
  onBack: () => void;
  onJoinRoom: (code: string) => Promise<void>;
  onCreateRoom?: (name: string) => Promise<string>;
  roomMembers?: RoomMember[];
  currentUser?: MochiUser;
  engineType?: EngineType;
}

export const SharedPetScreen: React.FC<SharedPetScreenProps> = ({
  pairingCode,
  onBack,
  onJoinRoom,
  roomMembers = [],
  currentUser,
  engineType = 'broadcast_channel',
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(pairingCode);
    setCopied(true);
    sound.playChirp();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().length >= 4) {
      setIsConnecting(true);
      try {
        await onJoinRoom(inputCode.trim().toUpperCase());
        sound.playVictory();
        setInputCode('');
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleOpenSimulatedSession = () => {
    sound.playChirp();
    window.open(window.location.href, '_blank', 'width=440,height=920');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col p-3.5 sm:p-5 lg:p-6 min-h-[580px] lg:min-h-[660px] bg-[#FAF8F5] space-y-4 w-full"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D8]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-xl text-xs font-semibold text-[#18181B] transition-all shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Pet Room</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Users size={16} className="text-[#C65A34]" />
          <h1 className="text-sm font-bold text-[#18181B]">Shared Pet Room & Co-Parenting</h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Responsive Grid: Single column on mobile, 2 columns on tablet/desktop (md:) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start flex-1 overflow-y-auto pr-1">
        {/* Left Column (md:col-span-6) */}
        <div className="md:col-span-6 space-y-4">
          {/* Backend Engine Status Card */}
          <div className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Radio
                  size={14}
                  className={
                    engineType === 'firebase'
                      ? 'text-[#2D6343] animate-pulse'
                      : 'text-[#C65A34]'
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#18181B]">Multi-Device Sync</p>
                <p className="text-[10px] text-[#71717A]">
                  {engineType === 'firebase'
                    ? 'Firebase Realtime WebSockets'
                    : 'Multi-Device Channel Sync'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F2EA] text-[#2D6343] border border-[#D0E4D4]">
              Live Sync Active
            </span>
          </div>

          {/* Room Code Card with One-Click Copy */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-sm text-center space-y-2.5">
            <span className="text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
              Your Pet's Room Code
            </span>

            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-widest text-[#18181B] bg-[#FAF8F5] px-4 py-1.5 rounded-xl border border-[#E8E3D8]">
                {pairingCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-3 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] rounded-xl transition-all shadow-xs"
                title="Copy code"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <p className="text-[11px] text-[#71717A] max-w-xs mx-auto">
              Share this 6-character code with a friend or family member to raise Mochi together in real time!
            </p>
          </div>

          {/* Local Test Window Launcher */}
          <button
            onClick={handleOpenSimulatedSession}
            className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-xl text-xs font-semibold text-[#52525B] hover:text-[#18181B] flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <ExternalLink size={14} />
            <span>Open Second Phone Window (Multi-Device Test)</span>
          </button>
        </div>

        {/* Right Column (md:col-span-6) */}
        <div className="md:col-span-6 space-y-4">
          {/* Join Another Room Form */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-sm space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
              <KeyRound size={14} className="text-[#C65A34]" />
              <span>Join Another Companion</span>
            </div>

            <form onSubmit={handleJoinSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. MCH-842"
                maxLength={7}
                className="flex-1 px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
              <button
                type="submit"
                disabled={isConnecting || inputCode.trim().length < 4}
                className="px-4 py-2 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-40 text-[#FFFFFF] text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
              >
                {isConnecting ? 'Joining...' : 'Join Room'}
              </button>
            </form>
          </div>

          {/* Connected Caretakers Roster */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <Smartphone size={14} className="text-[#407655]" />
                Active Caretakers ({roomMembers.length || 1})
              </span>
              <span className="text-[10px] text-[#71717A]">
                UID: {currentUser?.uid.slice(0, 8) || 'session'}
              </span>
            </div>

            <div className="space-y-1.5">
              {roomMembers.length > 0 ? (
                roomMembers.map((member, i) => (
                  <div
                    key={member.uid || i}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#407655]" />
                      <span className="font-medium text-[#18181B]">
                        {member.displayName || `Caretaker ${i + 1}`}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E8E3D8] text-[#71717A] capitalize font-medium">
                      {member.role || 'Caretaker'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#407655]" />
                    <span className="font-medium text-[#18181B]">You (Owner)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F2EA] border border-[#D0E4D4] text-[#2D6343] font-semibold">
                    Online
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
