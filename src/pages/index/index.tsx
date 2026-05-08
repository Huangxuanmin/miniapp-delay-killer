import { useState } from 'react'
import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { USE_MOCK, mockCreateTask, mockFetchTasks, mockToggleStep } from './mock'
import { PageHeader } from './components/page-header'
import { BottomNav, type BottomTab } from './components/bottom-nav'
import { DialogView } from './components/dialog-view'
import { TaskListView } from './components/task-list-view'
import { TaskDetailView } from './components/task-detail-view'
import type { Task, TaskMode } from './types'
import './index.css'

const IndexPage = () => {
  const [mode, setMode] = useState<TaskMode>('basic')
  const [taskTitle, setTaskTitle] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<BottomTab>('dialog')
  const [detailTaskId, setDetailTaskId] = useState<number | null>(null)

  useLoad(() => {
    fetchTasks()
  })

  const fetchTasks = async () => {
    try {
      console.log('[前端] 开始获取任务列表', USE_MOCK ? '(mock)' : '')

      if (USE_MOCK) {
        const list = await mockFetchTasks()
        setTasks(list)
        return
      }

      const res = await Network.request({
        url: '/api/tasks',
        method: 'GET'
      })
      console.log('[前端] 获取任务列表响应:', res.data)

      if (res.data?.data) {
        setTasks(res.data.data)
      }
    } catch (error) {
      console.error('[前端] 获取任务列表失败:', error)
    }
  }

  const createTask = async () => {
    if (!taskTitle.trim()) return

    setLoading(true)
    setAnalyzing(true)

    try {
      console.log('[前端] 开始创建任务', { title: taskTitle, mode, target, deadline }, USE_MOCK ? '(mock)' : '')

      let newTask: Task | null = null

      if (USE_MOCK) {
        newTask = await mockCreateTask({
          title: taskTitle,
          mode,
          target: mode === 'advanced' ? target : undefined,
          deadline: mode === 'advanced' ? deadline : undefined
        })
      } else {
        const body: any = {
          title: taskTitle,
          mode
        }

        if (mode === 'advanced') {
          body.target = target
          body.deadline = deadline
        }

        const res = await Network.request({
          url: '/api/tasks',
          method: 'POST',
          data: body
        })

        console.log('[前端] 创建任务响应:', res.data)
        newTask = res.data?.data ?? null
      }

      await fetchTasks()
      setTaskTitle('')
      setTarget('')
      setDeadline('')

      if (newTask) {
        setDetailTaskId(newTask.id)
        setActiveTab('tasks')
      }
    } catch (error) {
      console.error('[前端] 创建任务失败:', error)
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  const toggleStep = async (taskId: number, stepId: number, currentCompleted: boolean) => {
    try {
      console.log('[前端] 切换步骤状态', { taskId, stepId, currentCompleted }, USE_MOCK ? '(mock)' : '')

      if (USE_MOCK) {
        await mockToggleStep(taskId, stepId)
        await fetchTasks()
        return
      }

      const res = await Network.request({
        url: `/api/tasks/${taskId}/steps/${stepId}/toggle`,
        method: 'POST'
      })

      console.log('[前端] 切换步骤状态响应:', res.data)

      if (res.data?.data) {
        await fetchTasks()
      }
    } catch (error) {
      console.error('[前端] 切换步骤状态失败:', error)
    }
  }

  const handleTabChange = (tab: BottomTab) => {
    setActiveTab(tab)
    setDetailTaskId(null)
  }

  const detailTask =
    detailTaskId !== null ? tasks.find((t) => t.id === detailTaskId) ?? null : null

  return (
    <View className="min-h-screen bg-slate-50 pb-24">
      <PageHeader />

      {detailTask ? (
        <TaskDetailView
          task={detailTask}
          onBack={() => setDetailTaskId(null)}
          onToggleStep={toggleStep}
        />
      ) : activeTab === 'dialog' ? (
        <DialogView
          mode={mode}
          onModeChange={setMode}
          taskTitle={taskTitle}
          target={target}
          deadline={deadline}
          loading={loading}
          analyzing={analyzing}
          onTitleChange={setTaskTitle}
          onTargetChange={setTarget}
          onDeadlineChange={setDeadline}
          onSubmit={createTask}
        />
      ) : (
        <TaskListView tasks={tasks} onSelect={(id) => setDetailTaskId(id)} />
      )}

      <BottomNav value={activeTab} onChange={handleTabChange} />
    </View>
  )
}

export default IndexPage
