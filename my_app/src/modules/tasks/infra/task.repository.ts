import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task, NewTask } from '../domain/task.entity';
import type { TaskRepository as ITaskRepository } from '../domain/ports/task.repository';
import { PrismaService } from '../../../common/infra/prisma/prisma.service';
import { Task as TaskDB } from '@prisma/client';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private prismaService: PrismaService) {}

  async getTasks(limit: number): Promise<Task[]> {
    const tasksResult: TaskDB[] = await this.prismaService.task.findMany({
      take: limit,
    });

    return tasksResult.map(
      (t: TaskDB): Task => ({
        id: t.id,
        title: t.title,
        status: t.status,
      }),
    );
  }

  async getTask(id: number): Promise<Task> {
    try {
      const tasksResult: TaskDB =
        await this.prismaService.task.findUniqueOrThrow({
          where: {
            id,
          },
        });

      return {
        id: tasksResult.id,
        title: tasksResult.title,
        status: tasksResult.status,
      };
    } catch {
      throw new NotFoundException(`La tarea con id [${id}] no se encontró`);
    }
  }

  async createTask(data: NewTask): Promise<Task> {
    return await this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: Task): Promise<Task> {
    try {
      return await this.prismaService.task.update({
        data,
        where: {
          id: data.id,
        },
      });
    } catch {
      throw new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }

  async deleteTask(id: number): Promise<string> {
    try {
      await this.prismaService.task.delete({
        where: {
          id,
        },
      });

      return `Tarea con id ${id} eliminada`;
    } catch {
      throw new NotFoundException(`La tarea con id [${id}] no se encontró`);
    }
  }

  async updatePartialyTask(data: Task): Promise<Task> {
    try {
      console.log(data);
      return await this.prismaService.task.update({
        data,
        where: {
          id: data.id,
        },
      });
    } catch {
      throw new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }
}
