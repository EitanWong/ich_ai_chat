<template>
  <view
    class="scroll-to-bottom"
    v-if="show"
    @tap="handleClick"
    :class="{
      'scroll-to-bottom--clicking': isClicking,
      'scroll-to-bottom--hidden': !show,
    }"
  >
    <text class="scroll-to-bottom__icon">▼</text>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const isClicking = ref(false)
let clickTimer: number | null = null
let clickCount = 0
const MAX_CLICKS = 3 // 最大连续点击次数
const CLICK_RESET_TIME = 1000 // 点击计数重置时间（ms）
const CLICK_INTERVAL = 300 // 点击间隔时间（ms）

const handleClick = () => {
  if (isClicking.value) return // 防止重复点击

  isClicking.value = true
  clickCount++

  // 发送点击事件
  emit('click')

  // 清除之前的定时器
  if (clickTimer) {
    clearTimeout(clickTimer)
  }

  // 设置新的定时器
  clickTimer = setTimeout(() => {
    isClicking.value = false

    // 重置点击计数
    setTimeout(() => {
      clickCount = 0
    }, CLICK_RESET_TIME)
  }, CLICK_INTERVAL)

  // 如果连续点击次数过多，强制滚动到底部
  if (clickCount >= MAX_CLICKS) {
    // 触发额外的滚动事件
    setTimeout(() => {
      emit('click')
    }, CLICK_INTERVAL)
  }
}

// 监听显示状态变化
watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      // 当按钮隐藏时，重置状态
      isClicking.value = false
      clickCount = 0
      if (clickTimer) {
        clearTimeout(clickTimer)
      }
    }
  },
)

// 组件卸载时清理定时器
onUnmounted(() => {
  if (clickTimer) {
    clearTimeout(clickTimer)
  }
})
</script>

<style lang="scss">
.scroll-to-bottom {
  position: absolute;
  top: -80rpx;
  right: 50rpx;
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4rpx 12rpx rgba(0, 0, 0, 0.15),
    0 8rpx 24rpx rgba(0, 0, 0, 0.15),
    0 12rpx 36rpx rgba(0, 0, 0, 0.1),
    inset 0 0 0 1rpx rgba(255, 255, 255, 0.2);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform, opacity;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
    box-shadow:
      0 2rpx 8rpx rgba(0, 0, 0, 0.15),
      0 4rpx 16rpx rgba(0, 0, 0, 0.15),
      0 6rpx 24rpx rgba(0, 0, 0, 0.1),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.3);
  }

  &--clicking {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
    box-shadow:
      0 2rpx 8rpx rgba(0, 0, 0, 0.15),
      0 4rpx 16rpx rgba(0, 0, 0, 0.15),
      0 6rpx 24rpx rgba(0, 0, 0, 0.1),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.3);
  }

  &--hidden {
    opacity: 0;
    transform: translateY(20rpx);
    pointer-events: none;
  }

  &__icon {
    color: rgba(255, 255, 255, 0.9);
    font-size: 32rpx;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
