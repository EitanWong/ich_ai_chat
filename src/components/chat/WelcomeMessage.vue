<template>
  <view class="welcome-message">
    <text class="welcome-message__title">嗨，你好!</text>
    <text class="welcome-message__text">你可以向我提问任何有关温州非遗的问题哦！</text>
  </view>
</template>

<style lang="scss">
.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40rpx;
  text-align: center;

  &__title {
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #333;
  }

  &__text {
    font-size: 32rpx;
    color: #666;
    line-height: 1.5;
  }
}
</style>
