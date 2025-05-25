<template>
  <button class="stop-button" @tap="handleClick">
    <image class="stop-button__icon" src="/static/chat/interrupt.svg" />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss">
.stop-button {
  width: 80rpx;
  height: 80rpx;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 245, 245, 0.95);
  border-radius: 50%;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.2);

  &:active {
    transform: scale(0.9);
    opacity: 0.8;
    box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.15);
  }

  &::after {
    border: none;
  }

  &__icon {
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
