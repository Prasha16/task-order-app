export const ROUTES = {
  TASK_LIST: 'TaskList',
  TASK_CREATE: 'TaskCreate',
  TASK_EDIT: 'TaskEdit',
} as const;

export type RouteNames = typeof ROUTES[keyof typeof ROUTES];

export type RootStackParamList = {
  [ROUTES.TASK_LIST]: undefined;
  [ROUTES.TASK_CREATE]: undefined;
  [ROUTES.TASK_EDIT]: { taskId: string };
};
