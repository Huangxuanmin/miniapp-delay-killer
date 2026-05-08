import { View, Text } from '@tarojs/components'
import { Check, Clock } from 'lucide-react-taro'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { ACCENT_SOFT, MUTED } from '../constants'
import type { Task, TaskStep } from '../types'

interface TaskCardProps {
  task: Task
  onToggleStep: (taskId: number, stepId: number, currentCompleted: boolean) => void
}

const calculateProgress = (steps: TaskStep[]) => {
  if (!steps || steps.length === 0) return 0
  const completed = steps.filter(s => s.completed).length
  return Math.round((completed / steps.length) * 100)
}

export const TaskCard = ({ task, onToggleStep }: TaskCardProps) => {
  const progress = calculateProgress(task.steps)
  const completedSteps = task.steps.filter(s => s.completed).length

  return (
    <Card className="border-slate-200 shadow-none rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <View className="flex items-start justify-between gap-3 mb-3">
          <View className="flex-1">
            <View className="flex items-center gap-2 mb-2 flex-wrap">
              <CardTitle className="text-base font-semibold text-slate-900">{task.title}</CardTitle>
              <Badge
                variant="secondary"
                className={
                  task.mode === 'basic'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200 text-xs'
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs'
                }
              >
                {task.mode === 'basic' ? '基础' : '干大事'}
              </Badge>
            </View>
            {task.mode === 'advanced' && task.target && (
              <CardDescription className="text-xs text-slate-500 leading-relaxed mb-2">
                {task.target}
              </CardDescription>
            )}
            {task.deadline && (
              <View className="flex items-center gap-1">
                <Clock size={12} color={MUTED} strokeWidth={2} />
                <Text className="text-xs text-slate-500">
                  截止 {new Date(task.deadline).toLocaleDateString('zh-CN')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 进度条 */}
        <View className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3">
          <View className="flex items-center justify-between mb-2">
            <Text className="text-xs text-slate-500 tracking-wide">
              已完成 {completedSteps}/{task.steps.length}
            </Text>
            <Text className="text-xs font-semibold text-slate-900">{progress}%</Text>
          </View>
          <Progress value={progress} className="h-2" />
        </View>
      </CardHeader>

      {/* 步骤列表 */}
      <CardContent className="space-y-2">
        {task.steps.map((step, idx) => (
          <View
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              step.completed
                ? 'border-slate-100 bg-slate-50 bg-opacity-60'
                : 'border-slate-200 bg-white'
            }`}
            onClick={() => onToggleStep(task.id, step.id, step.completed)}
          >
            <View className="shrink-0 mt-1">
              <Checkbox checked={step.completed} />
            </View>
            <View className="flex-1">
              <View className="flex items-center gap-2 mb-1">
                <Text className="text-xs font-mono text-slate-400">
                  {String(idx + 1).padStart(2, '0')}
                </Text>
                <Text
                  className={`block text-sm font-medium ${
                    step.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}
                >
                  {step.title}
                </Text>
              </View>
              {step.description && (
                <Text
                  className={`block text-xs leading-relaxed mt-1 ${
                    step.completed ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {step.description}
                </Text>
              )}
              {task.mode === 'advanced' && step.planned_time && (
                <View className="flex items-center gap-1 mt-2">
                  <Clock size={10} color={ACCENT_SOFT} strokeWidth={2} />
                  <Text className="text-xs text-indigo-500">
                    {new Date(step.planned_time).toLocaleString('zh-CN')}
                  </Text>
                </View>
              )}
            </View>
            {step.completed && (
              <View className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900">
                <Check size={12} color="#ffffff" strokeWidth={3} />
              </View>
            )}
          </View>
        ))}
      </CardContent>
    </Card>
  )
}
