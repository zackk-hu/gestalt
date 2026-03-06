# Prompt Optimizer — AI 提示词优化器

<p align="center">
  <strong>对话式 Prompt 编译 · 多模型实时测试 · 智能推理模式切换</strong>
</p>

---

## 📖 项目简介

**Prompt Optimizer** 是一个 AI 提示词优化器，旨在帮助用户通过对话式交互，将模糊的需求转化为高质量、结构化的 Prompt，并提供多模型实时测试验证能力。

无论你是产品经理、内容创作者、开发者还是研究人员，Prompt Optimizer 都能帮你降低 Prompt 工程门槛，提升 AI 应用效率。

### ✨ 核心特性

| 功能 | 描述 |
|------|------|
| 🎯 对话式优化 | 多轮对话逐步挖掘需求，而非一次性输入 |
| 🧠 智能推理切换 | 根据任务复杂度自动选择直觉式/思维链/思维树模式 |
| 🎨 多模型测试 | 支持 Qwen、DeepSeek 等多种模型即时验证 |
| 🛡️ 实时验证 | 编译-测试一体化，左栏编译右栏验证 |

---

## 🛠️ 技术栈详解

### 前端框架：Next.js 14 (App Router)

**Next.js** 是由 Vercel 开发的 React 全栈框架，本项目使用最新的 14 版本及 App Router 架构。

**为什么选择 Next.js？**
- **服务端渲染 (SSR)**：提升首屏加载速度和 SEO
- **App Router**：基于文件系统的路由，使用 `app/` 目录组织页面和 API
- **API Routes**：在 `app/api/` 目录下编写后端接口，无需额外搭建服务器
- **自动代码分割**：按需加载，优化性能
- **内置优化**：图片优化、字体优化、脚本优化等开箱即用

**在本项目中的应用：**
```
src/app/
├── api/
│   ├── compile/route.ts   # 提示词编译 API
│   └── test/route.ts      # 模型测试 API
├── layout.tsx             # 全局布局
└── page.tsx               # 主页面
```

---

### UI 框架：React 18 + TypeScript

**React 18** 是 Facebook 开发的用户界面库，配合 TypeScript 提供类型安全。

**React 18 新特性：**
- **并发渲染**：更流畅的用户体验
- **自动批处理**：减少不必要的重渲染
- **Suspense**：优雅处理异步加载
- **useTransition/useDeferredValue**：优先级调度

**TypeScript 的优势：**
- **类型安全**：编译时捕获错误，减少运行时 bug
- **智能提示**：IDE 自动补全，提升开发效率
- **代码可读性**：类型即文档，便于团队协作

**在本项目中的应用：**
```typescript
// src/lib/types.ts - 类型定义示例
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ApiConfig {
  apiKey: string
  baseUrl: string
  modelName: string
}
```

---

### 样式方案：Tailwind CSS

**Tailwind CSS** 是一个实用优先 (Utility-First) 的 CSS 框架。

**核心理念：**
- **原子化类名**：使用预定义的工具类快速构建 UI
- **响应式设计**：通过前缀（如 `sm:`, `md:`, `lg:`）轻松适配不同屏幕
- **暗黑模式**：使用 `dark:` 前缀一键切换
- **零冗余**：自动清除未使用的样式，生产包极小

**与传统 CSS 对比：**
```html
<!-- 传统 CSS -->
<button class="primary-button">按钮</button>
<style>
.primary-button {
  padding: 0.5rem 1rem;
  background: blue;
  color: white;
  border-radius: 0.5rem;
}
</style>

<!-- Tailwind CSS -->
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg">按钮</button>
```

**在本项目中的应用：**
```tsx
// 渐变背景 + 响应式布局 + 暗黑模式
<div className="bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-transparent">
  <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
    Prompt Optimizer — AI提示词优化器
  </h1>
</div>
```

---

### API 客户端：OpenAI SDK (兼容协议)

**OpenAI SDK** 是官方提供的 API 客户端，但由于采用标准化协议，可兼容多家 LLM 提供商。

**兼容性优势：**
| 提供商 | Base URL | 兼容性 |
|--------|----------|--------|
| ModelScope | `https://api-inference.modelscope.cn/v1` | ✅ 完全兼容 |
| DeepSeek | `https://api.deepseek.com/v1` | ✅ 完全兼容 |
| OpenAI | `https://api.openai.com/v1` | ✅ 完全兼容 |
| Ollama | `http://localhost:11434/v1` | ✅ 完全兼容 |

**在本项目中的应用：**
```typescript
// 统一的 API 调用方式，只需更换 baseUrl 和 apiKey
const response = await fetch(`${baseUrl}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: modelId,
    messages: apiMessages,
    temperature: 0.7,
  }),
});
```

---

### 图标库：Lucide React

**Lucide** 是 Feather Icons 的社区延续版本，提供 1000+ 精美图标。

**特点：**
- **轻量级**：按需导入，不会打包未使用的图标
- **一致性**：统一的 24x24 画布，2px 描边风格
- **可定制**：支持自定义大小、颜色、描边宽度
- **TypeScript 支持**：完整的类型定义

**在本项目中的应用：**
```tsx
import { Sparkles, Zap, Brain, Palette, Shield } from 'lucide-react'

// 使用图标组件
<Sparkles className="w-6 h-6 text-white" />
<Zap className="w-3 h-3" />
<Brain className="w-3 h-3" />
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装与运行

```bash
# 克隆项目
cd prompt-optimizer

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# http://localhost:7860
```

### 生产部署

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

---

## 📁 项目结构

```
prompt-optimizer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── compile/route.ts    # 编译 API 接口
│   │   │   └── test/route.ts       # 测试 API 接口
│   │   ├── globals.css             # 全局样式
│   │   ├── layout.tsx              # 根布局
│   │   └── page.tsx                # 主页面
│   ├── components/
│   │   ├── Button.tsx              # 按钮组件
│   │   ├── Card.tsx                # 卡片组件
│   │   ├── ChatPanel.tsx           # 对话编译面板
│   │   ├── ConfigPanel.tsx         # 配置面板
│   │   └── TestPanel.tsx           # 测试验证面板
│   └── lib/
│       ├── prompts.ts              # 提示词模板
│       ├── types.ts                # 类型定义
│       └── utils.ts                # 工具函数
├── tailwind.config.ts              # Tailwind 配置
├── tsconfig.json                   # TypeScript 配置
├── next.config.js                  # Next.js 配置
└── package.json                    # 项目依赖
```

---

## 🎨 界面预览

应用采用 **左右分栏** 设计：

| 左侧 - 提示词编译车间 | 右侧 - 效果验证平台 |
|----------------------|-------------------|
| 对话式需求挖掘 | System Prompt 微调 |
| 智能推理模式切换 | 多模型选择 |
| 消息编辑重发 | 连续对话测试 |
| 自动提取 Prompt | 实时效果验证 |

---

## 🧠 推理模式说明

系统根据任务复杂度自动切换三种推理模式：

| 模式 | 适用场景 | 标识 |
|------|---------|------|
| 🟢 直觉式 (Intuitive) | 简单任务：翻译、格式转换 | 直接响应 |
| 🔵 思维链 (CoT) | 中等任务：分析、比较、诊断 | 分步推理 |
| 🟣 思维树 (ToT) | 复杂任务：架构设计、策略规划 | 多路径探索 |

---

## 📚 参考资料

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Lucide 图标库](https://lucide.dev/icons)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

## 📄 许可证

MIT License

