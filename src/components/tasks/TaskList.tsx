import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, Flame, Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem } from '../../types/pet';
import { TaskCard } from './TaskCard';
import { sound } from '../../core/audio';

interface TaskListProps {
  tasks: TaskItem[];
  onAddTask: (title: string) => boolean;
  onEditTask: (id: string, newTitle: string) => boolean;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  streakDays?: number;
  onTriggerReminder?: () => void;
  chassisMode?: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onToggleTask,
  onDeleteTask,
  streakDays = 3,
  onTriggerReminder,
  chassisMode = false,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setErrorMessage('Please write a task description!');
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
      sound.playChirp();
      setNewTitle('');
    }
  };

  const quickSuggestions = [
    'Drink water',
    'Walk 10 mins',
    'Stretch & breathe',
    'Read 5 pages',
    'Write thoughts',
  ];

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
    <div
      className={`w-full gap-5 items-start ${
        chassisMode ? 'flex flex-col space-y-4' : 'grid grid-cols-1 md:grid-cols-12'
      }`}
    >
      {/* Left Column on Desktop / Top Section on Mobile: Goals, Add Form, Filters */}
      <div className={`space-y-4 w-full ${!chassisMode ? 'md:col-span-5' : ''}`}>
        {/* Progress & Streak Card */}
        <div className="p-3.5 sm:p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#E8F2EA] rounded-xl text-[#2D6343]">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#18181B]">Daily Goals</h3>
                <p className="text-[10px] text-[#71717A]">Complete tasks to nourish Mochi</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FDF0EB] border border-[#F6DACF] rounded-full text-xs font-bold text-[#C65A34]">
              <Flame size={13} className="fill-[#C65A34]" />
              <span>{streakDays}d Streak</span>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#71717A]">
              <span>{completedCount} of {tasks.length} completed</span>
              <span className="font-mono font-bold text-[#18181B]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F3EFE6] rounded-full overflow-hidden p-0.5 border border-[#E8E3D8]">
              <motion.div
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="h-full bg-[#407655] rounded-full"
              />
            </div>
          </div>

          {/* Companion Benefit Note */}
          <div className="flex items-center justify-between pt-1 border-t border-[#F3EFE6] text-[10px] text-[#71717A]">
            <span className="flex items-center gap-1 text-[#C65A34] font-semibold">
              <Sparkles size={11} />
              +1 Berry & +15 Joy per goal
            </span>
            {onTriggerReminder && (
              <button
                type="button"
                onClick={onTriggerReminder}
                className="flex items-center gap-1 text-[#18181B] hover:text-[#C65A34] font-semibold transition-colors"
              >
                <Bell size={11} />
                <span>Remind</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs focus-within:border-[#18181B] focus-within:shadow-sm transition-all">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Add a new goal or habit..."
              className="flex-1 px-3 py-1 text-xs sm:text-sm bg-transparent text-[#18181B] placeholder-[#A1A1AA] focus:outline-none min-w-0"
              maxLength={80}
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          {errorMessage && (
            <p className="text-[11px] text-[#DC2626] font-medium px-2">{errorMessage}</p>
          )}

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 select-none">
            <span className="text-[10px] text-[#71717A] py-0.5 shrink-0">Quick add:</span>
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  onAddTask(suggestion);
                  sound.playChirp();
                }}
                className="text-[10px] px-2.5 py-0.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-[#52525B] font-medium transition-colors shrink-0"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between pt-1 select-none">
          <div className="flex items-center gap-1 bg-[#F3EFE6] p-1 rounded-xl">
            {(['all', 'active', 'completed'] as FilterType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  sound.playChirp();
                  setFilter(tab);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                  filter === tab
                    ? 'bg-[#FFFFFF] text-[#18181B] shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#71717A] font-medium">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      {/* Right Column on Desktop / Lower Section on Mobile: Tasks List Container */}
      <div className={`space-y-2.5 w-full ${!chassisMode ? 'md:col-span-7' : ''}`}>
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 text-center bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-xs space-y-2"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F2EA] flex items-center justify-center text-[#2D6343]">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#18181B]">
                {filter === 'completed' ? 'No completed tasks yet!' : 'All daily goals caught up!'}
              </h4>
              <p className="text-xs text-[#71717A] max-w-xs mx-auto">
                {filter === 'completed'
                  ? 'Complete your habits to nourish Mochi and earn berries.'
                  : 'Add a new habit above or take a well-deserved rest with Mochi.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
