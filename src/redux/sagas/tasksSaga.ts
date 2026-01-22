import { call, put, takeLatest, select } from 'redux-saga/effects';
import NetInfo from '@react-native-community/netinfo';
import { PayloadAction } from '@reduxjs/toolkit';

import { storageService } from '../../services/storage';
import { apiService } from '../../services/api';
import { Task, SyncStatus } from '../../types/Task';
import { RootState } from '../store';
import {
  loadTasksRequest,
  setTasks,
  addTaskRequest,
  addTask,
  updateTaskRequest,
  updateTask,
  syncTasksRequest,
  retryTaskRequest,
  syncTasksSuccess,
  syncTasksFailure,
} from '../slices/tasksSlice';

/** Load tasks from storage */
function* loadTasksSaga() {
  try {
    const tasks: Task[] = yield call([storageService, 'getTasks']);
    yield put(setTasks(tasks));
  } catch (e: any) {
    console.error('Load error:', e);
  }
}

/** Add new task */
function* addTaskSaga(action: PayloadAction<{ title: string; amount: number }>) {
  try {
    const tasks: Task[] = yield call([storageService, 'getTasks']);

    const duplicate = tasks.find(
      t =>
        t.title === action.payload.title &&
        t.amount === action.payload.amount &&
        t.syncStatus === SyncStatus.PENDING
    );
    if (duplicate) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: action.payload.title,
      amount: action.payload.amount,
      createdDate: new Date().toISOString(),
      syncStatus: SyncStatus.PENDING,
    };

    const updatedTasks = [...tasks, newTask];
    yield call([storageService, 'saveTasks'], updatedTasks);
    yield put(addTask(newTask));

    // Auto-sync if online and not currently syncing
    const isSyncing: boolean = yield select((state: RootState) => state.tasks.isSyncing);
    if (!isSyncing) {
      const netState = yield call([NetInfo, 'fetch']);
      if (netState.isConnected && netState.isInternetReachable) {
        yield put(syncTasksRequest());
      }
    }
  } catch (e: any) {
    console.error('Add error:', e);
  }
}

/** Update existing task */
function* updateTaskSaga(action: PayloadAction<{ id: string; data: { title: string; amount: number } }>) {
  try {
    const tasks: Task[] = yield call([storageService, 'getTasks']);
    const index = tasks.findIndex(t => t.id === action.payload.id);
    if (index === -1) return;

    const updatedTask: Task = {
      ...tasks[index],
      ...action.payload.data,
      syncStatus: SyncStatus.PENDING,
    };
    tasks[index] = updatedTask;

    yield call([storageService, 'saveTasks'], tasks);
    yield put(updateTask(updatedTask));

    // Auto-sync if online and not currently syncing
    const isSyncing: boolean = yield select((state: RootState) => state.tasks.isSyncing);
    if (!isSyncing) {
      const netState = yield call([NetInfo, 'fetch']);
      if (netState.isConnected && netState.isInternetReachable) {
        yield put(syncTasksRequest());
      }
    }
  } catch (e: any) {
    console.error('Update error:', e);
  }
}

/** Sync pending/failed tasks */
function* syncTasksSaga() {
  try {
    const netState = yield call([NetInfo, 'fetch']);
    const isOnline = !!netState.isConnected && !!netState.isInternetReachable;

    if (!isOnline) {
      yield put(syncTasksSuccess({ success: [], failed: [] }));
      return;
    }

    const tasks: Task[] = yield call([storageService, 'getTasks']);
    const tasksToSync = tasks.filter(
      t => t.syncStatus === SyncStatus.PENDING || t.syncStatus === SyncStatus.FAILED
    );

    if (tasksToSync.length === 0) {
      yield put(syncTasksSuccess({ success: [], failed: [] }));
      return;
    }

    const updatedTasks = [...tasks];
    const successIds: string[] = [];
    const failedIds: string[] = [];

    for (const task of tasksToSync) {
      const index = updatedTasks.findIndex(t => t.id === task.id);
      if (index === -1) continue;

      try {
        const syncedTask: Task = yield call([apiService, 'syncTask'], task);
        updatedTasks[index] = syncedTask;
        successIds.push(task.id);
      } catch (error) {
        // Added delay before marking as failed to handle temporary network issues
        yield call(() => new Promise(resolve => setTimeout(resolve, 500)));
        updatedTasks[index] = { ...task, syncStatus: SyncStatus.FAILED };
        failedIds.push(task.id);
      }
    }

    yield call([storageService, 'saveTasks'], updatedTasks);
    yield put(setTasks(updatedTasks));
    yield put(syncTasksSuccess({ success: successIds, failed: failedIds }));
  } catch (e: any) {
    console.error('Sync error:', e);
    yield put(syncTasksFailure(e.message || 'Sync failed'));
  }
}

/** Retry a failed task */
function* retryTaskSaga(action: PayloadAction<string>) {
  try {
    const tasks: Task[] = yield call([storageService, 'getTasks']);
    const index = tasks.findIndex(t => t.id === action.payload);
    if (index === -1) return;

    tasks[index] = { ...tasks[index], syncStatus: SyncStatus.PENDING };
    yield call([storageService, 'saveTasks'], tasks);
    yield put(setTasks(tasks));

    const isSyncing: boolean = yield select((state: RootState) => state.tasks.isSyncing);
    if (!isSyncing) yield put(syncTasksRequest());
  } catch (e: any) {
    console.error('Retry error:', e);
  }
}

/** Watch all task-related sagas */
export function* watchTasksSaga() {
  yield takeLatest(loadTasksRequest.type, loadTasksSaga);
  yield takeLatest(addTaskRequest.type, addTaskSaga);
  yield takeLatest(updateTaskRequest.type, updateTaskSaga);
  yield takeLatest(syncTasksRequest.type, syncTasksSaga);
  yield takeLatest(retryTaskRequest.type, retryTaskSaga);
}
