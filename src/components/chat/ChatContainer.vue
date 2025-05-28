<template>
  <view class="chat-container">
    <scroll-view
      class="chat-container__scroll"
      scroll-y
      :scroll-with-animation="true"
      :scroll-into-view="scrollToMessageId"
      :scroll-top="scrollTop"
      @scrolltoupper="handleScrollToUpper"
      @scroll="handleScroll"
    >
      <view class="chat-container__messages">
        <view class="chat-container__top-space"></view>
        <template v-if="messages.length > 0">
          <ChatMessage
            v-for="(message, index) in messages"
            :key="message.id"
            :message="message"
            :is-last-message="index === messages.length - 1"
            :id="`message-${message.id}`"
          />
        </template>
        <view v-else class="chat-container__welcome-wrapper">
          <WelcomeMessage />
        </view>
        <view class="chat-container__bottom-space"></view>
      </view>
    </scroll-view>
    <ChatInput
      ref="chatInputRef"
      @send-message="handleSendMessage"
      @scroll-to-bottom="scrollToBottom"
      @stop-response="handleStopResponse"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onUnmounted, onMounted } from 'vue'
import { useChatStore } from '@/store/chat'
import { ChatService } from '@/service/chat'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import WelcomeMessage from './WelcomeMessage.vue'

const store = useChatStore()
const chatService = new ChatService()
const messages = computed(() => store.messages)
const chatInputRef = ref()

// 滚动相关状态
const scrollToMessageId = ref('')
const scrollTop = ref(0)
const containerHeight = ref(0)
const messagesHeight = ref(0)
const inputHeight = ref(180) // 输入框高度，单位rpx
let scrollTimer: number | null = null
let checkTimer: number | null = null

// 添加滚动位置监听
watch(scrollTop, (newValue) => {

  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  scrollTimer = setTimeout(() => {
    checkScrollPosition()
  }, 100)

})

// 初始化容器监听
onMounted(() => {
  
  // 使用 uni-app 的 API 获取容器信息
  updateContainerInfo()

  // 定期检查容器信息
  checkTimer = setInterval(updateContainerInfo, 1000)

})

// 更新容器信息
const updateContainerInfo = () => {

  const query = uni.createSelectorQuery()
  query.select('.chat-container__scroll').boundingClientRect()
  query.select('.chat-container__messages').boundingClientRect()
  query.exec((res) => {
    if (res[0] && res[1]) {
      containerHeight.value = res[0].height
      messagesHeight.value = res[1].height
      checkScrollPosition()
    }
  })

}

// 组件卸载时清理
onUnmounted(() => {

  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  if (checkTimer) {
    clearInterval(checkTimer)
  }

})

// 检查滚动位置
const checkScrollPosition = () => {

  // 当消息列表为空时，隐藏滚动按钮
  if (messages.value.length === 0) {
    if (chatInputRef.value) {
      chatInputRef.value.showScrollButton = false
    }
    return
  }

  const maxScrollTop = Math.max(0, messagesHeight.value - containerHeight.value)
  // 增加误差值到 100px，使判断更准确
  const isAtBottom = Math.abs(scrollTop.value - maxScrollTop) <= 100
  // 当不在底部时显示按钮
  if (chatInputRef.value) {
    chatInputRef.value.showScrollButton = !isAtBottom
  }

}

// 处理滚动
const handleScroll = (e: any) => {
  const newScrollTop = e.detail.scrollTop
  if (scrollTop.value !== newScrollTop) {
    scrollTop.value = newScrollTop
    checkScrollPosition()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messages.value.length > 0) {
    const lastMessage = messages.value[messages.value.length - 1]
    scrollToMessageId.value = `message-${lastMessage.id}`

    // 使用 nextTick 确保 DOM 更新后再滚动
    nextTick(() => {
      const maxScrollTop = Math.max(0, messagesHeight.value - containerHeight.value)
      scrollTop.value = maxScrollTop
      if (chatInputRef.value) {
        chatInputRef.value.showScrollButton = false
      }
    })
  }
}

// 监听消息变化
watch(
  () => messages.value,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true },
)

// 监听消息状态变化
watch(
  () => messages.value.map((m) => m.status),
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true },
)

// 监听消息内容变化
watch(
  () => messages.value.map((m) => m.content),
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true },
)

// 发送消息
const handleSendMessage = async (text: string) => {
  try {
    await chatService.sendMessage(text)
  } catch (error) {
    console.error('发送消息失败:', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
    })
  }
}

// 停止响应
const handleStopResponse = () => {
  chatService.cancelRequest()
}

// 处理滚动到顶部
const handleScrollToUpper = () => {
  // 这里可以添加加载历史消息的逻辑
  console.log('滚动到顶部')
}
</script>

<style lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('@/static/chat/bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &__scroll {
    flex: 1;
    height: calc(100vh - 0rpx); // 减去输入框高度
    padding-bottom: 0rpx; // 为输入框留出空间
  }

  &__messages {
    padding: 20rpx 0;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__welcome-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -200rpx; // 抵消顶部空白区域的影响
  }

  &__top-space {
    height: 200rpx;
  }

  &__bottom-space {
    height: 400rpx;
  }
}
</style>
