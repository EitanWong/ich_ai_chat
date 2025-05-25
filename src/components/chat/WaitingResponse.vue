<template>
  <view class="waiting-response">
    <view class="waiting-response__content">
      <view class="waiting-response__loading"></view>
      <text class="waiting-response__text">请等待回复完毕...</text>
    </view>
    <StopButton @click="$emit('stop')" />
  </view>
</template>

<script setup lang="ts">
import StopButton from './StopButton.vue'

defineEmits<{
  (e: 'stop'): void
}>()
</script>

<style lang="scss">
.waiting-response {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 0 20rpx;
  position: relative;
  z-index: 2;

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    height: 80rpx;
    background-color: #f8f8f8;
    border-radius: 36rpx;
    box-shadow:
      0 8rpx 16rpx rgba(0, 0, 0, 0.05),
      0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  }

  &__loading {
    width: 32rpx;
    height: 32rpx;
    border: 4rpx solid #e0e0e0;
    border-top-color: #666;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__text {
    font-size: 28rpx;
    color: #666;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
