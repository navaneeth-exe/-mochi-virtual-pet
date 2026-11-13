import React, { useState } from 'react';
import { ArrowLeft, Users, Copy, Check, Smartphone, KeyRound, Radio, ExternalLink, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { RoomMember, EngineType } from '../core/sync/syncEngine';
import { MochiUser } from '../core/firebase/auth';

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
  onCreateRoom,
  roomMembers = [],
  currentUser,
  engineType = 'broadcast_channel'
}) => {
  const [inputCode, setInputCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().length >= 4) {
      setIsConnecting(true);
      try {
        await onJoinRoom(inputCode.trim().toUpperCase());
        setInputCode('');
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && onCreateRoom) {
      try {
        await onCreateRoom(newRoomName.trim());
        setIsCreating(false);
        setNewRoomName('');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleOpenSimulatedSession = () => {
    window.open(window.location.href, '_blank', 'width=440,height=920');
  };

  return (
    <div className="flex flex-col p-4 min-h-[520px] bg-[#EDECE6] space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]">
        <Button variant="light" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
          Pet Room
        </Button>
        <h1 className="text-xs font-pixel font-bold uppercase tracking-wider text-[#111111]">
          Co-Parent Room
        </h1>
        <div className="w-16" />
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {/* Connection Engine Status Pill */}
        <div className="flex items-center justify-between p-2 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] text-[10px] font-mono">
          <div className="flex items-center gap-1.5 font-bold">
            <Radio size={12} className={engineType === 'firebase' ? 'text-green-600 animate-pulse' : 'text-amber-600'} />
            <span>Backend Engine:</span>
          </div>
          <span className={`px-2 py-0.5 rounded font-bold ${
            engineType === 'firebase'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {engineType === 'firebase' ? 'Firebase Realtime DB (Live)' : 'Multi-Device Broadcast (Local)'}
          </span>
        </div>

        {/* Current Pet Sharing Code */}
        <div className="p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] text-center space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#4B5563]">
            Active Pet Pairing Code
          </div>
          <div className="text-2xl font-mono font-black tracking-widest text-[#111111] bg-[#EDECE6] py-1.5 px-4 border border-[#111111] rounded inline-block">
            {pairingCode}
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              variant="dark"
              size="sm"
              onClick={handleCopy}
              icon={copied ? <Check size={13} /> : <Copy size={13} />}
            >
              {copied ? 'Code Copied!' : 'Copy Code'}
            </Button>
            {onCreateRoom && (
              <Button
                variant="light"
                size="sm"
                onClick={() => setIsCreating(!isCreating)}
                icon={<Plus size={13} />}
              >
                New Pet
              </Button>
            )}
          </div>
        </div>

        {/* Create Room Form (Collapsible) */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] space-y-2 animate-fade-in">
            <div className="text-xs font-mono font-bold text-[#111111]">
              Create New Shared Pet Instance
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Pet Name (e.g. Mochi)..."
                maxLength={20}
                className="flex-1 px-3 py-1.5 text-xs font-mono border-2 border-[#111111] rounded bg-[#EDECE6] text-[#111111] focus:outline-none"
              />
              <Button variant="dark" size="sm" type="submit">
                Create
              </Button>
            </div>
          </form>
        )}

        {/* Join Other Pet Form */}
        <form onSubmit={handleJoinSubmit} className="p-3 bg-[#FFFFFF] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111] space-y-2">
          <div className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
            <KeyRound size={13} />
            Connect to Co-Caretaker's Room
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. MCH-842"
              maxLength={8}
              className="flex-1 px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 border-[#111111] rounded bg-[#EDECE6] text-[#111111] focus:outline-none"
            />
            <Button variant="dark" size="sm" type="submit" disabled={isConnecting}>
              {isConnecting ? 'Joining...' : 'Connect'}
            </Button>
          </div>
        </form>

        {/* Connected Caretakers List */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase text-[#111111] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              Connected Caretakers ({roomMembers.length || 1})
            </span>
            <button
              onClick={handleOpenSimulatedSession}
              className="flex items-center gap-1 text-[10px] text-[#4B5563] hover:text-[#111111] underline"
              title="Open linked second phone window"
            >
              <ExternalLink size={10} />
              Open 2nd Phone
            </button>
          </div>

          <div className="space-y-1.5">
            {roomMembers.length === 0 ? (
              <div className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#111111] rounded text-xs font-mono">
                <span className="flex items-center gap-2">
                  <Smartphone size={14} />
                  {currentUser?.displayName || 'Phone A (You)'}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#111111] text-[#FFFFFF] rounded">
                  Owner
                </span>
              </div>
            ) : (
              roomMembers.map((member) => (
                <div
                  key={member.uid}
                  className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#111111] rounded text-xs font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Smartphone size={14} />
                    <span>{member.displayName}</span>
                    {member.uid === currentUser?.uid && (
                      <span className="text-[9px] text-[#4B5563]">(You)</span>
                    )}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    member.role === 'owner'
                      ? 'bg-[#111111] text-[#FFFFFF]'
                      : 'bg-[#EDECE6] border border-[#111111] text-[#111111]'
                  }`}>
                    {member.role === 'owner' ? 'Owner' : 'Caretaker'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
