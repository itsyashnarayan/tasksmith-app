import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'To Do' })
  status: string;

  @Column({ default: 'Medium' })
  priority: string;

  @Column({ type: 'date' })
  dueDate: string;

  @ManyToOne(() => User)
  assignee: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @CreateDateColumn()
  created_at: Date;
}
