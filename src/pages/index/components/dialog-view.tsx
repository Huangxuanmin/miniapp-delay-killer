import { View } from '@tarojs/components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicModeForm } from './basic-mode-form'
import { AdvancedModeForm } from './advanced-mode-form'
import { AnalyzingCard } from './analyzing-card'
import type { TaskMode } from '../types'

interface DialogViewProps {
  mode: TaskMode
  onModeChange: (m: TaskMode) => void
  taskTitle: string
  target: string
  deadline: string
  loading: boolean
  analyzing: boolean
  onTitleChange: (v: string) => void
  onTargetChange: (v: string) => void
  onDeadlineChange: (v: string) => void
  onSubmit: () => void
}

export const DialogView = ({
  mode,
  onModeChange,
  taskTitle,
  target,
  deadline,
  loading,
  analyzing,
  onTitleChange,
  onTargetChange,
  onDeadlineChange,
  onSubmit
}: DialogViewProps) => {
  return (
    <View className="px-5 pt-6">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as TaskMode)}>
        <TabsList className="w-full bg-slate-50 border border-slate-200 rounded-xl p-1 mb-4">
          <TabsTrigger value="basic" className="font-hero flex-1 rounded-lg text-sm">
            基础模式
          </TabsTrigger>
          <TabsTrigger value="advanced" className="font-hero flex-1 rounded-lg text-sm">
            干大事模式
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicModeForm
            taskTitle={taskTitle}
            loading={loading}
            analyzing={analyzing}
            onTitleChange={onTitleChange}
            onSubmit={onSubmit}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedModeForm
            taskTitle={taskTitle}
            target={target}
            deadline={deadline}
            loading={loading}
            analyzing={analyzing}
            onTitleChange={onTitleChange}
            onTargetChange={onTargetChange}
            onDeadlineChange={onDeadlineChange}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>

      {analyzing && <AnalyzingCard />}
    </View>
  )
}
