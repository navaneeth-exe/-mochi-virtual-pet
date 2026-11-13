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
  chassisMode?: boolean;
}

export const SharedPetScreen: React.FC<SharedPetScreenProps> = ({
  pairingCode,
  onBack,
  onJoinRoom,
  roomMembers = [],
  currentUser,
  engineType = 'broadcast_channel',
  chassisMode = false,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col p-3.5 sm:p-5 lg:p-6 bg-[#FAF8F5] space-y-4 w-full"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D8] select-none">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-xl text-xs font-semibold text-[#18181B] transition-all shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Pet Room</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Users size={16} className="text-[#C65A34]" />
          <h1 className="text-xs sm:text-sm font-bold text-[#18181B]">Shared Pet Room & Co-Parenting</h1>
        </div>

        <div className="w-12 sm:w-16" />
      </div>

      {/* Responsive Grid: Single column in chassis / mobile, 2 columns on desktop */}
      <div
        className={`w-full gap-5 items-start ${
          chassisMode ? 'flex flex-col space-y-4' : 'grid grid-cols-1 md:grid-cols-12'
        }`}
      >
        {/* Left Column / Primary Room Card */}
        <div className={`space-y-4 w-full ${!chassisMode ? 'md:col-span-6' : ''}`}>
          {/* Backend Engine Status Card */}
          <div className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2">
              <Radio
                size={14}
                className={
                  engineType === 'firebase'
                    ? 'text-[#2D6343] animate-pulse'
                    : 'text-[#C65A34]'
                }
              />
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

          {/* Room Code Card with 1-Click Copy */}
          <div className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs text-center space-y-3">
            <span className="text-[10px] font-bold text-[#71717A] tracking-wider uppercase">
              Your Companion's Pairing Code
            </span>

            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-widest text-[#18181B] bg-[#FAF8F5] px-4 py-1.5 rounded-xl border border-[#E8E3D8] shadow-inner">
                {pairingCode}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-3 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] rounded-xl transition-all shadow-xs"
                title="Copy Room Code"
              >
                {copied ? <Check size={18} className="text-[#4ADE80]" /> : <Copy size={18} />}
              </button>
            </div>

            <p className="text-xs text-[#71717A] max-w-xs mx-auto leading-relaxed">
              Share this 6-character code with a friend or family member to co-parent Mochi together in real time!
            </p>
          </div>

          {/* Local Test Window Launcher */}
          <button
            type="button"
            onClick={handleOpenSimulatedSession}
            className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-xl text-xs font-semibold text-[#52525B] hover:text-[#18181B] flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <ExternalLink size={14} />
            <span>Open Second Phone Window (Multi-Device Test)</span>
          </button>
        </div>

        {/* Right Column / Join Form & Roster */}
        <div className={`space-y-4 w-full ${!chassisMode ? 'md:col-span-6' : ''}`}>
          {/* Join Another Room Form */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
              <KeyRound size={14} className="text-[#C65A34]" />
              <span>Join Another Companion Room</span>
            </div>

            <form onSubmit={handleJoinSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. MCH-842"
                maxLength={7}
                className="flex-1 px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-[#18181B] focus:outline-none focus:border-[#18181B] min-w-0"
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
          <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <Smartphone size={14} className="text-[#407655]" />
                Active Caretakers ({roomMembers.length || 1})
              </span>
              <span className="text-[10px] font-mono text-[#71717A] truncate max-w-[120px]">
                UID: {currentUser?.uid ? `${currentUser.uid.slice(0, 8)}...` : 'anon_guest'}
              </span>
            </div>

            <div className="space-y-1.5">
              {roomMembers.length > 0 ? (
                roomMembers.map((member) => (
                  <div
                    key={member.uid}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-[#407655] animate-pulse shrink-0" />
                      <span className="font-semibold text-[#18181B] truncate">{member.displayName}</span>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3EFE6] text-[#52525B]">
                      {member.role === 'owner' ? 'Owner' : 'Caretaker'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#407655] shrink-0" />
                    <span className="font-semibold text-[#18181B] truncate">You (Host Caretaker)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F2EA] text-[#2D6343]">
                    Owner
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
