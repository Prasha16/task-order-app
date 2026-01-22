import { Task, SyncStatus } from '../types/Task';

const SIMULATE_DELAY = 1000;
const FAILURE_RATE = 0.2;

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const apiService = {
  syncTask: async (task: Task): Promise<Task> => {
    await delay(SIMULATE_DELAY);
    if (Math.random() < FAILURE_RATE) throw new Error('Network error: Failed to sync task');

    return { ...task, syncStatus: SyncStatus.SYNCED, lastSyncedAt: new Date().toISOString() };
  },

  updateTask: async (task: Task): Promise<Task> => {
    await delay(SIMULATE_DELAY);
    if (Math.random() < FAILURE_RATE) throw new Error('Network error: Failed to update task');

    return { ...task, syncStatus: SyncStatus.SYNCED, lastSyncedAt: new Date().toISOString() };
  },

  deleteTask: async (_taskId: string) => {
    await delay(SIMULATE_DELAY);
    if (Math.random() < FAILURE_RATE) throw new Error('Network error: Failed to delete task');

    return { success: true };
  },
};
