import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
@Entity()
export class TaskActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @Column()
  action: string;

  @Column()
  performedBy: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Task, (task) => task.activities)
  task: Task;
}
