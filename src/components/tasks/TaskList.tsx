import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, Flame, Bell, Sparkles } from 'lucide-react';
import { TaskItem } from '../../types/pet';
import { TaskCard } from './TaskCard';
import { Button } from '../common/Button';

interface TaskListProps {
  tasks: TaskItem[];
  onAddTask: (title: string) => boolean;
  onEditTask: (id: string, newTitle: string) => boolean;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  streakDays?: number;
  onTriggerReminder?: () => void;
}

type FilterType = 'all' | 'active' | 'completed';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onToggleTask,
  onDeleteTask,
  streakDays = 3,
  onTriggerReminder
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setErrorMessage('Task description cannot be empty!');
      return;
    }
    const isDup = tasks.some((t) => t.title.toLowerCase() === trimmed.toLowerCase());
    if (isDup) {
      setErrorMessage('A task with this title already exists!');
      return;
    }

    setErrorMessage(null);
    const success = onAddTask(trimmed);
    if (success) {
      setNewTitle('');
    }
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.isCompleted);
      case 'completed':
        return tasks.filter((t) => t.isCompleted);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className="space-y-3.5">
      {/* Progress & Streak Header */}
      <div className="p-3 bg-[#EDECE6] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111]">
        <div className="flex items-center justify-between text-xs font-bold text-[#111111] mb-1.5 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Today's Progress
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#111111] rounded text-[10px] font-mono text-[#D97706]">
              <Flame size={12} className="fill-[#D97706]" />
              {streakDays}d Streak
            </span>
            <span>{completedCount} / {tasks.length} ({progressPercent}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#FFFFFF] border border-[#111111] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#111111] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D4D4CE] text-[10px] text-[#4B5563] font-mono">
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-[#111111]" />
            Each task awards +1 berry 🍓
          </span>
          {onTriggerReminder && (
            <button
              onClick={onTriggerReminder}
              className="flex items-center gap-1 text-[#111111] hover:underline font-bold"
              title="Send a gentle reminder"
            >
              <Bell size={11} />
              Nudge Mochi
            </button>
          )}
        </div>
      </div>

      {/* Add Task Form with Validation */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="New daily task (e.g. read 10 mins)..."
            className="flex-1 px-3 py-2 text-xs font-mono border-2 border-[#111111] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#111111] bg-[#FFFFFF] text-[#111111] shadow-[2px_2px_0px_#111111]"
            maxLength={80}
          />
          <Button variant="dark" size="sm" type="submit" icon={<Plus size={14} />}>
            Add
          </Button>
        </div>
        {errorMessage && (
          <span className="text-[10px] text-[#E11D48] font-mono px-1">
            ⚠️ {errorMessage}
          </span>
        )}
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 text-[11px] font-mono border-b border-[#D4D4CE] pb-1">
        {(['all', 'active', 'completed'] as FilterType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
              filter === tab
                ? 'bg-[#111111] text-[#FFFFFF] shadow-[1px_1px_0px_#111111]'
                : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#EDECE6]'
            }`}
          >
            {tab} {tab === 'all' ? `(${tasks.length})` : tab === 'active' ? `(${tasks.length - completedCount})` : `(${completedCount})`}
          </button>
        ))}
      </div>

      {/* Task List Items */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-[#4B5563] font-mono text-xs border-2 border-dashed border-[#D4D4CE] rounded-lg">
            {filter === 'completed'
              ? 'No completed tasks yet. Cross off a task to earn berries! 🍓'
              : filter === 'active'
              ? "All active tasks done! Mochi is proud of you! ✨"
              : 'No tasks scheduled. Add your first goal above! 🍃'}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
