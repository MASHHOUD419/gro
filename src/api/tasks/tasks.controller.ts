import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Task')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Create your task.",
    description: "Attach required values. Also should attach Bear token"
  })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    Logger.log(createTaskDto);
    const userId = req.user.id;
    createTaskDto.owner_id = userId;
    const task = await this.tasksService.create(createTaskDto);
    return {
      status: 1,
      message: 'task created',
      data: {
        ...task
      }
    }
  }

  @Get()
  @ApiOperation({
    summary: "Get all tasks.",
    description: "Attach required values. Also should attach Bear token"
  })
  async findAll(@Req() req: any) {
    const userId = req.user.id;
    const tasks = await this.tasksService.findMytasks(+userId);
    return {
      status: 1,
      message: 'tasks list',
      data: tasks[0],
      count: tasks[1]
    }
  }

  @Get('/completed/all')
  @ApiOperation({
    summary: "Get all tasks.",
    description: "Attach required values. Also should attach Bear token"
  })
  async findAllCompleted(@Req() req: any) {
    const tasks = await this.tasksService.findAllCompleted(+req.user.id);
    return {
      status: 1,
      message: 'tasks list',
      data: tasks[0],
      count: tasks[1]
    }
  }

  @Get('my_tasks')
  @ApiOperation({
    summary: "Get your all tasks.",
    description: "Attach required values. Also should attach Bear token"
  })
  async findMyTasks(@Req() req: any) {
    const userId = req.user.id;
    const tasks = await this.tasksService.findMytasks(+userId);
    return {
      status: 1,
      message: 'tasks list',
      data: tasks[0],
      count: tasks[1]
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get your one task.",
    description: "Attach required values. Also should attach Bear token"
  })
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(+id);
    return {
      status: 1,
      message: 'task info',
      data: {
        ...task
      }
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: "Edit your task.",
    description: "Attach required values. Also should attach Bear token"
  })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = this.tasksService.update(+id, updateTaskDto);
    return {
      status: 1,
      message: 'task updated',
      id
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Delete your task.",
    description: "Attach required values. Also should attach Bear token"
  })
  async remove(@Param('id') id: string) {
    const deleted = await this.tasksService.remove(+id);
    if (!deleted)
      return {
        status: 0,
        message: 'something is wrong',
        id
      };
    return {
      status: 1,
      message: 'task deleted',
      id
    };
  }

  @Get('/user_tasks/:id')
  async getUserTasks(@Param('id') id: string) {

  }

  @Patch('/complete/:id')
  @ApiOperation({
    summary: "complete one task",
    description: "Required values are 'task id'. Also should attach Bear token"
  })
  async completeTask(@Param('id') id: string) {
    return this.tasksService.completeTask(+id);
  }

  @Get('/user_task_statistics/daily/:user_id?')
  @ApiOperation({
    summary: "Get user tasks for special date",
    description: "Required values are 'user_id' and 'due_date'. 'due_date' format is  'today' or '2022/10/15' (or '2022-10-15'). Also should attach Bear token"
  })
  async getUserTaskStatistics(@Param('user_id') user_id: string, @Query('due_date') dueDate: string) {
    return this.tasksService.getUserTaskStatistics(+user_id, dueDate);
  }

  @Get('/user_task_statistics/monthly/:user_id')
  @ApiOperation({
    summary: "Get user monthly statistics for this month",
    description: "Required values are 'user_id'. Also should attach Bear token"
  })
  async getUserMonthlyStatistics(@Param('user_id') user_id: string) {
    return this.tasksService.getUserMonthlyStatistics(+user_id);
  }

  @Get('/user_task_statistics/alltime/:user_id')
  @ApiOperation({
    summary: "Get user all time statistics for this month",
    description: "Required values are 'user_id'. Also should attach Bear token"
  })
  async getUserAllTimeStatistics(@Param('user_id') user_id: string) {
    return this.tasksService.getUserAllTimeStatistics(+user_id);
  }

  @Get('/user_gro_factor/monthly/:user_id')
  @ApiOperation({
    summary: "Get user monthly statistics for this month",
    description: "Required values are 'user_id'. Also should attach Bear token"
  })
  async getUserMonthlyGroFactor(@Param('user_id') user_id: string) {
    return this.tasksService.getUserMonthlyTotalGroFactor(+user_id);
  }
}
