import React from 'react';
import { ArrowLeft, CheckSquare } from 'lucide-react';
import { TaskItem } from '../types/pet';
import { TaskList } from '../components/tasks/TaskList';
import { motion } from 'motion/react';

interface TasksScreenProps {
  tasks: TaskItem[];
  onAddTask: (title: string) => boolean;
  onEditTask: (id: string, newTitle: string) => boolean;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onBack: () => void;
  streakDays?: number;
  onTriggerReminder?: () => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onToggleTask,
  onDeleteTask,
  onBack,
  streakDays = 3,
  onTriggerReminder,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col p-4 sm:p-5 min-h-[560px] bg-[#FAF8F5] space-y-4"
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
          <CheckSquare size={16} className="text-[#C65A34]" />
          <h1 className="text-sm font-bold text-[#18181B]">Companion Tasks</h1>
        </div>

        <div className="w-16" /> {/* Balance spacer */}
      </div>

      {/* Task List Component */}
      <div className="flex-1 pb-4">
        <TaskList
          tasks={tasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          streakDays={streakDays}
          onTriggerReminder={onTriggerReminder}
        />
      </div>
    </motion.div>
  );
};
