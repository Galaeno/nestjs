import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import type { Task, NewTask, UpdateTask } from './domain';
import { TasksRepository } from './infra/tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async getTasks(limit: number): Promise<Task[]> {
    return await this.tasksRepository.getTasks(limit);
  }

  async getTask(id: number): Promise<Task | HttpException> {
    try {
      return await this.tasksRepository.getTask(id);
    } catch {
      return new NotFoundException(`La tarea con id [${id}] no se encontró`);
    }
  }

  async createTask(data: NewTask): Promise<NewTask> {
    return await this.tasksRepository.createTask(data);
  }

  async updateTask(data: UpdateTask): Promise<UpdateTask | HttpException> {
    try {
      return await this.tasksRepository.updateTask(data);
    } catch {
      return new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }

  async deleteTask(id: number): Promise<string | HttpException> {
    try {
      await this.tasksRepository.deleteTask(id);

      return `Tarea con id ${id} eliminada`;
    } catch {
      return new NotFoundException(`La tarea con id [${id}] no se encontró`);
    }
  }

  async updatePartialyTask(
    data: UpdateTask,
  ): Promise<UpdateTask | HttpException> {
    try {
      return await this.tasksRepository.updatePartialyTask(data);
    } catch {
      return new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }
}
