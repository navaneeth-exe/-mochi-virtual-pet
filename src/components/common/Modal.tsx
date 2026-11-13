import React from 'react';
import { X } from 'lucide-react';
import { sound } from '../../core/audio';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sound.playChirp();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="retro-card w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden bg-[#FFFFFF] animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#111111] bg-[#EDECE6]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-[#111111] hover:bg-[#D4D4CE] rounded border border-transparent hover:border-[#111111] transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-[#111111]">
          {children}
        </div>
      </div>
    </div>
  );
};

