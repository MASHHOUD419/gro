import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { ResponsibilitiesModule } from '../responsibilities/responsibilities.module';
import { Streak } from '../users/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Streak]),
    forwardRef(() => UsersModule),
    forwardRef(() => ResponsibilitiesModule),
    SharedModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule { }
