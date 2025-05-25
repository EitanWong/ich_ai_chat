# 温州非遗 AI 问答网站聊天组件说明

## 组件概述

聊天系统由多个相互协作的组件构成，采用 Vue 3 组合式 API 开发，实现了文本对话、语音输入、消息展示等功能。组件之间通过事件通信和状态管理进行交互。

## 核心组件结构

```
components/chat/
├── ChatContainer.vue      # 聊天容器组件
├── ChatMessage.vue        # 消息组件
├── ChatInput.vue          # 输入组件
├── AssistantMessage.vue   # AI 助手消息
├── UserMessage.vue        # 用户消息
├── TextInput.vue          # 文本输入框
├── VoiceButton.vue        # 语音按钮
├── ResponseContent.vue    # 响应内容
├── ThinkingContent.vue    # 思考内容
├── LoadingContent.vue     # 加载内容
├── RecordingStatus.vue    # 录音状态
├── ScrollToBottom.vue     # 滚动到底部
├── StopButton.vue         # 停止按钮
├── WaitingResponse.vue    # 等待响应
└── WelcomeMessage.vue     # 欢迎消息
```

## 组件详细说明

### 1. ChatContainer.vue
聊天容器组件，负责整体布局和消息列表管理。

**主要功能**：
- 消息列表的展示和滚动
- 新消息自动滚动到底部
- 滚动位置监听和状态管理
- 消息发送和停止响应处理

**核心实现**：
```typescript
// 滚动相关状态管理
const scrollToMessageId = ref('')
const scrollTop = ref(0)
const containerHeight = ref(0)
const messagesHeight = ref(0)

// 滚动位置检查
const checkScrollPosition = () => {
  const maxScrollTop = Math.max(0, messagesHeight.value - containerHeight.value)
  const isAtBottom = Math.abs(scrollTop.value - maxScrollTop) <= 100
  chatInputRef.value.showScrollButton = !isAtBottom
}
```

### 2. ChatMessage.vue
消息组件，根据消息类型渲染不同的消息内容。

**主要功能**：
- 根据消息角色（用户/AI）渲染不同组件
- 处理消息复制、重新生成、点赞等操作
- 消息状态管理

**核心实现**：
```typescript
// 消息类型判断和渲染
<template>
  <UserMessage v-if="message.role === 'user'" ... />
  <AssistantMessage v-else ... />
</template>
```

### 3. ChatInput.vue
输入组件，整合文本输入和语音输入功能。

**主要功能**：
- 文本输入和语音输入切换
- 录音状态管理
- 语音识别处理
- 消息发送控制

**核心实现**：
```typescript
// 语音识别处理
const handleAudioRecorded = async (audioBlob: Blob) => {
  const transcribedText = await transcribeAudio(audioBlob, token)
  if (transcribedText) {
    handleSend(transcribedText)
  }
}
```

### 4. AssistantMessage.vue
AI 助手消息组件，展示 AI 的回复内容。

**主要功能**：
- 展示 AI 思考过程
- 展示 AI 回复内容
- 支持复制、重新生成等操作
- 消息状态管理

**核心实现**：
```typescript
// 消息状态管理
<template>
  <LoadingContent v-if="status === 'sent'" />
  <ThinkingContent v-else-if="status === 'reasoning'" ... />
  <ResponseContent v-else ... />
</template>
```

### 5. UserMessage.vue
用户消息组件，展示用户发送的消息。

**主要功能**：
- 展示用户消息内容
- 显示消息发送状态
- 错误状态处理

**核心实现**：
```typescript
// 消息状态展示
<view class="user-message__status" v-if="status !== 'sent'">
  <text v-if="status === 'sending'">发送中...</text>
  <text v-else-if="status === 'error'" class="error">发送失败</text>
</view>
```

### 6. TextInput.vue
文本输入框组件，处理用户文本输入。

**主要功能**：
- 自适应高度的文本输入
- 回车发送消息
- 输入框状态管理

**核心实现**：
```typescript
// 输入框高度自适应
const handleInput = (e: any) => {
  const height = Math.min(e.detail.height, MAX_HEIGHT)
  emit('height-change', height)
}
```

### 7. VoiceButton.vue
语音按钮组件，处理语音录制功能。

**主要功能**：
- 录音权限管理
- 录音状态控制
- 音频格式处理
- 录音时长限制

**核心实现**：
```typescript
// 录音配置
const set = {
  type: 'wav',
  sampleRate: 16000,
  bitRate: 16,
  onProcess: (buffers, powerLevel, duration, sampleRate, newBufferIdx, asyncEnd) => {
    // 录音处理中
  }
}
```

### 8. ResponseContent.vue
响应内容组件，展示 AI 的详细回复。

**主要功能**：
- Markdown 渲染
- 代码高亮
- 复制功能
- 错误状态展示

**核心实现**：
```typescript
// Markdown 渲染配置
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})
```

### 9. ThinkingContent.vue
思考内容组件，展示 AI 的思考过程。

**主要功能**：
- 思考状态展示
- 内容折叠/展开
- 动画效果

**核心实现**：
```typescript
// 思考状态动画
&--thinking {
  &::before {
    content: '';
    background: linear-gradient(90deg, ...);
    animation: flowingLight 3s infinite ease-in-out;
  }
}
```

### 10. LoadingContent.vue
加载内容组件，展示加载状态。

**主要功能**：
- 加载动画效果
- 渐变背景

**核心实现**：
```typescript
// 加载动画
&::before {
  content: '';
  background: linear-gradient(90deg, ...);
  animation: flowingLight 2s infinite ease-in-out;
}
```

### 11. RecordingStatus.vue
录音状态组件，展示录音进行状态。

**主要功能**：
- 录音波形动画
- 状态提示

**核心实现**：
```typescript
// 波形动画
.wave {
  animation: wave 1s ease-in-out infinite;
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}
```

### 12. ScrollToBottom.vue
滚动到底部组件，提供快速滚动功能。

**主要功能**：
- 滚动按钮显示/隐藏
- 点击动画效果
- 连续点击处理

**核心实现**：
```typescript
// 连续点击处理
const handleClick = () => {
  if (clickCount >= MAX_CLICKS) {
    setTimeout(() => {
      emit('click')
    }, CLICK_INTERVAL)
  }
}
```

### 13. StopButton.vue
停止按钮组件，用于中断 AI 响应。

**主要功能**：
- 停止按钮样式
- 点击动画效果

**核心实现**：
```typescript
// 按钮样式
.stop-button {
  &:active {
    transform: scale(0.9);
    opacity: 0.8;
  }
}
```

### 14. WaitingResponse.vue
等待响应组件，展示等待 AI 响应的状态。

**主要功能**：
- 加载动画
- 停止按钮集成

**核心实现**：
```typescript
// 加载动画
&__loading {
  animation: spin 1s linear infinite;
}
```

### 15. WelcomeMessage.vue
欢迎消息组件，展示初始欢迎界面。

**主要功能**：
- 欢迎信息展示
- 引导用户开始对话

**核心实现**：
```typescript
// 欢迎信息样式
.welcome-message {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

## 组件交互流程

1. **消息发送流程**：
   - 用户通过 TextInput 或 VoiceButton 输入内容
   - ChatInput 组件处理输入并发送消息
   - ChatContainer 更新消息列表
   - 新消息自动滚动到底部

2. **语音识别流程**：
   - 用户点击 VoiceButton 开始录音
   - RecordingStatus 显示录音状态
   - 录音完成后进行语音识别
   - 识别结果作为文本消息发送

3. **AI 响应流程**：
   - 消息发送后显示 LoadingContent
   - AI 思考时显示 ThinkingContent
   - 响应过程中显示 ResponseContent
   - 支持中断响应（StopButton）

## 样式设计特点

1. **响应式设计**：
   - 使用 rpx 单位适配不同屏幕
   - 弹性布局确保界面自适应
   - 合理的间距和留白

2. **动画效果**：
   - 平滑的过渡动画
   - 加载状态动画
   - 交互反馈动画

3. **主题定制**：
   - 使用 CSS 变量实现主题定制
   - 统一的颜色系统
   - 一致的视觉风格

## 性能优化

1. **渲染优化**：
   - 组件按需渲染
   - 合理使用 v-show 和 v-if
   - 避免不必要的重渲染

2. **滚动优化**：
   - 滚动位置缓存
   - 滚动节流处理
   - 虚拟滚动支持

3. **资源优化**：
   - 图片资源优化
   - 动画性能优化
   - 内存管理优化 