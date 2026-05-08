import { View, Text } from '@tarojs/components'
import { Sparkles } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ACCENT } from '../constants'

interface BasicModeFormProps {
  taskTitle: string
  loading: boolean
  analyzing: boolean
  onTitleChange: (value: string) => void
  onSubmit: () => void
}

export const BasicModeForm = ({
  taskTitle,
  loading,
  analyzing,
  onTitleChange,
  onSubmit
}: BasicModeFormProps) => {
  return (
    <Card className="border-slate-200 shadow-none rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <View className="flex items-center gap-2 mb-1">
          <Sparkles size={16} color={ACCENT} strokeWidth={2} />
          <CardTitle className="font-hero text-base font-semibold text-slate-900">输入想要完成的事情</CardTitle>
        </View>
        <CardDescription className="text-xs text-slate-500">
          我会帮你把它拆解成具体的小步骤
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <View>
          <Text className="block text-xs font-medium text-slate-600 mb-2 tracking-wide">任务标题</Text>
          <Textarea
            className="w-full h-24 bg-transparent text-lg text-slate-900"
            placeholder="例如：完成论文撰写"
            placeholderClass="text-slate-300"
            value={taskTitle}
            maxlength={200}
            onInput={(e) => onTitleChange(e.detail.value)}
          />
        </View>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSubmit}
          disabled={loading || !taskTitle.trim()}
          className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl h-11 text-sm font-medium"
        >
          {analyzing ? '正在拆解任务…' : '开始拆解'}
        </Button>
      </CardFooter>
    </Card>
  )
}
