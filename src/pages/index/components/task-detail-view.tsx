import { View, Text } from '@tarojs/components'
import { ChevronLeft } from 'lucide-react-taro'
import { TaskCard } from './task-card'
import type { Task } from '../types'

interface TaskDetailViewProps {
  task: Task
  onBack: () => void
  onToggleStep: (taskId: number, stepId: number, currentCompleted: boolean) => void
}

export const TaskDetailView = ({ task, onBack, onToggleStep }: TaskDetailViewProps) => {
  return (
    <View className="px-5 pt-4">
      <View
        className="flex items-center gap-1 mb-4 py-2"
        onClick={onBack}
      >
        <ChevronLeft size={20} color="#0f172a" strokeWidth={2} />
        <Text className="text-sm text-slate-900 font-medium">返回</Text>
      </View>
      <TaskCard task={task} onToggleStep={onToggleStep} />
    </View>
  )
}
