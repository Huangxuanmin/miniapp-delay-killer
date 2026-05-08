import { View, Text } from '@tarojs/components'
import { ChevronRight, Clock } from 'lucide-react-taro'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { EmptyTaskState } from './empty-task-state'
import { MUTED } from '../constants'
import type { Task } from '../types'

interface TaskListViewProps {
  tasks: Task[]
  onSelect: (id: number) => void
}

export const TaskListView = ({ tasks, onSelect }: TaskListViewProps) => {
  if (tasks.length === 0) {
    return (
      <View className="px-5 pt-6">
        <EmptyTaskState />
      </View>
    )
  }

  return (
    <View className="px-5 pt-6">
      <View className="flex items-center justify-between mb-3 px-1">
        <View className="flex items-center gap-2">
          <View className="w-1 h-4 rounded-full bg-slate-900" />
          <Text className="block text-sm font-semibold text-slate-900 tracking-wide">
            任务列表
          </Text>
        </View>
        <Text className="text-xs text-slate-400">{tasks.length} 项</Text>
      </View>

      <View className="space-y-3">
        {tasks.map((task) => {
          const total = task.steps.length
          const done = task.steps.filter((s) => s.completed).length
          const progress = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <Card
              key={task.id}
              className="border-slate-200 shadow-none rounded-2xl bg-white"
              onClick={() => onSelect(task.id)}
            >
              <CardContent className="p-4">
                <View className="flex items-start justify-between gap-3 mb-2">
                  <View className="flex-1">
                    <View className="flex items-center gap-2 mb-1 flex-wrap">
                      <Text className="block text-base font-semibold text-slate-900">
                        {task.title}
                      </Text>
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
                    {task.deadline && (
                      <View className="flex items-center gap-1">
                        <Clock size={12} color={MUTED} strokeWidth={2} />
                        <Text className="text-xs text-slate-500">
                          截止 {new Date(task.deadline).toLocaleDateString('zh-CN')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <ChevronRight size={18} color="#94a3b8" strokeWidth={2} />
                </View>

                <View className="flex items-center justify-between mb-2">
                  <Text className="text-xs text-slate-500 tracking-wide">
                    已完成 {done}/{total}
                  </Text>
                  <Text className="text-xs font-semibold text-slate-900">{progress}%</Text>
                </View>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          )
        })}
      </View>
    </View>
  )
}
