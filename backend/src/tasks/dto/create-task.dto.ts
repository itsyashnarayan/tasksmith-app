export class CreateTaskDto {
  title: string;
  description?: string;
  status?: 'To Do' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  assigneeId?: number;
  projectId: number;
}
