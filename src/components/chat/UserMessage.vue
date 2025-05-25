<template>
  <view class="user-message">
    <view class="user-message__avatar">
      <image
        src="/static/chat/avatar-user.webp"
        mode="aspectFill"
        class="user-message__avatar-image"
      />
    </view>
    <view class="user-message__content">
      <view class="user-message__bubble">
        <text class="user-message__text">{{ content }}</text>
      </view>
      <view class="user-message__status" v-if="status !== 'sent'">
        <text v-if="status === 'sending'">发送中...</text>
        <text v-else-if="status === 'error'" class="error">发送失败</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  content: string
  status: 'sending' | 'sent' | 'error'
}>()
</script>

<style lang="scss">
.user-message {
  display: flex;
  margin: 20rpx;
  align-items: flex-start;
  flex-direction: row-reverse;

  &__avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 12%;
    overflow: hidden;
    margin: 0 20rpx;
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
  }

  &__content {
    max-width: 70%;
  }

  &__bubble {
    padding: 20rpx;
    border-radius: 20rpx;
    background-color: #007aff;
    color: #fff;
    word-break: break-all;
  }

  &__text {
    font-size: 28rpx;
    line-height: 1.5;
  }

  &__status {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
    text-align: right;

    .error {
      color: #ff4d4f;
    }
  }
}
</style>
