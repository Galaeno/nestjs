import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import {
  Task,
  CreateTask,
  UpdateTask,
  DeleteTask,
  UpdatePartialyTask,
} from './tasks.dto';
import { PrismaService } from '../../prisma.service';
import { Task as TaskDB } from '@prisma/client';

@Injectable()
export class TasksService {
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

  async getTask(id: number): Promise<Task | HttpException> {
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
      return new NotFoundException(`La tarea con id [${id}] no se encontró`);
    }
  }

  async createTask(data: CreateTask): Promise<CreateTask> {
    return await this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: UpdateTask): Promise<UpdateTask | HttpException> {
    try {
      return await this.prismaService.task.update({
        data,
        where: {
          id: data.id,
        },
      });
    } catch {
      return new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }

  async deleteTask(data: DeleteTask): Promise<string | HttpException> {
    try {
      await this.prismaService.task.delete({
        where: {
          id: data.id,
        },
      });

      return `Tarea con id ${data.id} eliminada`;
    } catch {
      return new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }

  async updatePartialyTask(
    data: UpdatePartialyTask,
  ): Promise<UpdatePartialyTask | HttpException> {
    try {
      return await this.prismaService.task.update({
        data,
        where: {
          id: data.id,
        },
      });
    } catch {
      return new NotFoundException(
        `La tarea con id [${data.id}] no se encontró`,
      );
    }
  }
}
