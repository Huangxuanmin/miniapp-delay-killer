import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const AnalyzingCard = () => {
  return (
    <Card className="mt-4 border-slate-200 shadow-none rounded-2xl bg-white">
      <CardContent className="p-5">
        <View className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <View className="flex-1">
            <Skeleton className="h-3 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </View>
        </View>
        <View className="flex items-center justify-center gap-2 mt-5">
          <View className="w-1 h-1 rounded-full bg-indigo-500" />
          <Text className="block text-xs text-slate-500 tracking-wide">
            AI 正在分析任务，拆解为可执行的小步骤
          </Text>
        </View>
      </CardContent>
    </Card>
  )
}
