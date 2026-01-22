import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const TASKS_KEY = '@tasks';
const SYNC_QUEUE_KEY = '@sync_queue';

export const storageService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTasks: async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      throw error;
    }
  },

  getSyncQueue: async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  updateSyncQueue: async (taskIds: string[]) => {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(taskIds));
    } catch (error) {
      throw error;
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([TASKS_KEY, SYNC_QUEUE_KEY]);
    } catch (error) {
      throw error;
    }
  },
};
