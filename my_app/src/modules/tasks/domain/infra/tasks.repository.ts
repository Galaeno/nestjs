import { Task, NewTask, UpdateTask } from '../';
import { HttpException } from '@nestjs/common';

export interface ITasksRepository {
  getTasks(limit: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | HttpException>;
  createTask(data: NewTask): Promise<NewTask>;
  updateTask(data: UpdateTask): Promise<UpdateTask | HttpException>;
  deleteTask(id: number): Promise<string | HttpException>;
  updatePartialyTask(data: UpdateTask): Promise<UpdateTask | HttpException>;
}
