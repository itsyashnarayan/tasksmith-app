export class CreateTaskDto {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  dueDate: string;
  assigneeIds: number[];
  projectId: number;
}
