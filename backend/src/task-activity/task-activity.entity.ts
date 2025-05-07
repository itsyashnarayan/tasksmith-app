import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('task_activities')
export class TaskActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  field: string;

  @Column({ nullable: true })
  oldValue: string;

  @Column({ nullable: true })
  newValue: string;

  @ManyToOne(() => Task, (task) => task.id)
  task: Task;

  @CreateDateColumn()
  created_at: Date;
}
