export const STRINGS = {
  FORM: {
    TITLE_LABEL: 'Task Title',
    TITLE_PLACEHOLDER: 'Enter task title',
    AMOUNT_LABEL: 'Amount',
    AMOUNT_PLACEHOLDER: 'Enter amount',
  },
  BUTTONS: {
    CREATE_TASK: 'Create Task',
    UPDATE_TASK: 'Update Task',
    CANCEL: 'Cancel',
    RETRY: 'Retry',
    REFRESH: 'Refresh',
  },
  VALIDATION: {
    TITLE_REQUIRED: 'Title is required',
    TITLE_INVALID: 'Title must contain only letters and numbers',
    TITLE_MIN_LENGTH: 'Title must be at least 1 character',
    TITLE_MAX_LENGTH: 'Title cannot exceed 100 characters',
    TITLE_ONLY_NUMBERS: 'Title must contain at least one letter',
    AMOUNT_REQUIRED: 'Amount is required',
    AMOUNT_INVALID: 'Amount must be a valid number',
    AMOUNT_MIN_VALUE: 'Amount must be at least 0.01',
    AMOUNT_MAX_VALUE: 'Amount cannot exceed 999,999,999',
    AMOUNT_LEADING_ZEROS: 'Invalid amount format',
  },
  ALERTS: {
    CANNOT_EDIT_TITLE: 'Cannot Edit',
    CANNOT_EDIT_MESSAGE: 'Synced tasks cannot be edited. Only pending or failed tasks can be modified.',
    SYNCED_WARNING: '⚠️ This task has been synced and cannot be edited.',
  },
  TASK_LIST: {
    LOADING: 'Loading tasks...',
    EMPTY_ICON: '📋',
    EMPTY_TITLE: 'No Tasks Yet',
    EMPTY_SUBTITLE: 'Tap the + button to create your first task',
    ERROR_PREFIX: 'Error:',
  },
  STATUS: {
    PENDING: 'PENDING',
    SYNCED: 'SYNCED',
    FAILED: 'FAILED',
  },
} as const;
