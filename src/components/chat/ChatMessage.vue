<template>
  <view class="chat-message" :id="id">
    <UserMessage
      v-if="message.role === 'user'"
      :content="message.content"
      :status="message.status"
    />
    <AssistantMessage
      v-else
      :content="message.content"
      :status="message.status"
      :reasoningContent="message.reasoningContent"
      @copy="handleCopy"
      @regenerate="handleRegenerate"
      @like="handleLike"
    />
  </view>
</template>

<script setup lang="ts">
import { Message } from '@/store/chat'
import UserMessage from './UserMessage.vue'
import AssistantMessage from './AssistantMessage.vue'

const props = defineProps<{
  message: Message
  isLastMessage?: boolean
  id?: string
}>()

const emit = defineEmits<{
  (e: 'copy', content: string): void
  (e: 'regenerate', messageId: string): void
  (e: 'like', messageId: string): void
}>()

const handleCopy = () => {
  if (props.message.content) {
    emit('copy', props.message.content)
  }
}

const handleRegenerate = () => {
  if (props.message.id) {
    emit('regenerate', props.message.id)
  }
}

const handleLike = () => {
  if (props.message.id) {
    emit('like', props.message.id)
  }
}
</script>

<style lang="scss">
.chat-message {
  width: 100%;
  position: relative;
  padding: 10rpx 0;
}
</style>
