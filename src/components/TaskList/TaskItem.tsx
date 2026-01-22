import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Task, SyncStatus } from '../../types/Task';
import { SyncStatusBadge } from './SyncStatusBadge';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onRetry?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onRetry }) => {
  const createdDate = new Date(task.createdDate).toLocaleDateString();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <SyncStatusBadge status={task.syncStatus} />
      </View>
      <Text style={styles.amount}>${task.amount.toFixed(2)}</Text>
      <Text style={styles.date}>{createdDate}</Text>
      {task.syncStatus === SyncStatus.FAILED && onRetry && (
        <Button title="Retry" onPress={() => onRetry(task.id)} color="orange" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default TaskItem;
