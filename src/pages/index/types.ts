export interface Task {
  id: number
  title: string
  mode: 'basic' | 'advanced'
  target?: string
  deadline?: string
  created_at: string
  updated_at: string
  steps: TaskStep[]
}

export interface TaskStep {
  id: number
  task_id: number
  title: string
  description?: string
  order_index: number
  completed: boolean
  planned_time?: string
  created_at: string
  updated_at: string
}

export type TaskMode = 'basic' | 'advanced'
