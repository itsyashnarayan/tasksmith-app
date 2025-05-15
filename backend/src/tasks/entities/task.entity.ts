import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Project } from "../../projects/entities/project.entity";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ length: 20, default: "To Do" })
  status: string;

  @Column({ length: 20, default: "Medium" })
  priority: string;

  @Column({ type: "date" })
  dueDate: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: "task_assignees" })
  assignees: User[];

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Project;

  @CreateDateColumn()
  created_at: Date;
}
