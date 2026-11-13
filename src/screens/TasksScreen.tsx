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
  chassisMode?: boolean;
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
  chassisMode = false,
}) => {
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
          <CheckSquare size={16} className="text-[#C65A34]" />
          <h1 className="text-xs sm:text-sm font-bold text-[#18181B]">Companion Tasks & Habits</h1>
        </div>

        <div className="w-12 sm:w-16" /> {/* Balance spacer */}
      </div>

      {/* Task List Component */}
      <div className="w-full pb-2">
        <TaskList
          tasks={tasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          streakDays={streakDays}
          onTriggerReminder={onTriggerReminder}
          chassisMode={chassisMode}
        />
      </div>
    </motion.div>
  );
};
