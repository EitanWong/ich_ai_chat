import { defineStore } from 'pinia'

// 最大历史记录数量
const MAX_HISTORY_LIMIT = 10

// 历史记录设置键名
const HISTORY_SETTING_KEY = 'chat-history-setting'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  reasoningContent?: string
  content: string
  status: 'sent' | 'error' | 'abort' | 'streaming' | 'reasoning' | 'done'
}

interface ChatState {
  messages: Message[]
  isRecording: boolean
  isProcessing: boolean
  messageCounter: number
  keepHistory: boolean
}

// 获取历史记录设置
const getHistorySetting = (): boolean => {
  const setting = uni.getStorageSync(HISTORY_SETTING_KEY)
  return setting === '' ? false : setting === 'true'
}

// 保存历史记录设置
const saveHistorySetting = (keep: boolean) => {
  uni.setStorageSync(HISTORY_SETTING_KEY, keep.toString())
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    isRecording: false,
    isProcessing: false,
    messageCounter: 0,
    keepHistory: getHistorySetting(),
  }),

  actions: {
    // 维护历史记录数量限制
    maintainHistoryLimit() {
      if (this.messages.length > MAX_HISTORY_LIMIT) {
        this.messages = this.messages.slice(-MAX_HISTORY_LIMIT)
      }
    },

    addMessage(message: Omit<Message, 'id' | 'timestamp'>) {
      const newMessage: Message = {
        ...message,
        id: `${Date.now()}_${++this.messageCounter}`,
        timestamp: Date.now(),
      }
      this.messages.push(newMessage)
      this.maintainHistoryLimit()
      return newMessage
    },

    updateMessageStatus(id: string, status: Message['status']) {
      const message = this.messages.find((m) => m.id === id)
      if (message) {
        message.status = status
      }
    },

    updateMessageContent(id: string, content: string) {
      const message = this.messages.find((m) => m.id === id)
      if (message) {
        message.content = content
      }
    },

    updateMessageReasoningContent(id: string, content: string) {
      const message = this.messages.find((m) => m.id === id)
      if (message) {
        message.reasoningContent = content
      }
    },

    setRecording(isRecording: boolean) {
      this.isRecording = isRecording
    },

    setProcessing(isProcessing: boolean) {
      this.isProcessing = isProcessing
    },

    clearMessages() {
      this.messages = []
      this.messageCounter = 0
    },

    setKeepHistory(keep: boolean) {
      this.keepHistory = keep
      saveHistorySetting(keep)
      if (!keep) {
        // 如果关闭历史记录，清除存储的消息
        this.clearMessages()
      }
    },

    // 初始化时检查是否需要清空历史记录
    initialize() {
      if (!this.keepHistory) {
        this.clearMessages()
      }
    },
  },

  persist: {
    key: 'chat-history',
    storage: {
      getItem: (key) => {
        const data = uni.getStorageSync(key)
        if (data) {
          const parsed = JSON.parse(data)
          // 确保加载的数据也符合历史记录限制
          if (parsed.state?.messages?.length > MAX_HISTORY_LIMIT) {
            parsed.state.messages = parsed.state.messages.slice(-MAX_HISTORY_LIMIT)
          }
          return JSON.stringify(parsed)
        }
        return data
      },
      setItem: (key, value) => {
        const parsed = JSON.parse(value)
        // 只有在 keepHistory 为 true 时才保存消息
        if (!parsed.state.keepHistory) {
          parsed.state.messages = []
        }
        uni.setStorageSync(key, JSON.stringify(parsed))
      },
    },
  },
})
