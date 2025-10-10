import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [TasksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    /* Si se quiere agregar en todas las rutas tasks, solo se coloca "tasks"
        consumer.apply(LoggerMiddleware).forRoutes('tasks');
    */

    /* Si se quiere agregar rutas individuales
    consumer.apply(LoggerMiddleware).forRoutes(
      {
        path: '/tasks/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/tasks',
        method: RequestMethod.POST,
      }
    )*/
  }
}
