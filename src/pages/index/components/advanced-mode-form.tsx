import { View, Text, Picker } from '@tarojs/components'
import { Clock, Target } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ACCENT, MUTED } from '../constants'

interface AdvancedModeFormProps {
  taskTitle: string
  target: string
  deadline: string
  loading: boolean
  analyzing: boolean
  onTitleChange: (value: string) => void
  onTargetChange: (value: string) => void
  onDeadlineChange: (value: string) => void
  onSubmit: () => void
}

export const AdvancedModeForm = ({
  taskTitle,
  target,
  deadline,
  loading,
  analyzing,
  onTitleChange,
  onTargetChange,
  onDeadlineChange,
  onSubmit
}: AdvancedModeFormProps) => {
  return (
    <Card className="border-slate-200 shadow-none rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <View className="flex items-center gap-2 mb-1">
          <Target size={16} color={ACCENT} strokeWidth={2} />
          <CardTitle className="font-hero text-base font-semibold text-slate-900">设置目标与截止时间</CardTitle>
        </View>
        <CardDescription className="text-xs text-slate-500">
          根据 DDL 倒排时间，生成详细计划
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <View>
          <Text className="block text-xs font-medium text-slate-600 mb-2 tracking-wide">任务标题</Text>
          <Textarea
            className="w-full h-24 bg-transparent text-lg text-slate-900"
            placeholder="例如：准备期末考试"
            placeholderClass="text-slate-300"
            value={taskTitle}
            maxlength={200}
            onInput={(e) => onTitleChange(e.detail.value)}
          />
        </View>
        <View>
          <Text className="block text-xs font-medium text-slate-600 mb-2 tracking-wide">目标描述</Text>
          <Textarea
            placeholder="例如：考到85分以上，涵盖所有章节知识点"
            value={target}
            onInput={(e) => onTargetChange(e.detail.value)}
          />
        </View>
        <View>
          <Text className="block text-xs font-medium text-slate-600 mb-2 tracking-wide">截止时间</Text>
          <Picker
            mode="date"
            value={deadline}
            start={new Date().toISOString().slice(0, 10)}
            onChange={(e) => onDeadlineChange(e.detail.value)}
          >
            <View className="w-full bg-slate-50 border border-transparent rounded-2xl px-5 py-7 transition-colors active:border-slate-300">
              <View className="flex items-center justify-between">
                <Text className={`block text-lg ${deadline ? 'text-slate-900' : 'text-slate-300'}`}>
                  {deadline || '选择截止日期'}
                </Text>
                <Clock size={18} color={MUTED} strokeWidth={2} />
              </View>
            </View>
          </Picker>
        </View>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSubmit}
          disabled={loading || !taskTitle.trim() || !target.trim() || !deadline}
          className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl h-11 text-sm font-medium"
        >
          {analyzing ? '正在制定计划…' : '制定倒排计划'}
        </Button>
      </CardFooter>
    </Card>
  )
}
