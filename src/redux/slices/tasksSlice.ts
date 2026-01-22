import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, SyncStatus } from '../../types/Task';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  isSyncing: boolean;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  isSyncing: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasksRequest: state => {
      state.loading = true;
      state.error = null;
    },
    addTaskRequest: () => {},
    updateTaskRequest: () => {},
    syncTasksRequest: state => {
      state.error = null;
      state.isSyncing = true;
    },
    retryTaskRequest: () => {},
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    syncTasksSuccess: (
      state,
      action: PayloadAction<{ success: string[]; failed: string[] }>
    ) => {
      const { success, failed } = action.payload;

      state.items = state.items.map(task => {
        if (success.includes(task.id)) return { ...task, syncStatus: SyncStatus.SYNCED };
        if (failed.includes(task.id)) return { ...task, syncStatus: SyncStatus.FAILED };
        return task;
      });

      state.isSyncing = false;
      state.error = null;
    },
    syncTasksFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isSyncing = false;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  loadTasksRequest,
  addTaskRequest,
  updateTaskRequest,
  syncTasksRequest,
  retryTaskRequest,
  setTasks,
  addTask,
  updateTask,
  syncTasksSuccess,
  syncTasksFailure,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
