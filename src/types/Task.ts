export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}
 
export interface Task {
  id: string;
  title: string;
  amount: number;
  createdDate: string;
  syncStatus: SyncStatus;
}
 
export interface TaskFormData {
  title: string;
  amount: string;
}