import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 20 })
  status: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @ManyToOne(() => User, { nullable: true })
  manager: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
