import { View } from '@tarojs/components'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ModeSwitcher = () => {
  return (
    <View
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0'
      }}
    >
      <View className="px-5 pt-3 pb-5">
        <TabsList className="w-full bg-slate-50 border border-slate-200 rounded-xl p-1">
          <TabsTrigger value="basic" className="font-hero flex-1 rounded-lg text-sm">
            基础模式
          </TabsTrigger>
          <TabsTrigger value="advanced" className="font-hero flex-1 rounded-lg text-sm">
            干大事模式
          </TabsTrigger>
        </TabsList>
      </View>
    </View>
  )
}
