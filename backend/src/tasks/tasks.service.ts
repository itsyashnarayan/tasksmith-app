import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from 'src/projects/projects.service';
import { TaskActivity } from 'src/task-activity/task-activity.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(TaskActivity)
    private readonly activityRepo: Repository<TaskActivity>,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const assignee = dto.assigneeId
      ? await this.usersService.findById(dto.assigneeId)
      : undefined;

    const project = await this.projectsService.findOne(dto.projectId);

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? 'To Do',
      priority: dto.priority ?? 'Medium',
      dueDate: dto.dueDate,
      ...(assignee && { assignee }),
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

    if (dto.assigneeId) {
      const assignee = await this.usersService.findById(dto.assigneeId);
      if (assignee) {
        task.assignee = assignee;
      }
    }

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
      dueDate: dto.dueDate ?? task.dueDate,
    });

    const updatedTask = await this.taskRepo.save(task);
    await this.logActivity(task.id, 'Task updated', 'system');

    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  private async logActivity(
    taskId: number,
    action: string,
    performedBy: string,
  ): Promise<void> {
    const activity = this.activityRepo.create({
      taskId,
      action,
      performedBy,
      timestamp: new Date(),
    });

    await this.activityRepo.save(activity);
  }
}
