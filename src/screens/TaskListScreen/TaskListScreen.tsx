import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TaskItem from '../../components/TaskList/TaskItem';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import { RootState, AppDispatch } from '../../redux/store';
import { Task } from '../../types/Task';
import { loadTasksRequest, retryTaskRequest } from '../../redux/slices/tasksSlice';
import { ROUTES } from '../../navigation/routes';
import { STRINGS } from '../../constants/strings';
import { styles } from './TaskListScreen.styles';

export const TaskListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { items: tasks, loading, error, isSyncing } = useSelector((state: RootState) => state.tasks);
  const { manualSync } = useNetworkSync();

  const [refreshing, setRefreshing] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    dispatch(loadTasksRequest());
  }, [dispatch]);

  // Navigate to edit screen
  const handleTaskPress = (task: Task) => {
    navigation.navigate(ROUTES.TASK_EDIT, { taskId: task.id });
  };

  // Navigate to create screen
  const handleAddTask = () => {
    navigation.navigate(ROUTES.TASK_CREATE);
  };

  // Retry syncing a failed task
  const handleRetry = (taskId: string) => {
    dispatch(retryTaskRequest(taskId));
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);

    const netState = await NetInfo.fetch();
    const isOnline = !!netState.isConnected && !!netState.isInternetReachable;

    if (isOnline) {
      await manualSync(); // Sync pending tasks
    } else if (tasks.some(t => t.syncStatus === 'PENDING' || t.syncStatus === 'FAILED')) {
      Alert.alert('No Internet', 'Pending tasks cannot be synced while offline.');
    }

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Syncing banner */}
        {isSyncing && (
          <View style={styles.syncingBanner}>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={styles.syncingText}>Syncing tasks...</Text>
          </View>
        )}

        {/* Loading state */}
        {loading && tasks.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>{STRINGS.TASK_LIST.LOADING}</Text>
          </View>
        ) : tasks.length === 0 ? (
          // Empty list view
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{STRINGS.TASK_LIST.EMPTY_ICON}</Text>
            <Text style={styles.emptyTitle}>{STRINGS.TASK_LIST.EMPTY_TITLE}</Text>
            <Text style={styles.emptySubtitle}>{STRINGS.TASK_LIST.EMPTY_SUBTITLE}</Text>
          </View>
        ) : (
          // Task list
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onPress={() => handleTaskPress(item)}
                onRetry={handleRetry}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing || isSyncing}
                onRefresh={onRefresh}
                colors={['#2196F3']}
                tintColor="#2196F3"
              />
            }
          />
        )}

        {/* Error banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              {STRINGS.TASK_LIST.ERROR_PREFIX} {error}
            </Text>
          </View>
        )}

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
