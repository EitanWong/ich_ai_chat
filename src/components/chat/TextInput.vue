<template>
  <view class="text-input">
    <textarea
      v-model="inputValue"
      class="text-input__textarea"
      :auto-height="true"
      :show-confirm-bar="false"
      :cursor-spacing="20"
      :adjust-position="true"
      :disable-default-padding="true"
      :confirm-type="'send'"
      placeholder="请输入要查询的内容..."
      @input="handleInput"
      @confirm="handleConfirm"
      @keydown="handleKeyDown"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useChatStore } from '@/store/chat'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send', text: string): void
  (e: 'height-change', height: number): void
}>()

const store = useChatStore()
const inputValue = ref(props.modelValue)
const MAX_HEIGHT = 120 // 最大高度限制

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
  },
)

// 监听内部值变化
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// 处理输入
const handleInput = (e: any) => {
  const height = Math.min(e.detail.height, MAX_HEIGHT)
  emit('height-change', height)
}

// 处理确认（移动端）
const handleConfirm = async () => {
  if (process.env.UNI_PLATFORM === 'h5') return // 在桌面端不处理回车发送
  await sendMessage()
}

// 处理键盘事件（桌面端）
const handleKeyDown = async (e: KeyboardEvent) => {
  if (process.env.UNI_PLATFORM === 'h5' && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    await sendMessage()
  }
}

// 发送消息
const sendMessage = async () => {
  const text = inputValue.value.trim()
  if (!text) return

  // 立即清空输入框
  inputValue.value = ''
  emit('height-change', 20) // 使用固定的最小高度
  emit('send', text)
}
</script>

<style lang="scss">
.text-input {
  flex: 1;
  background-color: #f8f8f8;
  border-radius: 36rpx;
  margin-left: 16rpx;
  box-shadow:
    0 8rpx 16rpx rgba(64, 158, 255, 0.1),
    0 16rpx 32rpx rgba(64, 158, 255, 0.08),
    0 0 0 1rpx rgba(64, 158, 255, 0.1);
  display: flex;
  align-items: flex-start;

  &__textarea {
    width: 100%;
    min-height: 20px;
    max-height: 120px;
    background: transparent;
    margin: 0;
    border: none;
    outline: none;
    resize: none;
    overflow-y: auto;
    display: block;
    font-size: 24rpx;
    line-height: 1.1;
    padding-top: 32rpx;
    padding-left: 28rpx;
    padding-right: 10rpx;
    padding-bottom: 24rpx;

    &::placeholder {
      color: #d8d8d8;
      font-size: 24rpx;
    }

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
}
</style>
