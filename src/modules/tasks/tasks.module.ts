import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './infra/task.repository';
import { PrismaModule } from 'src/common/infra/prisma/prisma.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  imports: [PrismaModule],
})
export class TasksModule {}
