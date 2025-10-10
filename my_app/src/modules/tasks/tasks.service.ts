import { Injectable } from '@nestjs/common';
import type { NewTask, Task } from './domain/task.entity';
import { TaskRepository } from './infra/task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasks(limit: number): Promise<Task[]> {
    return this.taskRepository.getTasks(limit);
  }

  getTask(id: number): Promise<Task> {
    return this.taskRepository.getTask(id);
  }

  createTask(data: NewTask): Promise<Task> {
    return this.taskRepository.createTask(data);
  }

  updateTask(data: Task): Promise<Task> {
    return this.taskRepository.updateTask(data);
  }

  deleteTask(id: number): Promise<string> {
    return this.taskRepository.deleteTask(id);
  }

  updatePartialyTask(data: Task): Promise<Task> {
    return this.taskRepository.updatePartialyTask(data);
  }
}
