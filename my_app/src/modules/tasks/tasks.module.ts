import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { LoggerMiddleware } from '../../common/middleware/logger.middleware';
import { PrismaService } from 'src/common/infra/prisma/prisma.service';
import { TasksRepository } from './infra/tasks.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, PrismaService],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(
      // Si se quiere agregar en todas las rutas tasks, solo se coloca "tasks", sin necesidad de los objetos, o si es para todas, "*"
      {
        path: '/tasks/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/tasks',
        method: RequestMethod.POST,
      },
    );
  }
}
