import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskActivity } from 'src/task-activity/task-activity.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from 'src/projects/projects.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskActivity)
    private readonly activityRepo: Repository<TaskActivity>,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const assigneeEntities = await Promise.all(
      dto.assigneeIds.map((id) => this.usersService.findById(id)),
    );

    const assignees = assigneeEntities.filter(
      (user): user is User => user !== null,
    );

    const project = await this.projectsService.findOne(dto.projectId);

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'To Do',
      priority: dto.priority ?? 'Medium',
      dueDate: dto.dueDate,
      assignees,
      project,
    });

    return this.taskRepo.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepo.find({ relations: ['assignees', 'project'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['assignees', 'project'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    const updates: Partial<Task> = {};
    const logs: TaskActivity[] = [];

    for (const key of Object.keys(dto) as (keyof UpdateTaskDto)[]) {
      const oldVal = (task as unknown as Record<string, unknown>)[key];
      const newVal = (dto as unknown as Record<string, unknown>)[key];

      if (key === 'assigneeIds') {
        const rawAssignees = await Promise.all(
          (newVal as number[]).map((id) => this.usersService.findById(id)),
        );

        const newAssignees = rawAssignees.filter(
          (user): user is User => user !== null,
        );
        updates.assignees = newAssignees;

        logs.push(
          this.activityRepo.create({
            task,
            action: 'UPDATE',
            field: 'assignees',
            oldValue: JSON.stringify(task.assignees.map((a) => a.id)),
            newValue: JSON.stringify(newVal),
          }),
        );
      } else if (newVal !== undefined && newVal !== oldVal) {
        (updates as Record<string, unknown>)[key] = newVal;

        logs.push(
          this.activityRepo.create({
            task,
            action: 'UPDATE',
            field: key,
            oldValue: JSON.stringify(oldVal),
            newValue: JSON.stringify(newVal),
          }),
        );
      }
    }

    Object.assign(task, updates);
    await this.activityRepo.save(logs);
    return this.taskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Task not found');
  }
}
