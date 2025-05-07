import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskActivity } from 'src/task-activity/task-activity.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from 'src/projects/projects.service';

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
    const assignee = await this.usersService.findById(dto.assigneeId);
    const project = await this.projectsService.findOne(dto.projectId);

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'To Do',
      priority: dto.priority ?? 'Medium',
      dueDate: dto.dueDate,
      assignee: assignee!,
      project,
    });

    return this.taskRepo.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepo.find({ relations: ['assignee', 'project'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['assignee', 'project'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    const updates = {} as Partial<Task>;
    const logs: TaskActivity[] = [];

    for (const key of Object.keys(dto) as (keyof UpdateTaskDto)[]) {
      const oldVal = (task as unknown as Record<string, unknown>)[key];
      const newVal = (dto as unknown as Record<string, unknown>)[key];
      if (newVal !== undefined && newVal !== oldVal) {
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
