# 温州非遗 AI 问答网站

<p align="center">
  <img width="160" src="./src/static/chat/avatar-ai.webp">
</p>

<h1 align="center">温州非遗 AI 问答网站</h1>

<div align="center">

![node version](https://img.shields.io/badge/node-%3E%3D18-green)
![pnpm version](https://img.shields.io/badge/pnpm-%3E%3D7.30-green)
![Vue Version](https://img.shields.io/badge/Vue-3.x-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

## 📖 项目简介

温州非遗 AI 问答系统是一个基于 UniApp 开发的移动端 H5 应用，旨在通过 AI 技术为用户提供温州非物质文化遗产相关的智能问答服务。系统采用现代化的界面设计，提供流畅的用户体验，让用户能够便捷地了解温州丰富的非物质文化遗产资源。

## 🛠 技术栈

- **框架**: Vue 3 + TypeScript + Vite 5
- **UI 框架**: UnoCSS + wot-ui
- **状态管理**: Pinia
- **请求处理**: 封装 Axios
- **国际化**: i18n
- **代码规范**: ESLint + Prettier
- **包管理**: pnpm

## ⚙️ 环境要求

- Node.js >= 18
- pnpm >= 7.30
- Vue 3.x
- TypeScript >= 5.0

## 📁 项目结构

```
src/
├── components/        # 公共组件
├── config/           # 配置文件
├── hooks/            # 自定义 Hooks
├── interceptors/     # 拦截器
├── layouts/          # 布局组件
├── pages/            # 页面文件
│   └── index/       # 首页
├── pages-sub/        # 子页面
├── service/          # API 服务
├── static/           # 静态资源
├── store/            # 状态管理
├── style/            # 全局样式
├── types/            # TypeScript 类型定义
├── uni_modules/      # uni-app 插件
├── utils/            # 工具函数
├── App.vue           # 应用入口组件
├── main.ts           # 应用入口文件
├── manifest.json     # 应用配置文件
├── pages.json        # 页面路由配置
├── typings.d.ts      # 类型声明文件
└── uni.scss          # 全局样式变量
```

## 🚀 快速开始

1. 安装依赖：
```bash
pnpm install
```

2. 配置环境变量：
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，配置以下环境变量：
# VITE_SILICONFLOW_API_TOKEN=你的Siliconflow API Token
```

> 注意：需要先在 [Siliconflow](https://cloud.siliconflow.cn/models?types=speech) 注册账号并获取 API Token，用于配置语音识别功能。

### 语音识别接口说明

本项目使用 Siliconflow 的语音转文本 API，具体接口信息如下：

```bash
POST https://api.siliconflow.cn/v1/audio/transcriptions
```

#### 请求头
```
Authorization: Bearer <your_api_token>
Content-Type: multipart/form-data
```

#### 请求参数
- model: FunAudioLLM/SenseVoiceSmall（语音识别模型）

#### 响应格式
```json
{
  "text": "<string>"  // 识别后的文本内容
}
```

#### 状态码
- 200: 请求成功
- 400: 请求参数错误
- 401: 认证失败
- 404: 资源不存在
- 429: 请求频率超限
- 503: 服务暂时不可用
- 504: 请求超时

3. 运行开发服务器：
```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# APP 开发
pnpm dev:app
```

4. 构建生产版本：
```bash
# H5 构建
pnpm build:h5

# 微信小程序构建
pnpm build:mp-weixin

# APP 构建
pnpm build:app
```

## ✨ 功能特点

- 🤖 AI 智能问答：基于先进的 AI 技术，提供准确的非遗知识问答
- 📱 多端适配：支持 H5、小程序、APP 等多端运行
- 🎨 现代化界面：采用现代化的 UI 设计，提供流畅的用户体验
- 🌐 多语言支持：内置国际化支持，可扩展多语言 (暂未实现)
- 🔒 安全可靠：完善的请求拦截和错误处理机制
- 📦 组件化开发：采用组件化开发方式，提高代码复用性
- 🛠 开发友好：内置代码提示、自动格式化等开发辅助功能

## 💡 开发指南

### 目录说明

- `components/`: 存放公共组件，按功能模块分类
- `pages/`: 主页面文件，包含各个功能页面
- `service/`: API 接口封装，按模块划分
- `store/`: Pinia 状态管理，按功能模块划分
- `utils/`: 工具函数，包含通用方法
- `hooks/`: 自定义 Hooks，提供可复用的逻辑
- `interceptors/`: 请求拦截器，处理请求响应
- `layouts/`: 布局组件，定义页面整体结构

### 开发规范

1. 组件命名：使用 PascalCase 命名规范
2. 文件组织：按功能模块分类，保持目录结构清晰
3. 代码风格：遵循 ESLint 和 Prettier 配置
4. 注释规范：关键代码需要添加注释说明
5. Git 提交：使用规范的 commit message

## 📚 项目文档

- [项目结构说明](./docs/project-structure.md)：详细说明项目的目录结构和各个模块的功能
- [聊天组件说明](./docs/chat-components.md)：详细介绍聊天系统各组件的实现和交互

## 📄 许可证

[MIT](https://opensource.org/license/mit/)

Copyright (c) 2025 杭州澜链科技有限公司
