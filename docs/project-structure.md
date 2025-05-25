# 温州非遗 AI 问答网站项目结构说明

## 项目概述

本项目是一个基于 UniApp 开发的温州非物质文化遗产 AI 问答网站，采用 Vue 3 + TypeScript + Vite 技术栈，实现了智能问答、语音识别等功能。

## 目录结构

```
src/
├── components/        # 公共组件
│   └── chat/         # 聊天相关组件
├── config/           # 配置文件
├── hooks/            # 自定义 Hooks
├── interceptors/     # 拦截器
├── layouts/          # 布局组件
├── pages/            # 页面文件
├── pages-sub/        # 子页面
├── service/          # API 服务
├── static/           # 静态资源
├── store/            # 状态管理
├── style/            # 全局样式
├── types/            # TypeScript 类型定义
├── uni_modules/      # uni-app 插件
└── utils/            # 工具函数
```

## 核心模块说明

### 1. 组件模块 (components)

#### 1.1 聊天组件 (components/chat)
- **功能**：实现聊天界面的核心组件
- **主要组件**：
  - ChatInput：聊天输入组件
  - ChatMessage：消息展示组件
  - ChatVoice：语音输入组件
- **实现原理**：
  - 使用 Vue 3 组合式 API 实现组件逻辑
  - 采用事件驱动模式处理用户交互
  - 支持文本输入和语音输入两种模式

### 2. 服务模块 (service)

#### 2.1 聊天服务 (service/chat.ts)
- **功能**：处理与 AI 对话相关的 API 请求
- **主要方法**：
  - sendMessage：发送消息到 AI 服务
  - getHistory：获取历史对话记录
- **实现细节**：
  - 使用 Axios 进行 HTTP 请求
  - 实现请求重试和错误处理
  - 支持流式响应处理

#### 2.2 语音转写服务 (service/audioTranscriptionService.ts)
- **功能**：处理语音识别相关的 API 请求
- **主要方法**：
  - transcribeAudio：将语音转换为文本
  - uploadAudio：上传音频文件
- **实现细节**：
  - 集成 Siliconflow 语音识别 API
  - 支持多种音频格式
  - 实现音频文件预处理

### 3. 状态管理 (store)

#### 3.1 聊天状态 (store/chat.ts)
- **功能**：管理聊天相关的状态
- **主要状态**：
  - messages：消息列表
  - loading：加载状态
  - error：错误信息
- **实现细节**：
  - 使用 Pinia 进行状态管理
  - 实现消息的增删改查
  - 支持消息持久化

#### 3.2 用户状态 (store/user.ts)
- **功能**：管理用户相关的状态
- **主要状态**：
  - userInfo：用户信息
  - token：认证令牌
- **实现细节**：
  - 实现用户登录状态管理
  - 处理 token 的存储和更新
  - 提供用户信息更新方法

### 4. 工具函数 (utils)

- **功能**：提供通用工具方法
- **主要工具**：
  - request：HTTP 请求封装
  - storage：本地存储封装
  - format：数据格式化工具

### 5. 拦截器 (interceptors)

- **功能**：处理请求和响应的拦截
- **主要功能**：
  - 请求拦截：添加认证信息
  - 响应拦截：统一错误处理
  - 日志记录：请求日志记录

### 6. 自定义 Hooks (hooks)

- **功能**：提供可复用的逻辑
- **主要 Hooks**：
  - useChat：聊天相关逻辑
  - useVoice：语音处理逻辑
  - useAuth：认证相关逻辑

## 技术实现细节

### 1. 语音识别实现

1. **音频采集**：
   - 使用 recorder-core 库实现录音功能
   - 支持多种音频格式（wav、mp3、pcm、opus、webm）
   - 提供录音权限管理和状态控制

2. **音频处理**：
   - 音频格式转换
   - 音频质量优化
   - 文件大小控制

3. **API 调用**：
   - 使用 Siliconflow API 进行语音识别
   - 实现错误重试机制
   - 支持批量处理

### 2. 聊天功能实现

1. **消息处理**：
   - 消息队列管理
   - 消息状态追踪
   - 消息持久化存储

2. **UI 交互**：
   - 消息气泡动画
   - 滚动加载历史消息
   - 输入框自适应

3. **性能优化**：
   - 消息列表虚拟滚动
   - 图片懒加载
   - 音频预加载

## 开发规范

### 1. 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置
- 使用统一的命名规范

### 2. 组件开发规范

- 组件采用 PascalCase 命名
- 使用组合式 API 开发
- 提供完整的类型定义

### 3. 状态管理规范

- 使用 Pinia 进行状态管理
- 按功能模块划分 store
- 实现状态持久化

### 4. API 调用规范

- 统一使用 service 层处理 API 调用
- 实现请求拦截和响应拦截
- 统一的错误处理机制 