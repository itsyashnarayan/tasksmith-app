import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const members = await Promise.all(
      dto.memberIds.map((id) => this.usersService.findById(id)),
    );

    const manager = dto.managerId
      ? await this.usersService.findById(dto.managerId)
      : null;

    const project = this.projectRepository.create({
      name: dto.name,
      description: dto.description || '',
      status: dto.status || 'PLANNED',
      startDate: dto.startDate,
      endDate: dto.endDate,
      members,
      manager,
    } as DeepPartial<Project>);

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['manager', 'members'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['members', 'manager'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    if (dto.memberIds) {
      const resolvedMembers = await Promise.all(
        dto.memberIds.map((id) => this.usersService.findById(id)),
      );
      project.members = resolvedMembers.filter(
        (user): user is User => user !== null,
      );
    }

    if (dto.managerId !== undefined) {
      const manager = await this.usersService.findById(dto.managerId);
      if (manager) {
        project.manager = manager;
      }
    }

    Object.assign(project, {
      name: dto.name ?? project.name,
      description: dto.description ?? project.description,
      status: dto.status ?? project.status,
      startDate: dto.startDate ?? project.startDate,
      endDate: dto.endDate ?? project.endDate,
    });

    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
