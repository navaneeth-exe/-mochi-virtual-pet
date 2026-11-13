import React, { useState } from 'react';
import { Check, Trash2, Edit2, X } from 'lucide-react';
import { TaskItem } from '../../types/pet';
import { sound } from '../../core/audio';

interface TaskCardProps {
  task: TaskItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggle = () => {
    if (isEditing) return;
    sound.playVictory();
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
    <div
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          handleToggle();
        }
      }}
      role="checkbox"
      aria-checked={task.isCompleted}
      tabIndex={isEditing ? -1 : 0}
      aria-label={`Task: ${task.title}, ${task.isCompleted ? 'completed' : 'not completed'}`}
      className={`group flex items-center justify-between p-3 border-2 border-[#111111] rounded-lg transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#111111] ${
        task.isCompleted
          ? 'bg-[#EDECE6] border-dashed opacity-75'
          : 'bg-[#FFFFFF] shadow-[2px_2px_0px_#111111] hover:translate-x-0.5'
      } ${isEditing ? 'ring-2 ring-[#111111]' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        {/* Checkbox square */}
        <div
          className={`w-5 h-5 rounded border-2 border-[#111111] flex items-center justify-center shrink-0 transition-colors ${
            task.isCompleted ? 'bg-[#111111] text-[#FFFFFF]' : 'bg-[#FFFFFF]'
          }`}
        >
          {task.isCompleted && <Check size={12} strokeWidth={3} />}
        </div>

        {/* Task Title or Edit Input */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-2 py-0.5 text-xs font-mono border border-[#111111] rounded bg-[#FFFFFF] text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
              autoFocus
              maxLength={80}
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-1 bg-[#111111] text-[#FFFFFF] rounded hover:opacity-80 transition-opacity"
              title="Save"
            >
              <Check size={12} />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 bg-[#EDECE6] border border-[#111111] rounded hover:bg-[#D4D4CE] transition-colors"
              title="Cancel"
            >
              <X size={12} />
            </button>
          </form>
        ) : (
          <span
            className={`text-xs font-mono font-medium truncate ${
              task.isCompleted ? 'line-through text-[#4B5563]' : 'text-[#111111]'
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Berry reward badge */}
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#EDECE6] border border-[#111111] rounded text-[#111111]">
            +{task.rewardBerries} 🍓
          </span>

          {/* Edit action */}
          <button
            onClick={handleStartEdit}
            className="p-1 text-[#4B5563] hover:text-[#111111] hover:bg-[#D4D4CE] rounded transition-colors opacity-70 group-hover:opacity-100"
            title="Edit task"
          >
            <Edit2 size={13} />
          </button>

          {/* Delete action */}
          <button
            onClick={handleDelete}
            className="p-1 text-[#4B5563] hover:text-[#E11D48] hover:bg-[#FEE2E2] rounded transition-colors opacity-70 group-hover:opacity-100"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
