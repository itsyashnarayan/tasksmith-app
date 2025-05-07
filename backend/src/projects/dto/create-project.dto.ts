export class CreateProjectDto {
  name: string;
  description?: string;
  status?: string;
  startDate: string;
  endDate: string;
  managerId?: number;
  memberIds: number[];
}
