import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SyncStatus } from '../../types/Task';

interface Props {
  status: SyncStatus;
}

//status badge component
export const SyncStatusBadge = ({ status }: Props) => {
  const getStatusColor = () => {
    switch (status) {
      case SyncStatus.SYNCED:
        return '#4CAF50';
      case SyncStatus.PENDING:
        return '#FF9800';
      case SyncStatus.FAILED:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
