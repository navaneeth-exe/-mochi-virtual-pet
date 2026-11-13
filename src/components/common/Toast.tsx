import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#18181B] text-[#FFFFFF] rounded-full text-xs font-semibold shadow-xl border border-[#3F3F46]"
          >
            <Sparkles size={13} className="text-[#C65A34]" />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
