<template>
  <view class="recording-status">
    <view class="recording-status__content">
      <view class="recording-status__waves">
        <view class="wave" v-for="i in 3" :key="i"></view>
      </view>
      <text class="recording-status__text">正在录音...</text>
    </view>
  </view>
</template>

<style lang="scss">
.recording-status {
  flex: 1;
  background-color: #f8f8f8;
  border-radius: 36rpx;
  margin-left: 16rpx;
  box-shadow:
    0 8rpx 16rpx rgba(64, 158, 255, 0.1),
    0 16rpx 32rpx rgba(64, 158, 255, 0.08),
    0 0 0 1rpx rgba(64, 158, 255, 0.1);
  display: flex;
  align-items: center;
  animation: glow 2s ease-in-out infinite;

  &__content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    padding: 32rpx 28rpx;
  }

  &__waves {
    display: flex;
    align-items: center;
    gap: 8rpx;
    height: 30rpx;

    .wave {
      width: 4rpx;
      height: 100%;
      background-color: #409eff;
      border-radius: 2rpx;
      animation: wave 1s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  &__text {
    font-size: 28rpx;
    color: #409eff;
  }
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 8rpx 16rpx rgba(64, 158, 255, 0.2),
      0 16rpx 32rpx rgba(64, 158, 255, 0.15),
      0 0 0 1rpx rgba(64, 158, 255, 0.2);
  }
  50% {
    box-shadow:
      0 8rpx 16rpx rgba(64, 158, 255, 0.4),
      0 16rpx 32rpx rgba(64, 158, 255, 0.3),
      0 0 0 1rpx rgba(64, 158, 255, 0.4),
      0 0 20rpx rgba(64, 158, 255, 0.3);
  }
}
</style>
