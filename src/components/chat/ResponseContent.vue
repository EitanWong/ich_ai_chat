<template>
  <view class="response-content">
    <view class="response-content__bubble">
      <rich-text class="response-content__text" :nodes="processedContent"></rich-text>
      <view v-if="isAbort" class="response-content__abort">
        <text class="response-content__abort-text">（回答被用户中断）</text>
      </view>
    </view>
    <view
      v-if="isError"
      class="response-content__error"
      :class="{ 'response-content__error--collapsed': isErrorCollapsed }"
    >
      <view class="response-content__error-header" @click="toggleError">
        <text class="response-content__error-icon">⚠️</text>
        <text class="response-content__error-title">错误信息</text>
        <text class="response-content__error-arrow">{{ isErrorCollapsed ? '▼' : '▲' }}</text>
      </view>
      <view v-show="!isErrorCollapsed" class="response-content__error-content">
        <text class="response-content__error-text">{{ content }}</text>
      </view>
    </view>
    <view class="response-content__actions">
      <view class="response-content__action-button" @click="handleCopy">
        <text class="action-icon">📋</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 配置 marked
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true,
})

const props = defineProps<{
  content: string
  status?: 'streaming' | 'done' | 'abort' | 'error'
}>()

// 处理文本内容，去除开头和结尾的空白换行
const processedContent = computed(() => {
  const cleanContent = props.content.replace(/^\s*\n+|\n+\s*$/g, '')
  return marked(cleanContent)
})

const isAbort = computed(() => props.status === 'abort')
const isError = computed(() => props.status === 'error')
const isErrorCollapsed = ref(false)

const toggleError = () => {
  isErrorCollapsed.value = !isErrorCollapsed.value
}

// 处理复制功能
const handleCopy = () => {
  // 获取纯文本内容
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = processedContent.value
  const textToCopy = tempDiv.textContent || tempDiv.innerText || ''

  // 复制到剪贴板
  uni.setClipboardData({
    data: textToCopy,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000,
      })
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'error',
        duration: 2000,
      })
    },
  })
}

defineEmits<{
  (e: 'copy'): void
}>()
</script>

<style lang="scss">
.response-content {
  &__bubble {
    padding: 20rpx;
    border-radius: 20rpx;
    background-color: var(--chat-bg-color);
    word-break: break-all;
    position: relative;
    box-shadow:
      0 2rpx 4rpx rgba(0, 0, 0, 0.05),
      0 4rpx 8rpx rgba(0, 0, 0, 0.05),
      0 8rpx 16rpx rgba(0, 0, 0, 0.05),
      0 16rpx 32rpx rgba(0, 0, 0, 0.05);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 20rpx;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 20rpx;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0));
      pointer-events: none;
    }
  }

  &__text {
    font-size: 28rpx;
    line-height: 1.5;
    user-select: text;
    -webkit-user-select: text;

    // Markdown 样式
    :deep(p) {
      margin: 0.5em 0;
    }

    :deep(pre) {
      margin: 0.5em 0;
      padding: 1em;
      background-color: #f6f8fa;
      border-radius: 6rpx;
      overflow-x: auto;
    }

    :deep(code) {
      font-family: monospace;
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3rpx;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 2em;
      margin: 0.5em 0;
    }

    :deep(blockquote) {
      margin: 0.5em 0;
      padding-left: 1em;
      border-left: 4rpx solid #dfe2e5;
      color: #6a737d;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin: 0.5em 0;
      font-weight: 600;
      line-height: 1.25;
    }

    :deep(a) {
      color: #0366d6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
    }

    :deep(table) {
      border-collapse: collapse;
      margin: 0.5em 0;
      width: 100%;

      th,
      td {
        border: 1px solid #dfe2e5;
        padding: 6rpx 13rpx;
      }

      tr:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }
  }

  &__abort {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.1);
  }

  &__abort-text {
    font-size: 24rpx;
    color: #999;
    font-style: italic;
  }

  &__error {
    margin-top: 16rpx;
    border-radius: 12rpx;
    background-color: rgba(255, 77, 79, 0.1);
    border: 1rpx solid rgba(255, 77, 79, 0.2);
    overflow: hidden;
    transition: all 0.3s ease;

    &--collapsed {
      .response-content__error-header {
        border-bottom: none;
      }
    }
  }

  &__error-header {
    padding: 16rpx 20rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    cursor: pointer;
    border-bottom: 1rpx solid rgba(255, 77, 79, 0.2);
    transition: background-color 0.3s ease;

    &:active {
      background-color: rgba(255, 77, 79, 0.15);
    }
  }

  &__error-icon {
    font-size: 28rpx;
  }

  &__error-title {
    font-size: 26rpx;
    color: #ff4d4f;
    flex: 1;
  }

  &__error-arrow {
    font-size: 24rpx;
    color: #ff4d4f;
    opacity: 0.6;
  }

  &__error-content {
    padding: 20rpx;
  }

  &__error-text {
    font-size: 26rpx;
    color: #ff4d4f;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16rpx;
    margin-top: 12rpx;
  }

  &__action-button {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cdd4df;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #666;
    }
  }

  .action-icon {
    font-size: 24rpx;
  }
}
</style>
