import React, { useState } from 'react';
import { Check, Trash2, Edit2, X, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { TaskItem } from '../../types/pet';
import { sound } from '../../core/audio';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: TaskItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggle = (e: React.MouseEvent) => {
    if (isEditing) return;
    sound.playVictory();

    // If task was not completed, burst confetti!
    if (!task.isCompleted) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ['#407655', '#D46E4A', '#6B5696', '#C28B14'],
        disableForReducedMotion: true,
      });
    }

    onToggle(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playChirp();
    onDelete(task.id);
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleSaveEdit = (e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onEdit(task.id, editTitle.trim());
      setIsEditing(false);
      sound.playChirp();
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(task.title);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={task.isCompleted}
      tabIndex={isEditing ? -1 : 0}
      aria-label={`Task: ${task.title}, ${task.isCompleted ? 'completed' : 'not completed'}`}
      className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all select-none ${
        task.isCompleted
          ? 'bg-[#F4F1EA]/80 border-[#E5E0D5] opacity-75'
          : 'bg-[#FFFFFF] border-[#E8E3D8] shadow-xs hover:border-[#D4CEBF] hover:shadow-sm'
      } ${isEditing ? 'ring-2 ring-[#18181B]' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        {/* Animated Checkbox */}
        <motion.div
          whileTap={{ scale: 0.85 }}
          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
            task.isCompleted
              ? 'bg-[#407655] border-[#407655] text-[#FFFFFF]'
              : 'bg-[#FFFFFF] border-[#D4CEBF] group-hover:border-[#18181B]'
          }`}
        >
          {task.isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Check size={13} strokeWidth={3} />
            </motion.div>
          )}
        </motion.div>

        {/* Task Title or Edit Form */}
        {isEditing ? (
          <form
            onSubmit={handleSaveEdit}
            className="flex-1 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-2.5 py-1 text-xs font-sans border border-[#18181B] rounded-lg bg-[#FFFFFF] text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
              autoFocus
              maxLength={80}
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-1.5 bg-[#18181B] text-[#FFFFFF] rounded-lg hover:opacity-90 transition-opacity"
              title="Save"
            >
              <Check size={12} />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1.5 bg-[#F3EFE6] text-[#71717A] rounded-lg hover:bg-[#E8E3D8] transition-colors"
              title="Cancel"
            >
              <X size={12} />
            </button>
          </form>
        ) : (
          <div className="flex flex-col min-w-0">
            <span
              className={`text-xs sm:text-sm font-medium transition-all truncate ${
                task.isCompleted
                  ? 'line-through text-[#8E8E93]'
                  : 'text-[#18181B]'
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[#A1A1AA] flex items-center gap-0.5">
                <Sparkles size={10} className="text-[#C65A34]" />
                +1 berry & +15 joy
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (Edit / Delete) */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleStartEdit}
            className="p-1.5 text-[#A1A1AA] hover:text-[#18181B] hover:bg-[#F3EFE6] rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-[#A1A1AA] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </motion.div>
  );
};
