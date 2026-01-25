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
