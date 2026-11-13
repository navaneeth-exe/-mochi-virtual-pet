import React from 'react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="retro-card px-4 py-2 bg-[#111111] text-[#FFFFFF] text-xs font-bold shadow-lg flex items-center gap-2 border-2 border-[#FFFFFF]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FFFFFF] animate-ping" />
        <span>{message}</span>
      </div>
    </div>
  );
};

