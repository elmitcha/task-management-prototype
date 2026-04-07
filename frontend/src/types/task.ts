export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPaginationMeta {
  count: number;
  totalPages: number;
  currentPage: number;
  take: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiPaginationMeta;
}
