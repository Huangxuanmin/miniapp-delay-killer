import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { PageHeader } from './components/page-header'
import { BasicModeForm } from './components/basic-mode-form'
import { AdvancedModeForm } from './components/advanced-mode-form'
import { AnalyzingCard } from './components/analyzing-card'
import { EmptyTaskState } from './components/empty-task-state'
import { TaskCard } from './components/task-card'
import { ModeSwitcher } from './components/mode-switcher'
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

  useLoad(() => {
    fetchTasks()
  })

  const fetchTasks = async () => {
    try {
      console.log('[前端] 开始获取任务列表')
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
      console.log('[前端] 开始创建任务', { title: taskTitle, mode, target, deadline })

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

      if (res.data?.data) {
        await fetchTasks()
        setTaskTitle('')
        setTarget('')
        setDeadline('')
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
      console.log('[前端] 切换步骤状态', { taskId, stepId, currentCompleted })

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

  return (
    <View className="min-h-screen bg-slate-50 pb-32">
      <PageHeader />

      <Tabs value={mode} onValueChange={(v) => setMode(v as TaskMode)}>
        <View className="px-5 pt-6">
          {/* Mode Tabs（TabsList 已移至页面底部常驻） */}
          <TabsContent value="basic">
            <BasicModeForm
              taskTitle={taskTitle}
              loading={loading}
              analyzing={analyzing}
              onTitleChange={setTaskTitle}
              onSubmit={createTask}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedModeForm
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
          </TabsContent>

          {analyzing && <AnalyzingCard />}

          {/* 任务列表标题 */}
          {tasks.length > 0 && (
            <View className="flex items-center justify-between mt-8 mb-3 px-1">
              <View className="flex items-center gap-2">
                <View className="w-1 h-4 rounded-full bg-slate-900" />
                <Text className="block text-sm font-semibold text-slate-900 tracking-wide">任务列表</Text>
              </View>
              <Text className="text-xs text-slate-400">{tasks.length} 项</Text>
            </View>
          )}

          {/* 任务列表 */}
          <View className="space-y-3">
            {tasks.length === 0 && !analyzing && <EmptyTaskState />}

            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggleStep={toggleStep} />
            ))}
          </View>
        </View>

        <ModeSwitcher />
      </Tabs>
    </View>
  )
}

export default IndexPage
