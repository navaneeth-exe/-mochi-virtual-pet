import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TaskItem } from '../types/pet';
import { TaskList } from '../components/tasks/TaskList';
import { Button } from '../components/common/Button';

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
  onTriggerReminder
}) => {
  return (
    <div className="flex flex-col p-4 min-h-[520px] bg-[#EDECE6] space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]">
        <Button variant="light" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
          Pet Room
        </Button>
        <h1 className="text-xs font-pixel font-bold uppercase tracking-wider text-[#111111]">
          Companion Tasks
        </h1>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Task List Component */}
      <div className="flex-1">
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
    </div>
  );
};
