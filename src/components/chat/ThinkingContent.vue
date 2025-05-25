<template>
  <view class="thinking-content">
    <view class="thinking-content__header" 
          @tap="toggleCollapse"
          :class="{ 'thinking-content__header--thinking': isThinking }">
      <view class="thinking-content__left">
        <text class="thinking-content__icon-text">💭</text>
        <text class="thinking-content__text">{{ isThinking ? '思考中...' : '已深度思考' }}</text>
      </view>
      <view class="thinking-content__arrow" :class="{ 'thinking-content__arrow--collapsed': isCollapsed }">
        <text class="thinking-content__arrow-text">{{ isCollapsed ? '▼' : '▲' }}</text>
      </view>
    </view>
    <view class="thinking-content__content" v-show="!isCollapsed">
      <text class="thinking-content__content-text">{{ content || '正在思考中...' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isThinking?: boolean
  content?: string
  isCollapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isCollapsed', value: boolean): void
}>()

const toggleCollapse = () => {
  emit('update:isCollapsed', !props.isCollapsed)
}

// 监听思考状态变化
watch(() => props.isThinking, (newValue) => {
  // 可以在这里添加额外的状态变化逻辑
  console.log('思考状态变化:', newValue)
})
</script>

<style lang="scss">
.thinking-content {
  margin-top: 10rpx;
  padding-bottom: 10rpx;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    border-radius: 20rpx;
    background-color: var(--chat-bg-color);
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05), 0 4rpx 8rpx rgba(0, 0, 0, 0.05), 0 8rpx 16rpx rgba(0, 0, 0, 0.05), 0 16rpx 32rpx rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &:active {
      background-color: rgba(0, 0, 0, 0.02);
    }

    &--thinking {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.03) 10%,
            rgba(0, 0, 0, 0.08) 20%,
            rgba(0, 0, 0, 0.12) 30%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.18) 50%,
            rgba(0, 0, 0, 0.15) 60%,
            rgba(0, 0, 0, 0.12) 70%,
            rgba(0, 0, 0, 0.08) 80%,
            rgba(0, 0, 0, 0.03) 90%,
            transparent 100%
          ),
          radial-gradient(
            circle at 50% 50%,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.05) 30%,
            transparent 70%
          );
        background-size: 200% 100%, 100% 100%;
        animation: flowingLight 3s infinite ease-in-out;
        opacity: 0.9;
        z-index: 0;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(0, 0, 0, 0.05) 15%,
          rgba(0, 0, 0, 0.1) 25%,
          rgba(0, 0, 0, 0.15) 35%,
          rgba(0, 0, 0, 0.2) 45%,
          rgba(0, 0, 0, 0.22) 50%,
          rgba(0, 0, 0, 0.2) 55%,
          rgba(0, 0, 0, 0.15) 65%,
          rgba(0, 0, 0, 0.1) 75%,
          rgba(0, 0, 0, 0.05) 85%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: flowingLight 3s infinite ease-in-out;
        animation-delay: -1.5s;
        opacity: 0.8;
        z-index: 0;
      }
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12rpx;
    position: relative;
    z-index: 1;
  }

  &__icon-text {
    font-size: 24rpx;
  }

  &__text {
    font-size: 24rpx;
    color: #666;
  }

  &__arrow {
    width: 20rpx;
    height: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(102, 102, 102, 0.6);
    position: relative;
    z-index: 1;
  }

  &__arrow-text {
    font-size: 20rpx;
    transition: transform 0.3s ease;
  }

  &__content {
    padding: 20rpx 20rpx 20rpx 40rpx;
    min-height: 40rpx;
    border-left: 4rpx solid rgba(102, 102, 102, 0.2);
    margin-left: 20rpx;
  }

  &__content-text {
    font-size: 26rpx;
    color: rgba(102, 102, 102, 0.6);
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

@keyframes flowingLight {
  0% {
    background-position: 200% 0, 0 0;
    filter: blur(1px);
  }
  50% {
    filter: blur(1.5px);
  }
  100% {
    background-position: -200% 0, 0 0;
    filter: blur(1px);
  }
}
</style> 