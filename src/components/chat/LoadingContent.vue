<template>
  <view class="loading-content">
    <view class="loading-content__text">思考中...</view>
  </view>
</template>

<script setup lang="ts">
// No props needed for now
</script>

<style lang="scss">
.loading-content {
  padding: 20rpx;
  position: relative;
  overflow: hidden;
  border-radius: 20rpx;
  background: rgba(0, 0, 0, 0.02);
  min-width: 200rpx;

  &__text {
    font-size: 28rpx;
    color: #666;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
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
    );
    background-size: 200% 100%;
    animation: flowingLight 2s infinite ease-in-out;
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
    animation: flowingLight 2s infinite ease-in-out;
    animation-delay: -1s;
    opacity: 0.8;
    z-index: 0;
  }
}

@keyframes flowingLight {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style> 