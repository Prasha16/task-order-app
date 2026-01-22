import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { syncTasksRequest } from '../redux/slices/tasksSlice';
import { AppDispatch, RootState } from '../redux/store';

export const useNetworkSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isSyncing = useSelector((state: RootState) => state.tasks.isSyncing);
  const tasks = useSelector((state: RootState) => state.tasks.items);

  // always at top level
  const isOnlineRef = useRef(false);
  const hasPendingRef = useRef(false);

  // Track pending tasks
  useEffect(() => {
    hasPendingRef.current = tasks.some(
      t => t.syncStatus === 'PENDING' || t.syncStatus === 'FAILED'
    );
  }, [tasks]);

  // Network change listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      if (isOnline && !isOnlineRef.current && hasPendingRef.current && !isSyncing) {
        dispatch(syncTasksRequest());
      }
      isOnlineRef.current = isOnline;
    });

    return unsubscribe;
  }, [dispatch, isSyncing]);

  // Manual pull-to-refresh sync
  const manualSync = async () => {
    const netState = await NetInfo.fetch();
    const isOnline = !!netState.isConnected && !!netState.isInternetReachable;
    if (!isSyncing && isOnline) {
      dispatch(syncTasksRequest());
    }
  };

  return { manualSync, isSyncing };
};
