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

  const quickSuggestions = ['Drink a glass of water', 'Walk for 10 minutes', 'Stretch & breathe', 'Read 5 pages'];

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
    <div className="space-y-4">
      {/* Progress & Streak Card */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl shadow-sm space-y-3">
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
          <span className="flex items-center gap-1 text-[#C65A34] font-medium">
            <Sparkles size={11} />
            +1 Berry & +15 Pet Joy per goal
          </span>
          {onTriggerReminder && (
            <button
              onClick={onTriggerReminder}
              className="flex items-center gap-1 text-[#18181B] hover:text-[#C65A34] font-semibold transition-colors"
            >
              <Bell size={11} />
              <span>Remind Me</span>
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
            className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-transparent text-[#18181B] placeholder-[#A1A1AA] focus:outline-none"
            maxLength={80}
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-2 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>

        {errorMessage && (
          <p className="text-[11px] text-[#DC2626] font-medium px-2">{errorMessage}</p>
        )}

        {/* Quick Suggestion Chips */}
        {tasks.length < 3 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-[#71717A] py-0.5">Quick add:</span>
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  onAddTask(suggestion);
                  sound.playChirp();
                }}
                className="text-[10px] px-2 py-0.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E3D8] rounded-full text-[#52525B] transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1 bg-[#F3EFE6] p-1 rounded-xl">
          {(['all', 'active', 'completed'] as FilterType[]).map((tab) => (
            <button
              key={tab}
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

        <span className="text-[11px] text-[#71717A]">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Tasks List Container */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center p-6 bg-[#FFFFFF] border border-[#E8E3D8] rounded-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-2xl mb-2">
                🌱
              </div>
              <h4 className="text-xs font-bold text-[#18181B]">
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'All tasks done for now!'
                  : 'No tasks added yet'}
              </h4>
              <p className="text-[11px] text-[#71717A] max-w-xs mt-1">
                Add a small goal to earn delicious berries for Mochi.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
