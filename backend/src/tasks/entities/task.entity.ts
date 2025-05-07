import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TaskActivity } from 'src/task-activity/task-activity.entity';
import { OneToMany } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'To Do' })
  status: 'To Do' | 'In Progress' | 'Done';

  @Column({ default: 'Medium' })
  priority: 'Low' | 'Medium' | 'High';

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @ManyToOne(() => User, { nullable: true })
  assignee: User;

  @ManyToOne(() => Project, (project) => project.id)
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TaskActivity, (activity) => activity.task)
  activities: TaskActivity[];
}
