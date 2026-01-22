import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from './routes';
import { TaskListScreen } from '../screens/TaskListScreen/TaskListScreen';
import { CreateTaskScreen } from '../screens/CreateTaskScreen/CreateTaskScreen';
import { EditTaskScreen } from '../screens/EditTaskScreen/EditTaskScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.TASK_LIST}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name={ROUTES.TASK_LIST}
        component={TaskListScreen}
        options={{ title: 'Tasks' }}
      />
      <Stack.Screen
        name={ROUTES.TASK_CREATE}
        component={CreateTaskScreen}
        options={{ title: 'Create Task' }}
      />
      <Stack.Screen
        name={ROUTES.TASK_EDIT}
        component={EditTaskScreen}
        options={{ title: 'Edit Task' }}
      />
    </Stack.Navigator>
  );
};
