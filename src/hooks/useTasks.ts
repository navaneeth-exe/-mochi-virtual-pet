/**
 * useTasks.ts
 * Centralized React hook managing Companion Tasks,
 * daily progress calculation, edit functionality, validation, and local persistence.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TaskItem } from '../types/pet';
import { loadTasks, saveTasks } from '../core/storage';
import { sendNotification } from '../core/notifications';

export const useTasks = (
  onTaskCompletedReward?: (amount: number) => void,
  showToast?: (msg: string) => void
) => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  const [streakDays] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('mochi_streak_v1');
      return raw ? parseInt(raw, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Auto-persist tasks on change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Derived progress statistics
  const { completedCount, totalCount, pendingCount, progressPercent } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      completedCount: completed,
      totalCount: total,
      pendingCount: pending,
      progressPercent: percent
    };
  }, [tasks]);

  /**
   * Add a new task with validation against empty text and duplicates.
   */
  const addTask = useCallback((title: string): boolean => {
    const trimmed = title.trim();
    if (!trimmed) {
      if (showToast) showToast('Task description cannot be empty!');
      return false;
    }

    const isDuplicate = tasks.some(
      (t) => t.title.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      if (showToast) showToast('A task with this title already exists!');
      return false;
    }

    const newTask: TaskItem = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: trimmed,
      isCompleted: false,
      createdAt: Date.now(),
      rewardBerries: 1
    };

    setTasks((prev) => [newTask, ...prev]);
    if (showToast) showToast(`Added task: "${trimmed}"`);
    return true;
  }, [tasks, showToast]);

  /**
   * Edit an existing task's title.
   */
  const editTask = useCallback((id: string, newTitle: string): boolean => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      if (showToast) showToast('Task title cannot be empty!');
      return false;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t))
    );
    if (showToast) showToast('Task updated!');
    return true;
  }, [showToast]);

  /**
   * Toggle task completion. Awards a berry and triggers celebration.
   */
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.isCompleted;
          if (nextCompleted) {
            if (onTaskCompletedReward) {
              onTaskCompletedReward(t.rewardBerries || 1);
            }
            if (showToast) {
              showToast(`Task complete! Earned +${t.rewardBerries} Berry 🍓`);
            }
          }
          return {
            ...t,
            isCompleted: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined
          };
        }
        return t;
      })
    );
  }, [onTaskCompletedReward, showToast]);

  /**
   * Delete a task.
   */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (showToast) showToast('Task deleted.');
  }, [showToast]);

  /**
   * Send a gentle task reminder.
   */
  const triggerReminder = useCallback(() => {
    const incompleteTasks = tasks.filter((t) => !t.isCompleted);
    if (incompleteTasks.length === 0) {
      if (showToast) showToast("All tasks complete! You're in great shape today! ✨");
      return;
    }

    const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
    sendNotification(
      "Mochi's Gentle Reminder",
      `Ready to work on "${randomTask.title}"? Mochi is cheering for you! 🍃`,
      (msg) => {
        if (showToast) showToast(msg);
      }
    );
  }, [tasks, showToast]);

  return {
    tasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    triggerReminder,
    completedCount,
    totalCount,
    pendingCount,
    progressPercent,
    streakDays
  };
};
