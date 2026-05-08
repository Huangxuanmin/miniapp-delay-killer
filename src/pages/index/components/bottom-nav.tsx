import { View, Text } from '@tarojs/components'
import { MessageCircle, ListTodo } from 'lucide-react-taro'

export type BottomTab = 'dialog' | 'tasks'

interface BottomNavProps {
  value: BottomTab
  onChange: (v: BottomTab) => void
}

const ITEMS: { key: BottomTab; label: string; Icon: typeof MessageCircle }[] = [
  { key: 'dialog', label: '对话', Icon: MessageCircle },
  { key: 'tasks', label: '任务', Icon: ListTodo }
]

export const BottomNav = ({ value, onChange }: BottomNavProps) => {
  return (
    <View
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const active = value === key
        return (
          <View
            key={key}
            className="flex-1 flex flex-col items-center justify-center py-3"
            onClick={() => onChange(key)}
          >
            <Icon size={22} color={active ? '#0f172a' : '#94a3b8'} strokeWidth={2} />
            <Text
              className={`block text-xs mt-1 ${
                active ? 'text-slate-900 font-semibold' : 'text-slate-400'
              }`}
            >
              {label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
