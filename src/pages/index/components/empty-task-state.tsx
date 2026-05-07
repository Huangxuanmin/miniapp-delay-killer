import { View, Text } from '@tarojs/components'
import { Circle } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { MUTED } from '../constants'

export const EmptyTaskState = () => {
  return (
    <Card className="mt-6 border-dashed border-slate-300 shadow-none rounded-2xl bg-white">
      <CardContent className="p-10 text-center">
        <View className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 mx-auto mb-4">
          <Circle size={24} color={MUTED} strokeWidth={1.5} />
        </View>
        <Text className="block text-sm font-medium text-slate-700 mb-1">还没有任务</Text>
        <Text className="block text-xs text-slate-400">输入你的第一个目标，开始行动吧</Text>
      </CardContent>
    </Card>
  )
}
