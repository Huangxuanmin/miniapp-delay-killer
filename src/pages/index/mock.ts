import type { Task, TaskMode, TaskStep } from './types'

// 本地开发 mock 开关：为 true 时前端不走后端接口，改用内存数据
export const USE_MOCK = true

const MOCK_DELAY = 1500

let taskIdSeq = 1
let stepIdSeq = 1
const mockTasks: Task[] = []

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const generateSteps = (taskId: number, title: string, mode: TaskMode): TaskStep[] => {
  const now = new Date().toISOString()
  const templates = mode === 'advanced'
    ? [
        { title: `梳理「${title}」的整体目标与关键里程碑`, description: '拆分为阶段性成果，明确可衡量指标', planned_time: '30 分钟' },
        { title: '收集背景资料与参考', description: '整理关键资料、案例与依赖项', planned_time: '1 小时' },
        { title: '制定每日推进计划', description: '分配到每天的具体执行窗口', planned_time: '40 分钟' },
        { title: '执行核心产出', description: '聚焦完成最重要的那 20% 工作', planned_time: '2 小时' },
        { title: '复盘与打磨', description: '自检、修订、润色，达到交付标准', planned_time: '1 小时' }
      ]
    : [
        { title: `明确「${title}」的第一步是什么`, description: '用一句话写出你现在能动手做的最小动作' },
        { title: '花 10 分钟开始', description: '不求完美，先启动，打破拖延惯性' },
        { title: '继续推进 25 分钟', description: '一个番茄钟的专注时段' },
        { title: '短暂休息并回顾进度', description: '记录已完成与剩余部分' }
      ]

  return templates.map((tpl, index) => ({
    id: stepIdSeq++,
    task_id: taskId,
    title: tpl.title,
    description: tpl.description,
    order_index: index,
    completed: false,
    planned_time: (tpl as { planned_time?: string }).planned_time,
    created_at: now,
    updated_at: now
  }))
}

export const mockFetchTasks = async (): Promise<Task[]> => {
  await sleep(100)
  return [...mockTasks]
}

export interface MockCreateTaskInput {
  title: string
  mode: TaskMode
  target?: string
  deadline?: string
}

export const mockCreateTask = async (input: MockCreateTaskInput): Promise<Task> => {
  await sleep(MOCK_DELAY)
  const now = new Date().toISOString()
  const id = taskIdSeq++
  const task: Task = {
    id,
    title: input.title,
    mode: input.mode,
    target: input.target,
    deadline: input.deadline,
    created_at: now,
    updated_at: now,
    steps: generateSteps(id, input.title, input.mode)
  }
  mockTasks.unshift(task)
  return task
}

export const mockToggleStep = async (taskId: number, stepId: number): Promise<Task | null> => {
  await sleep(120)
  const task = mockTasks.find((t) => t.id === taskId)
  if (!task) return null
  const step = task.steps.find((s) => s.id === stepId)
  if (!step) return null
  step.completed = !step.completed
  step.updated_at = new Date().toISOString()
  task.updated_at = step.updated_at
  return task
}
