import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';

import { startOfMonth, endOfMonth, getMonth, isYesterday } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { UsersService } from '../users/users.service';
import { ResponsibilitiesService } from '../responsibilities/responsibilities.service';
import { Streak } from '../users/entities';
import { CreateStreakDto } from '../users/dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Streak)
    private streakRepository: Repository<Streak>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => ResponsibilitiesService)) private responsibilitiesService: ResponsibilitiesService
    // @Inject('MomentWrapper') private momentWrapper: moment.Moment
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    const tasks = await this.findByNameAndId(createTaskDto.name, createTaskDto.owner_id);
    if (tasks.length > 0) throw new BadRequestException('Task name exist');
    const _taskRepository = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(_taskRepository);
  }

  async findAll() {
    return this.taskRepository.findAndCount();
  }

  async findAllCompleted(userId: number) {
    return this.taskRepository.findAndCount({ where: { completed: true, owner_id: userId} });

  }

  async findMytasks(userId: number) {
    return this.taskRepository.findAndCount({ where: { owner_id: userId } });
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (task) return task;
    return null;
  }

  async findByName(name: string) {
    const task = await this.taskRepository.findOneBy({ name });
    if (task) return task;
    return null;
  }

  async findByNameAndId(name: string, owner_id: number) {
    const tasks = await this.taskRepository.find({ where: { name, owner_id } });
    return tasks;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    if (!task) throw new NotFoundException('Task not found');
    Logger.log(updateTaskDto);
    return this.taskRepository.save(Object.assign(task, updateTaskDto));
    // return this.taskRepository.update(id, updateTaskDto);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return this.taskRepository.remove(task);
  }

  async getUserTaskStatistics(userId: number, dueDate: string) {
    let before = new Date();
    let after = new Date();

    if (dueDate === 'today') {
      const start = new Date();
      const new_s = new Date(`${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`);
      before = new_s;
      const end = new Date(new_s);
      end.setDate(new_s.getDate() + 1);
      after = end;
    } else {
      const start = new Date(dueDate);
      start.setHours(0, 0, 0, 0);
      const new_s = new Date(`${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`);
      before = new_s;
      const end = new Date(new_s);
      end.setDate(new_s.getDate() + 1);
      after = end;

    }
    const filters = {
      before: before.toISOString() as any,
      after: after.toISOString() as any,
      userId
    };
    Logger.log(JSON.stringify(filters))
    const queryBuilder = this.taskRepository.createQueryBuilder();
    const tasks = await queryBuilder
      .where('owner_id = :userId')
      .andWhere('due_date >= :before')
      .andWhere('due_date < :after')
      .setParameters(filters)
      // .printSql()
      .getManyAndCount();
    if (!tasks) throw new BadRequestException('Query failed');
    const completedTasks = tasks[0].filter((task, index) => {
      return task.completed;
    });
    const incompletedTasks = tasks[0].filter((task, index) => {
      return !task.completed;
    });
    let sum = 0;
    tasks[0].forEach((task) => {
      sum = sum + task.duration;
    });

    return {
      status: 1,
      message: 'Your tasks',
      data: {
        completed_tasks: completedTasks,
        incompleted_tasks: incompletedTasks,
        total_howlong: sum,
        total_task_count: tasks[1],
        green_check: !incompletedTasks.length
      }
    }

  }

  async getUserMonthlyStatistics(userId: number) {
    const now = new Date();
    const queryBuilder = this.taskRepository.createQueryBuilder();

    const data = await queryBuilder
      .select(
        'sum(case when completed = true then 1 else 0 end) as completed_count, sum(case when completed = true then 0 else 1 end ) as incompleted_count , DATE_FORMAT(due_date, "%Y-%m-%d") as date'
      )
      .where('owner_id = :userId', { userId })
      .andWhere('due_date >= :after', { after: startOfMonth(now) })
      .andWhere('due_date <= :before', { before: endOfMonth(now) })
      .addGroupBy('DATE_FORMAT(due_date, "%y-%m-%d")')
      .getRawMany();
    data.forEach((d) => {
      d['green_check'] = d.incompleted_count > 0 ?  false : true;
    })
    const total_green_checks = data.filter((d) => (d.green_check)).length;

    const _queryBuilder = this.taskRepository.createQueryBuilder();
    const otherData = await _queryBuilder
      .select(
        'sum(case when completed = true then 1 else 0 end) as total_completed_count, sum(case when completed = true then 0 else 1 end) as total_incompleted_count, SUM(case when completed = true then gro_factor else 0 end) as total_gro_factor'
      )
      .where('owner_id = :userId', { userId })
      .andWhere('due_date >= :after', { after: startOfMonth(now) })
      .andWhere('due_date <= :before', { before: endOfMonth(now) })
      .getRawOne();

    const responsibilityData = await this.responsibilitiesService.getUserMonthlyStatistics(userId);
    return {
      status: 1,
      message: 'Your monthly tasks',
      data: {
        month_data: data,
        ...otherData,
        ...responsibilityData.data,
        total_green_checks
      },
      
    };

  }

  async getUserAllTimeStatistics(userId: number) {
    const queryBuilder = this.taskRepository.createQueryBuilder();
    const data = await queryBuilder
      .select(
        'SUM(case when completed = true then 1 else 0 end) as completed_count, SUM(case when completed = true then 0 else 1 end ) as incompleted_count'
      )
      .where('owner_id = :userId', { userId })
      .getRawMany();

    const _queryBuilder = this.taskRepository.createQueryBuilder();
    const otherData = await _queryBuilder
        .select(
          'sum(case when completed = true then 1 else 0 end) as total_completed_count, sum(case when completed = true then 0 else 1 end) as total_incompleted_count, SUM(case when completed = true then gro_factor else 0 end) as total_gro_factor'
        )
        .where('owner_id = :userId', { userId })
        .getRawOne();
    const responsibilityData = await this.responsibilitiesService.getUserMonthlyStatistics(userId);
    return {
      ...data[0],
      ...otherData,
      ...responsibilityData.data,
    }
  }

  async getUserMonthlyTotalGroFactor(userId: number) {
    const now = new Date();

    const queryBuilder = this.taskRepository.createQueryBuilder();
    const data = await queryBuilder
      .select(
        'SUM(case when completed = true then gro_factor else 0 end) as total_gro_factor'
      )
      .where('owner_id = :userId', { userId })
      .andWhere('due_date >= :after', { after: startOfMonth(now) })
      .andWhere('due_date <= :before', { before: endOfMonth(now) })
      .getRawOne();

    return data;
  }

  /**
   * 
   * @param taskId : Task Id
   */
  async completeTask(taskId: number) {
    const task = await this.findOne(taskId);
    if (!task) throw new NotFoundException('Task not found');
    const user = await this.usersService.findById(task.owner_id);
    if (!user) throw new NotFoundException('User not found');
    task.completed = true;
    task.completedDate = new Date();
    if (task.priority > 0 && task.duration > 0)
      task.gro_factor = Math.floor(task.priority / task.duration);
    await this.taskRepository.save(task);

    if (isYesterday(user.lastCompletionDate)) {
      user.streaks += 1;
    } else {
      const streakDto = new CreateStreakDto({
        user_id: user.id,
        last_value: user.streaks
      });
      const streak =  this.streakRepository.create(streakDto);
      streak.lastCompletionDate = user.lastCompletionDate;
      await this.streakRepository.save(streak);
      user.streaks = 1;
    }
    user.lastCompletionDate = new Date();
    await this.usersService.saveUserInfo(user);
    return {
      status: 1,
      data: user.toDto(),
      message: 'completed the task'
    }
  }
}
