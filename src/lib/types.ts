// ==========================================
// 提示词类型枚举
// ==========================================

export enum PromptType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video'
}

export enum LogicMode {
  ZERO_SHOT = 'intuition',      // 直觉式：闲聊、简单查询
  CHAIN_OF_THOUGHT = 'cot',     // 思维链：逻辑推理、数学、代码
  TREE_OF_THOUGHTS = 'tot',     // 思维树：复杂决策、多视角博弈
  META_PROMPTING = 'meta'       // 元提示：结构化指令构建
}

// 任务类型选项
export interface TaskTypeOption {
  type: PromptType
  name: string
  description: string
  icon: string
}

export const TASK_TYPE_OPTIONS: TaskTypeOption[] = [
  {
    type: PromptType.TEXT,
    name: '文本生成',
    description: '对话、写作、代码、分析等文本任务，支持 RAG 知识增强',
    icon: '📝'
  },
  {
    type: PromptType.IMAGE,
    name: '图片生成',
    description: 'Midjourney、Flux、DALL-E 等图像模型，支持参考图检索',
    icon: '🎨'
  },
  {
    type: PromptType.VIDEO,
    name: '视频生成',
    description: 'Sora、Runway、Veo 等视频模型，支持风格参考检索',
    icon: '🎬'
  }
]

// 交互细节（用户补充的上下文信息）
export interface InteractionDetails {
  background?: string
  subject?: string
  style?: string
  mood?: string
  duration?: string
  knowledgeContext?: string  // RAG 知识上下文
  [key: string]: string | undefined
}

// 消息类型
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

// API 配置
export interface ApiConfig {
  apiKey: string
  baseUrl: string
  modelName: string
}

// 模型定义
export interface ModelOption {
  id: string
  name: string
  provider: string
  description: string
}

// 可用模型列表
export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'Qwen/Qwen2.5-72B-Instruct',
    name: 'Qwen2.5-72B',
    provider: 'ModelScope',
    description: '通义千问大模型，综合能力强'
  },
  {
    id: 'Qwen/Qwen2.5-32B-Instruct',
    name: 'Qwen2.5-32B',
    provider: 'ModelScope',
    description: '通义千问中等规模，响应更快'
  },
  {
    id: 'deepseek-ai/DeepSeek-V3',
    name: 'DeepSeek-V3',
    provider: 'ModelScope',
    description: 'DeepSeek 最新模型，推理能力强'
  },
  {
    id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    name: 'DeepSeek-R1-32B',
    provider: 'ModelScope',
    description: 'DeepSeek R1 蒸馏版，逻辑推理专长'
  },
]

// 编译响应
export interface CompileResponse {
  success: boolean
  result?: string
  error?: string
  metadata?: {
    tokensUsed?: number
    processingTime?: number
  }
}

// 默认配置 - ModelScope 魔搭社区
export const DEFAULT_CONFIG: ApiConfig = {
  apiKey: 'ms-74196180-fca4-49f0-893c-53c75dd54e2b',
  baseUrl: 'https://api-inference.modelscope.cn/v1',
  modelName: 'Qwen/Qwen2.5-72B-Instruct'
}

// 生成唯一 ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
