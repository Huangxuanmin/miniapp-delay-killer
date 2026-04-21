import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '@/storage/database/supabase-client'
import { LLMClient, Config } from 'coze-coding-dev-sdk'

@Injectable()
export class TasksService {
  async findAll() {
    const client = getSupabaseClient()

    const { data: tasks, error: tasksError } = await client
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (tasksError) {
      throw new Error(`查询任务失败: ${tasksError.message}`)
    }

    // 获取每个任务的步骤
    const tasksWithSteps = await Promise.all(
      tasks.map(async (task) => {
        const { data: steps, error: stepsError } = await client
          .from('task_steps')
          .select('*')
          .eq('task_id', task.id)
          .order('order_index', { ascending: true })

        if (stepsError) {
          console.error(`查询步骤失败 (task_id: ${task.id}):`, stepsError.message)
          return { ...task, steps: [] }
        }

        return { ...task, steps }
      })
    )

    return tasksWithSteps
  }

  async create(createTaskDto: {
    title: string
    mode: 'basic' | 'advanced'
    target?: string
    deadline?: string
  }) {
    const client = getSupabaseClient()

    // 创建任务
    const { data: task, error: taskError } = await client
      .from('tasks')
      .insert({
        title: createTaskDto.title,
        mode: createTaskDto.mode,
        target: createTaskDto.mode === 'advanced' ? createTaskDto.target : null,
        deadline: createTaskDto.mode === 'advanced' ? createTaskDto.deadline : null
      })
      .select()
      .single()

    if (taskError) {
      throw new Error(`创建任务失败: ${taskError.message}`)
    }

    // 使用LLM拆解任务
    const steps = await this.breakDownTaskWithLLM(createTaskDto.title, createTaskDto)

    // 批量插入步骤
    if (steps.length > 0) {
      const stepsWithTaskId = steps.map((step, index) => ({
        task_id: task.id,
        title: step.title,
        description: step.description,
        order_index: index,
        completed: false,
        planned_time: step.planned_time ? new Date(step.planned_time).toISOString() : null
      }))

      const { error: stepsError } = await client
        .from('task_steps')
        .insert(stepsWithTaskId)

      if (stepsError) {
        throw new Error(`创建步骤失败: ${stepsError.message}`)
      }
    }

    // 返回完整的任务信息
    return this.findById(task.id)
  }

  async findById(id: number) {
    const client = getSupabaseClient()

    const { data: task, error: taskError } = await client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (taskError) {
      throw new Error(`查询任务失败: ${taskError.message}`)
    }

    const { data: steps, error: stepsError } = await client
      .from('task_steps')
      .select('*')
      .eq('task_id', id)
      .order('order_index', { ascending: true })

    if (stepsError) {
      throw new Error(`查询步骤失败: ${stepsError.message}`)
    }

    return { ...task, steps }
  }

  async toggleStep(taskId: number, stepId: number) {
    const client = getSupabaseClient()

    // 先查询当前步骤状态
    const { data: currentStep, error: queryError } = await client
      .from('task_steps')
      .select('completed')
      .eq('id', stepId)
      .eq('task_id', taskId)
      .single()

    if (queryError) {
      throw new Error(`查询步骤失败: ${queryError.message}`)
    }

    // 切换状态
    const newCompleted = !currentStep.completed

    const { data: step, error: updateError } = await client
      .from('task_steps')
      .update({ completed: newCompleted })
      .eq('id', stepId)
      .eq('task_id', taskId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`更新步骤失败: ${updateError.message}`)
    }

    return this.findById(taskId)
  }

  private async breakDownTaskWithLLM(taskTitle: string, createTaskDto: {
    title: string
    mode: 'basic' | 'advanced'
    target?: string
    deadline?: string
  }) {
    const config = new Config()
    const client = new LLMClient(config)

    let prompt = `请帮我将任务"${taskTitle}"拆解成具体的、可执行的小步骤。要求：
1. 步骤要具体、可执行，从小处着手（例如：坐到电脑前、打开文档等）
2. 每个步骤都要清晰简洁
3. 返回JSON格式，格式如下：
[
  {
    "title": "步骤标题",
    "description": "步骤描述（可选）"
  }
]
4. 至少拆解成5个步骤，不要超过10个步骤
5. 只返回JSON，不要其他文字`

    if (createTaskDto.mode === 'advanced' && createTaskDto.deadline) {
      const deadline = new Date(createTaskDto.deadline)
      const now = new Date()
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      prompt = `请帮我将任务"${taskTitle}"拆解成具体的、可执行的小步骤。要求：
1. 目标：${createTaskDto.target || '完成此任务'}
2. 截止日期：${createTaskDto.deadline}（距离今天${daysUntilDeadline}天）
3. 步骤要具体、可执行，从小处着手
4. 每个步骤都要有计划的完成时间，按照倒排方式分配时间
5. 返回JSON格式，格式如下：
[
  {
    "title": "步骤标题",
    "description": "步骤描述（可选）",
    "planned_time": "ISO 8601格式的日期时间字符串"
  }
]
6. 至少拆解成5个步骤，不要超过10个步骤
7. planned_time要按照倒排方式分配，最后的步骤要在截止日期前完成
8. 只返回JSON，不要其他文字`
    }

    try {
      const response = await client.invoke(
        [
          {
            role: 'system',
            content: '你是一个专业的任务拆解助手，擅长将复杂的大目标拆解成具体可执行的小步骤。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        {
          model: 'doubao-seed-2-0-lite-260215',
          temperature: 0.7
        }
      )

      const content = response.content.trim()

      // 提取JSON部分
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('LLM返回的不是有效的JSON格式')
      }

      const steps = JSON.parse(jsonMatch[0])

      // 验证步骤格式
      if (!Array.isArray(steps)) {
        throw new Error('LLM返回的不是数组格式')
      }

      return steps.map((step: any, index: number) => ({
        title: step.title || `步骤${index + 1}`,
        description: step.description || '',
        planned_time: step.planned_time || null
      }))
    } catch (error) {
      console.error('LLM拆解任务失败:', error)

      // 返回默认步骤
      return [
        {
          title: '准备工作',
          description: '整理环境，准备开始任务'
        },
        {
          title: '第一步执行',
          description: '开始执行任务的第一步'
        },
        {
          title: '继续推进',
          description: '按照计划继续推进任务'
        },
        {
          title: '完成主要部分',
          description: '完成任务的主要部分'
        },
        {
          title: '检查收尾',
          description: '检查完成情况，做最后的调整'
        }
      ]
    }
  }
}
