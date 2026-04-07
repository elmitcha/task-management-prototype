import { Priority, TaskStatus, type Task } from '@/types';

export const mockTask: Task = {
  id: 'uuid-123',
  title: 'Faire les tests',
  description: 'Utiliser Vitest et RTL',
  status: TaskStatus.TODO,
  priority: Priority.HIGH,
  dueDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
