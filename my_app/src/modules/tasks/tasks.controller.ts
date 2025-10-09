import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTask,
  Task,
  UpdateTask,
  DeleteTask,
  UpdatePartialyTask,
} from './tasks.dto';
import { ValidateTaskIdPipe } from './pipes/validate-task-id/validate-task-id.pipe';
import { AuthGuard } from './guards/auth/auth.guard';

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
    return await this.taskService.getTasks(limit);
  }

  @Get('/notFound')
  @HttpCode(404)
  pageNotFound() {
    return 'Pagina no encontrada wacho';
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getTask(
    @Param('id', ValidateTaskIdPipe) id: unknown,
  ): Promise<Task | HttpException> {
    return this.taskService.getTask(id as number);
  }

  @Post()
  createTask(@Body() task: CreateTask): Promise<CreateTask> {
    return this.taskService.createTask(task);
  }

  @Put()
  updateTask(@Body() task: UpdateTask): Promise<UpdateTask | HttpException> {
    return this.taskService.updateTask(task);
  }

  @Delete()
  deleteTask(@Body() task: DeleteTask): Promise<string | HttpException> {
    return this.taskService.deleteTask(task);
  }

  @Patch()
  updatePartialyTask(
    @Body() task: UpdatePartialyTask,
  ): Promise<UpdatePartialyTask | HttpException> {
    return this.taskService.updatePartialyTask(task);
  }
}
