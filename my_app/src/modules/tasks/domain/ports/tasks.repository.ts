import { Task } from '../task.entity';
import { HttpException } from '@nestjs/common';

export interface TaskRepository {
  getTasks(limit: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | HttpException>;
  createTask(data: Task): Promise<Task>;
  updateTask(data: Task): Promise<Task | HttpException>;
  deleteTask(id: number): Promise<string | HttpException>;
  updatePartialyTask(data: Task): Promise<Task | HttpException>;
}
