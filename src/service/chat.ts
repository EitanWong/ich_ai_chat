import { useChatStore } from '@/store/chat'
import { removeHtmlTags } from '@/utils/textFilter'

// 语音识别服务接口
export interface SpeechRecognitionService {
  startRecording(): Promise<void>
  stopRecording(): Promise<string>
}

// API 配置
const API_DEEPTHINKING_URL = 'https://qp.zjich.cn/ffserver/chatStream/q'

const API_URL = 'https://qp.zjich.cn/ffserver/chatStream/auth/v1/q'

// 获取API密钥
const API_KEY = import.meta.env.VITE_APP_LLM_API_KEY

// 流式响应类型
interface StreamResponse {
  token?: string
  final?: string
  type: 'reasoning' | 'final'
}

// 非思考AI流式响应类型
interface StreamNonThinkingResponse {
  content?: string
  final?: string
  type: 'stream' | 'final'
}

// 聊天服务
export class ChatService {
  
  private store = useChatStore()
  private abortController: AbortController | null = null


  async sendMessage(content: string) {

    const userMessage = this.store.addMessage({
      content,
      role: 'user',
      status: 'sent',
    }) 

    // 立即添加AI思考状态消息
    const assistantMessage = this.store.addMessage({
      content: '',
      role: 'assistant',
      status: 'sent',
      reasoningContent: '',
    })

    try 
    {

      // 创建新的 AbortController
      this.abortController = new AbortController()
       
      // 发送请求
      const formData = new FormData()


      const finalPrompt= `回复的内容不要包裹在  <最终回答>\n \n</最终回答> 内,直接回复内容, ${content}`
        .replace(/\n/g, ' ')         // 替换所有换行符为空格
        .replace(/[\"\']/g, '')      // 替换所有引号（单引号和双引号）
        .replace(/[\:\;：；]/g, '')  // 替换中英文冒号和分号
        .replace(/[\{\}\[\]]/g, '')  // 替换花括号和方括号
        .replace(/[<>\/\\]/g, '')    // 替换尖括号、斜杠和反斜杠
        .trim()

      formData.append('ques', finalPrompt)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          Authorization: API_KEY,
        },
        body: formData,
        signal: this.abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 处理流式响应
      const reader = response.body?.getReader()
       
      if (!reader) {
        this.store.updateMessageStatus(assistantMessage.id, 'error')
        this.store.updateMessageContent(assistantMessage.id, '服务器繁忙，请稍后再试')
        throw new Error('No reader available')
      }

      let messageContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          this.store.updateMessageStatus(assistantMessage.id, 'done')
          break
        }

        // 解析响应数据
        const text = new TextDecoder().decode(value)
        const lines = text.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.slice(5)) as StreamNonThinkingResponse

              if (data.type === 'stream' && data.content) {
                // 过滤HTML标签
                const filteredContent = removeHtmlTags(data.content)
                messageContent += filteredContent
                this.store.updateMessageStatus(assistantMessage.id, 'streaming')
                this.store.updateMessageContent(assistantMessage.id, messageContent)
              } else if (data.type === 'final' && data.final) {
                // 当收到final类型时，过滤HTML标签后再更新为最终内容
                const filteredFinal = removeHtmlTags(data.final)
                this.store.updateMessageStatus(assistantMessage.id, 'done')
                this.store.updateMessageContent(assistantMessage.id, filteredFinal)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }


    }
    catch(error) 
    {
      if (error.name === 'AbortError') {
        this.store.updateMessageStatus(assistantMessage.id, 'abort')
        console.log('Request aborted')
      } else {
        // 处理错误
        this.store.updateMessageStatus(assistantMessage.id, 'error')
        this.store.updateMessageContent(assistantMessage.id, '服务器繁忙，请稍后再试')
        console.error('发送消息失败:', error)
        throw error
      }
    }
    finally {
      this.abortController = null
    }
  }


  // 发送消息
  async sendMessageDeepThinking(content: string) {
    // 添加用户消息并立即设置为已发送
    const userMessage = this.store.addMessage({
      content,
      role: 'user',
      status: 'sent',
    })

    // 立即添加AI思考状态消息
    const assistantMessage = this.store.addMessage({
      content: '',
      role: 'assistant',
      status: 'sent',
      reasoningContent: '',
    })

    
    try {

      // 创建新的 AbortController
      this.abortController = new AbortController()

      // 发送请求
      const formData = new FormData()
      formData.append('ques', content)

      const response = await fetch(API_DEEPTHINKING_URL, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          Authorization: API_KEY,
        },
        body: formData,
        signal: this.abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) {
        this.store.updateMessageStatus(assistantMessage.id, 'error')
        this.store.updateMessageContent(assistantMessage.id, '服务器繁忙，请稍后再试')
        throw new Error('No reader available')
      }

      let reasoningContent = ''
      let finalContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          this.store.updateMessageStatus(assistantMessage.id, 'done')
          break
        }

        // 解析响应数据
        const text = new TextDecoder().decode(value)
        const lines = text.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.slice(5)) as StreamResponse

              if (data.type === 'reasoning' && data.token) {
                // 过滤思考内容中的HTML标签
                const filteredToken = removeHtmlTags(data.token)
                reasoningContent += filteredToken
                this.store.updateMessageStatus(assistantMessage.id, 'reasoning')
                this.store.updateMessageContent(assistantMessage.id, '')
                // 更新思考内容
                this.store.updateMessageReasoningContent(assistantMessage.id, reasoningContent)
              } else if (data.type === 'final' && data.final) {
                // 过滤最终内容中的HTML标签
                finalContent = removeHtmlTags(data.final)
                this.store.updateMessageStatus(assistantMessage.id, 'streaming')
                this.store.updateMessageContent(assistantMessage.id, finalContent)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.store.updateMessageStatus(assistantMessage.id, 'abort')
        console.log('Request aborted')
      } else {
        // 处理错误
        this.store.updateMessageStatus(assistantMessage.id, 'error')
        this.store.updateMessageContent(assistantMessage.id, '服务器繁忙，请稍后再试')
        console.error('发送消息失败:', error)
        throw error
      }
    } finally {
      this.abortController = null
    }
  }

  // 取消当前请求
  cancelRequest() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
}
