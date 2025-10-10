import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTask,
  DeleteTask,
  Task,
  UpdatePartialyTask,
  UpdateTask,
} from './dto';
import { ValidateIdPipe } from '../../common/pipes/validate-id.pipe';
import { AuthGuard } from '../../common/guards/auth.guards';
import { Task as ITask } from './domain/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTasks(clientLimit: number): Promise<Task[]> {
    const limit: number = clientLimit
      ? clientLimit > 100
        ? 100
        : clientLimit
      : 10;
    const tasks: ITask[] = await this.taskService.getTasks(limit);

    return tasks.map(
      (t: ITask): Task => ({
        id: t.id.toString(),
        status: t.status,
        title: t.title,
      }),
    );
  }

  @Get('/notFound')
  @HttpCode(404)
  pageNotFound() {
    return 'Pagina no encontrada wacho';
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getTask(@Param('id', ValidateIdPipe) id: unknown): Promise<Task> {
    const task: ITask = await this.taskService.getTask(id as number);

    return {
      id: task.id.toString(),
      status: task.status,
      title: task.title,
    };
  }

  @Post()
  async createTask(@Body() task: CreateTask): Promise<Task> {
    const newTask: ITask = await this.taskService.createTask({
      status: task.status,
      title: task.title,
    });

    return {
      id: newTask.id.toString(),
      status: newTask.status,
      title: newTask.title,
    };
  }

  @Put()
  async updateTask(@Body() task: UpdateTask): Promise<UpdateTask> {
    const updatedTask: ITask = await this.taskService.updateTask({
      id: parseInt(task.id),
      status: task.status,
      title: task.title,
    });

    return {
      id: updatedTask.id.toString(),
      status: updatedTask.status,
      title: updatedTask.title,
    };
  }

  @Delete()
  deleteTask(@Body() task: DeleteTask): Promise<string> {
    return this.taskService.deleteTask(parseInt(task.id));
  }

  @Patch()
  async updatePartialyTask(
    @Body() task: UpdatePartialyTask,
  ): Promise<UpdatePartialyTask> {
    const updatedTask: ITask = await this.taskService.updatePartialyTask({
      id: parseInt(task.id),
      status: task.status,
      title: task.title,
    });

    return {
      id: updatedTask.id.toString(),
      status: updatedTask.status,
      title: updatedTask.title,
    };
  }
}
