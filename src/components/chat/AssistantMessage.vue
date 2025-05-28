<template>
  <view class="assistant-message">
    <view class="assistant-message__avatar">
      <image
        src="/static/chat/avatar-ai.webp"
        mode="aspectFill"
        class="assistant-message__avatar-image"
      />
    </view>
    <view class="assistant-message__content">
      <LoadingContent v-if="status === 'sent'" />
      <template v-else>
        <template v-if="reasoningContent && reasoningContent.length > 0">
        <ThinkingContent
          :content="reasoningContent || ''"
          :is-thinking="status === 'reasoning'"
          :is-collapsed="isThinkingCollapsed"
          @update:is-collapsed="isThinkingCollapsed = $event"
        />
        </template>
        <ResponseContent
          v-if="
            status === 'streaming' || status === 'done' || status === 'abort' || status === 'error'
          "
          :content="content"
          :status="status"
          @copy="$emit('copy')"
          @regenerate="$emit('regenerate')"
          @like="$emit('like')"
        />
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ThinkingContent from './ThinkingContent.vue'
import ResponseContent from './ResponseContent.vue'
import LoadingContent from './LoadingContent.vue'
import { Message } from '@/store/chat'

const props = defineProps<{
  content: string
  reasoningContent?: string
  status: Message['status']
}>()

const isThinkingCollapsed = ref(false)

// 监听状态变化
watch(
  () => props.status,
  (newStatus, oldStatus) => {
    // 当状态从 reasoning 变为 streaming 时，自动折叠思考内容
    if (oldStatus === 'reasoning' && newStatus === 'streaming') {
      isThinkingCollapsed.value = true
    }
  },
)

defineEmits<{
  (e: 'copy'): void
  (e: 'regenerate'): void
  (e: 'like'): void
}>()
</script>

<style lang="scss">
.assistant-message {
  display: flex;
  margin: 20rpx;
  align-items: flex-start;

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
}
</style>
