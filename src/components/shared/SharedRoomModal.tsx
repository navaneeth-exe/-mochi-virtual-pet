import React, { useState } from 'react';
import { Users, Copy, Check, Smartphone, Radio, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RoomMember, EngineType } from '../../core/sync/syncEngine';

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
  onJoinRoom
}) => {
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length >= 4 && onJoinRoom) {
      setIsJoining(true);
      try {
        await onJoinRoom(joinCode.trim().toUpperCase());
        setJoinCode('');
        onClose();
      } finally {
        setIsJoining(false);
      }
    }
  };

  const handleOpenSecondPhone = () => {
    window.open(window.location.href, '_blank', 'width=440,height=920');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Co-Parent Mochi (Shared Pet)">
      <div className="space-y-3.5">
        {/* Backend Indicator */}
        <div className="flex items-center justify-between p-2 bg-[#EDECE6] border border-[#111111] rounded text-[10px] font-mono">
          <span className="flex items-center gap-1 font-bold">
            <Radio size={12} className={engineType === 'firebase' ? 'text-green-600 animate-pulse' : 'text-amber-600'} />
            Realtime Sync Engine:
          </span>
          <span className="font-bold">
            {engineType === 'firebase' ? 'Firebase Realtime DB' : 'Multi-Device Broadcast (Local)'}
          </span>
        </div>

        {/* Pairing Code Display Box */}
        <div className="p-3 bg-[#EDECE6] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] text-center space-y-1.5">
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#4B5563]">
            Active Pet Pairing Code
          </div>
          <div className="text-2xl font-mono font-black tracking-widest text-[#111111] bg-[#FFFFFF] py-1 px-4 border border-[#111111] rounded inline-block">
            {pairingCode}
          </div>
          <div>
            <Button
              variant="dark"
              size="sm"
              onClick={handleCopy}
              icon={copied ? <Check size={13} /> : <Copy size={13} />}
              className="mt-1"
            >
              {copied ? 'Code Copied!' : 'Copy Code'}
            </Button>
          </div>
        </div>

        {/* Connect to Another Room */}
        {onJoinRoom && (
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Join room (e.g. MCH-842)..."
              maxLength={8}
              className="flex-1 px-2.5 py-1 text-xs font-mono font-bold uppercase border border-[#111111] rounded bg-[#FFFFFF] text-[#111111]"
            />
            <Button variant="dark" size="sm" type="submit" disabled={isJoining}>
              {isJoining ? '...' : 'Join'}
            </Button>
          </form>
        )}

        {/* Caretakers List */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#111111] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              Room Members ({roomMembers.length || 1})
            </span>
            <button
              onClick={handleOpenSecondPhone}
              className="flex items-center gap-1 text-[10px] text-[#4B5563] hover:text-[#111111] underline"
            >
              <ExternalLink size={10} />
              Open 2nd Phone
            </button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {roomMembers.length === 0 ? (
              <div className="flex items-center justify-between p-2 bg-[#FFFFFF] border border-[#111111] rounded text-xs font-mono">
                <span className="flex items-center gap-2">
                  <Smartphone size={14} />
                  You (This Device)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#111111] text-[#FFFFFF] rounded">
                  Owner
                </span>
              </div>
            ) : (
              roomMembers.map((m) => (
                <div key={m.uid} className="flex items-center justify-between p-2 bg-[#FFFFFF] border border-[#111111] rounded text-xs font-mono">
                  <span className="flex items-center gap-2">
                    <Smartphone size={14} />
                    {m.displayName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#111111] text-[#FFFFFF] rounded">
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
