export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'To Do' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  assigneeId?: number;
}
