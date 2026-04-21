import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll() {
    return {
      code: 200,
      message: 'success',
      data: await this.tasksService.findAll()
    }
  }

  @Post()
  async create(@Body() createTaskDto: {
    title: string
    mode: 'basic' | 'advanced'
    target?: string
    deadline?: string
  }) {
    return {
      code: 200,
      message: 'success',
      data: await this.tasksService.create(createTaskDto)
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return {
      code: 200,
      message: 'success',
      data: await this.tasksService.findById(+id)
    }
  }

  @Post(':taskId/steps/:stepId/toggle')
  async toggleStep(
    @Param('taskId') taskId: string,
    @Param('stepId') stepId: string
  ) {
    return {
      code: 200,
      message: 'success',
      data: await this.tasksService.toggleStep(+taskId, +stepId)
    }
  }
}
