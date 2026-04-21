import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Circle, Clock, Target, Zap } from 'lucide-react-taro'
import './index.css'

interface Task {
  id: number
  title: string
  mode: 'basic' | 'advanced'
  target?: string
  deadline?: string
  created_at: string
  updated_at: string
  steps: TaskStep[]
}

interface TaskStep {
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

const IndexPage = () => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic')
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

  const calculateProgress = (steps: TaskStep[]) => {
    if (!steps || steps.length === 0) return 0
    const completed = steps.filter(s => s.completed).length
    return Math.round((completed / steps.length) * 100)
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="flex items-center gap-3">
          <Zap size={32} color="#f97316" />
          <View>
            <Text className="block text-2xl font-bold text-gray-900">拖延症消除神器</Text>
            <Text className="block text-sm text-gray-500">把大目标拆成小步骤，一步一步达成</Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'basic' | 'advanced')}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="basic" className="flex-1">基础模式</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">干大事模式</TabsTrigger>
          </TabsList>

          <CardContent className="space-y-4">
            {/* 基础模式 */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">输入想要完成的事情</CardTitle>
                  <CardDescription className="text-sm">我会帮你把它拆解成具体的小步骤</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <View>
                    <Text className="block text-sm font-medium text-gray-900 mb-2">任务标题</Text>
                    <Input
                      placeholder="例如：完成论文撰写"
                      value={taskTitle}
                      onInput={(e) => setTaskTitle(e.detail.value)}
                    />
                  </View>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createTask}
                    disabled={loading || !taskTitle.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {analyzing ? '正在拆解任务...' : '开始拆解'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* 干大事模式 */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target size={20} color="#f97316" />
                    设置目标与截止时间
                  </CardTitle>
                  <CardDescription className="text-sm">我会根据DDL倒排时间，帮你制定详细计划</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <View>
                    <Text className="block text-sm font-medium text-gray-900 mb-2">任务标题</Text>
                    <Input
                      placeholder="例如：准备期末考试"
                      value={taskTitle}
                      onInput={(e) => setTaskTitle(e.detail.value)}
                    />
                  </View>
                  <View>
                    <Text className="block text-sm font-medium text-gray-900 mb-2">目标描述</Text>
                    <Textarea
                      placeholder="例如：考到85分以上，涵盖所有章节知识点"
                      value={target}
                      onInput={(e) => setTarget(e.detail.value)}
                      style={{ minHeight: '80px' }}
                    />
                  </View>
                  <View>
                    <Text className="block text-sm font-medium text-gray-900 mb-2">截止时间</Text>
                    <Input
                      placeholder="选择截止日期"
                      value={deadline}
                      onInput={(e) => setDeadline(e.detail.value)}
                    />
                  </View>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createTask}
                    disabled={loading || !taskTitle.trim() || !target.trim() || !deadline}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {analyzing ? '正在制定计划...' : '制定倒排计划'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>

        {/* 分析中状态 */}
        {analyzing && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <View className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <View className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </View>
              </View>
              <Text className="block text-sm text-gray-500 mt-4 text-center">
                AI正在分析任务，拆解成可执行的小步骤...
              </Text>
            </CardContent>
          </Card>
        )}

        {/* 任务列表 */}
        <View className="mt-6 space-y-4">
          {tasks.length === 0 && !analyzing && (
            <Card>
              <CardContent className="p-8 text-center">
                <Circle size={48} color="#d1d5db" className="mx-auto mb-4" />
                <Text className="block text-lg font-medium text-gray-900 mb-2">还没有任务</Text>
                <Text className="block text-sm text-gray-500">输入你的第一个目标，开始行动吧！</Text>
              </CardContent>
            </Card>
          )}

          {tasks.map((task) => {
            const progress = calculateProgress(task.steps)
            const completedSteps = task.steps.filter(s => s.completed).length

            return (
              <Card key={task.id}>
                <CardHeader>
                  <View className="flex items-start justify-between">
                    <View className="flex-1">
                      <View className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <Badge variant={task.mode === 'basic' ? 'default' : 'secondary'}>
                          {task.mode === 'basic' ? '基础模式' : '干大事模式'}
                        </Badge>
                      </View>
                      {task.mode === 'advanced' && task.target && (
                        <CardDescription className="text-sm mb-2">{task.target}</CardDescription>
                      )}
                      {task.deadline && (
                        <View className="flex items-center gap-1">
                          <Clock size={14} color="#f97316" />
                          <Text className="text-xs text-orange-500">
                            截止时间: {new Date(task.deadline).toLocaleDateString('zh-CN')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* 进度条 */}
                  <View className="mt-3">
                    <View className="flex items-center justify-between mb-2">
                      <Text className="text-xs font-medium text-gray-700">完成进度</Text>
                      <Text className="text-xs font-bold text-orange-500">{progress}%</Text>
                    </View>
                    <Progress value={progress} className="h-2" />
                    <Text className="text-xs text-gray-500 mt-1">
                      已完成 {completedSteps}/{task.steps.length} 个步骤
                    </Text>
                  </View>
                </CardHeader>

                {/* 步骤列表 */}
                <CardContent className="space-y-3">
                  {task.steps.map((step) => (
                    <View
                      key={step.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <Checkbox
                        checked={step.completed}
                        onCheckedChange={() => toggleStep(task.id, step.id, step.completed)}
                      >
                        <View className="flex-1">
                          <Text className={`block text-sm font-medium ${step.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {step.title}
                          </Text>
                          {step.description && (
                            <Text className={`block text-xs mt-1 ${step.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                              {step.description}
                            </Text>
                          )}
                          {task.mode === 'advanced' && step.planned_time && (
                            <View className="flex items-center gap-1 mt-1">
                              <Clock size={12} color="#3b82f6" />
                              <Text className="text-xs text-blue-500">
                                计划完成: {new Date(step.planned_time).toLocaleString('zh-CN')}
                              </Text>
                            </View>
                          )}
                        </View>
                      </Checkbox>
                      {step.completed && (
                        <Check size={20} color="#22c55e" />
                      )}
                    </View>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default IndexPage
