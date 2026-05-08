import { View, Text } from '@tarojs/components'
import { Zap } from 'lucide-react-taro'

export const PageHeader = () => {
  return (
    <View className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* 背景网格装饰 */}
      <View
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(79,70,229,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <View className="relative px-6 pt-10 pb-8">
        <View className="flex items-center gap-3 mb-4">
          <View className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900">
            <Zap size={20} color="#ffffff" strokeWidth={2} />
          </View>
          <View className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
            <View className="w-2 h-2 rounded-full bg-indigo-500" />
            <Text className="text-xs text-indigo-600 tracking-wider">AI · TASK BREAKER</Text>
          </View>
        </View>
        <Text className="font-hero block text-3xl text-slate-900 mb-2">
          拖延症消除神器
        </Text>
        <Text className="font-hero block text-sm text-slate-500 leading-relaxed">
          把大目标拆成小步骤 — 一次只做一件事
        </Text>
      </View>
    </View>
  )
}
