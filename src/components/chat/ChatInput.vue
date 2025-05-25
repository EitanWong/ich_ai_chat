<template>
  <view class="chat-input">
    <ScrollToBottom :show="showScrollButton" @click="$emit('scroll-to-bottom')" />
    <view class="chat-input__container">
      <template v-if="!isResponding">
        <template v-if="!isRecording">
          <TextInput
            v-model="inputText"
            @send="handleSend"
            @height-change="handleHeightChange"
            class="chat-input__text-input"
          />
        </template>
        <template v-else>
          <RecordingStatus class="chat-input__recording" />
        </template>
        <VoiceButton
          @start-recording="handleStartRecording"
          @stop-recording="handleStopRecording"
          @audio-recorded="handleAudioRecorded"
          class="chat-input__voice-btn"
        />
      </template>
      <template v-else>
        <WaitingResponse @stop="handleStop" />
      </template>
    </view>
    <view class="chat-input__bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/store/chat'
import TextInput from './TextInput.vue'
import VoiceButton from './VoiceButton.vue'
import RecordingStatus from './RecordingStatus.vue'
import ScrollToBottom from './ScrollToBottom.vue'
import WaitingResponse from './WaitingResponse.vue'
import { transcribeAudio } from '@/service/audioTranscriptionService'
import { AUDIO_CONFIG } from '@/config/audio'

const store = useChatStore()
const inputText = ref('')
const isRecording = ref(false)
const showScrollButton = ref(false)
const isResponding = computed(() => {
  const lastMessage = store.messages[store.messages.length - 1]
  return (
    lastMessage?.role === 'assistant' &&
    ['sent', 'reasoning', 'streaming'].includes(lastMessage.status)
  )
})

const emit = defineEmits<{
  (e: 'send-message', text: string): void
  (e: 'scroll-to-bottom'): void
  (e: 'stop-response'): void
}>()

// 处理发送消息
const handleSend = (text: string) => {
  if (text.trim()) {
    emit('send-message', text.trim())
    inputText.value = ''
  }
}

// 处理开始录音
const handleStartRecording = () => {
  isRecording.value = true
}

// 处理停止录音
const handleStopRecording = () => {
  isRecording.value = false
}

// 处理语音录制完成
const handleAudioRecorded = async (audioBlob: Blob) => {
  console.log('接收到录音 Blob:', audioBlob)

  // 检查 API Token
  const token = import.meta.env.VITE_SILICONFLOW_API_TOKEN
  if (!token) {
    console.error('请设置 VITE_SILICONFLOW_API_TOKEN 环境变量')
    uni.showToast({
      title: AUDIO_CONFIG.ERROR_MESSAGES.AUTH_ERROR,
      icon: 'none',
      duration: 3000,
    })
    return
  }

  try {
    uni.showLoading({
      title: '正在识别语音...',
      mask: true,
    })

    const transcribedText = await transcribeAudio(audioBlob, token)

    if (transcribedText) {
      console.log('识别到的文本:', transcribedText)
      // 将识别到的文本作为消息发送
      handleSend(transcribedText)
    } else {
      throw new Error('语音识别返回空结果')
    }
  } catch (error) {
    console.error('语音识别失败:', error)
    uni.showToast({
      title: error.message || AUDIO_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR,
      icon: 'none',
      duration: 3000,
    })
  } finally {
    uni.hideLoading()
  }
}

// 处理停止响应
const handleStop = () => {
  emit('stop-response')
}

// 暴露方法给父组件
defineExpose({
  showScrollButton,
})
</script>

<style lang="scss">
.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  padding: 42rpx;
  // border-top: 1rpx solid #eee;
  // box-shadow: 0 -2rpx 100rpx rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;

  z-index: 1;
  // backdrop-filter: blur(10rpx);

  &__container {
    display: flex;
    align-items: flex-start;
    gap: 20rpx;
    min-height: 36px;
    position: relative;
  }

  &__text-input {
    flex: 1;
  }

  &__voice-btn {
    align-self: flex-end;
    margin-bottom: 0;
  }

  &__waiting {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    background-color: #f8f8f8;
    border-radius: 36rpx;
    margin-left: 16rpx;
  }

  &__waiting-text {
    font-size: 28rpx;
    color: #666;
  }

  &__bottom-space {
    height: 20rpx;
  }

  &__recording {
    flex: 1;
  }
}
</style>
