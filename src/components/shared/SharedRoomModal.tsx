import React, { useState } from 'react';
import { Users, Copy, Check, Smartphone, Radio, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';
import { RoomMember, EngineType } from '../../core/sync/syncEngine';
import { sound } from '../../core/audio';

interface SharedRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairingCode: string;
  roomMembers?: RoomMember[];
  engineType?: EngineType;
  onJoinRoom?: (code: string) => Promise<void>;
}

export const SharedRoomModal: React.FC<SharedRoomModalProps> = ({
  isOpen,
  onClose,
  pairingCode,
  roomMembers = [],
  engineType = 'broadcast_channel',
  onJoinRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(pairingCode);
    setCopied(true);
    sound.playChirp();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length >= 4 && onJoinRoom) {
      setIsJoining(true);
      try {
        await onJoinRoom(joinCode.trim().toUpperCase());
        sound.playVictory();
        setJoinCode('');
        onClose();
      } finally {
        setIsJoining(false);
      }
    }
  };

  const handleOpenSecondPhone = () => {
    sound.playChirp();
    window.open(window.location.href, '_blank', 'width=440,height=920');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Co-Parent Mochi (Shared Pet)">
      <div className="space-y-3.5">
        {/* Backend Indicator */}
        <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-[#18181B]">
            <Radio
              size={13}
              className={engineType === 'firebase' ? 'text-[#2D6343] animate-pulse' : 'text-[#C65A34]'}
            />
            <span>Sync Engine:</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F2EA] text-[#2D6343] border border-[#D0E4D4]">
            {engineType === 'firebase' ? 'Firebase Realtime WebSockets' : 'Local Channel Sync'}
          </span>
        </div>

        {/* Pairing Code Display Box */}
        <div className="p-4 bg-[#FAF8F5] border border-[#E8E3D8] rounded-2xl text-center space-y-2">
          <div className="text-[11px] uppercase font-bold tracking-wider text-[#71717A]">
            Active Pet Pairing Code
          </div>
          <div className="text-2xl font-mono font-extrabold tracking-widest text-[#18181B] bg-[#FFFFFF] py-1.5 px-4 border border-[#E8E3D8] rounded-xl inline-block shadow-xs">
            {pairingCode}
          </div>
          <div>
            <button
              onClick={handleCopy}
              className="mt-1 px-4 py-2 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 mx-auto transition-all shadow-xs"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Code Copied!' : 'Copy Room Code'}</span>
            </button>
          </div>
        </div>

        {/* Connect to Another Room */}
        {onJoinRoom && (
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-char code (e.g. MCH-842)..."
              maxLength={8}
              className="flex-1 px-3 py-2 text-xs font-mono font-bold uppercase border border-[#E8E3D8] rounded-xl bg-[#FAF8F5] text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
            <button
              type="submit"
              disabled={isJoining || joinCode.trim().length < 4}
              className="px-4 py-2 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-40 text-[#FFFFFF] text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              {isJoining ? '...' : 'Join'}
            </button>
          </form>
        )}

        {/* Caretakers List */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#18181B] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-[#C65A34]" />
              <span>Room Members ({roomMembers.length || 1})</span>
            </span>
            <button
              onClick={handleOpenSecondPhone}
              className="flex items-center gap-1 text-[11px] text-[#52525B] hover:text-[#18181B] font-medium"
            >
              <ExternalLink size={11} />
              <span>Open 2nd Phone</span>
            </button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {roomMembers.length === 0 ? (
              <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-xs">
                <span className="flex items-center gap-2 font-medium text-[#18181B]">
                  <Smartphone size={13} className="text-[#407655]" />
                  You (This Device)
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#E8F2EA] border border-[#D0E4D4] text-[#2D6343] font-bold rounded-full">
                  Owner
                </span>
              </div>
            ) : (
              roomMembers.map((m) => (
                <div
                  key={m.uid}
                  className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#E8E3D8] rounded-xl text-xs"
                >
                  <span className="flex items-center gap-2 font-medium text-[#18181B]">
                    <Smartphone size={13} className="text-[#407655]" />
                    {m.displayName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#FAF8F5] border border-[#E8E3D8] text-[#52525B] font-semibold rounded-full capitalize">
                    {m.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
