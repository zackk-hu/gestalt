// ==========================================
// 提示词类型枚举
// ==========================================

export enum PromptType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  RAG = 'rag',           // RAG 知识增强：基于知识库的问答
  AGENT = 'agent'        // Agent 构建：带工具调用的智能体
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
    description: '对话、写作、代码、分析等文本任务',
    icon: '📝'
  },
  {
    type: PromptType.IMAGE,
    name: '图片生成',
    description: 'Midjourney、Flux、DALL-E 等图像模型',
    icon: '🎨'
  },
  {
    type: PromptType.VIDEO,
    name: '视频生成',
    description: 'Sora、Runway、Veo 等视频模型',
    icon: '🎬'
  },
  {
    type: PromptType.RAG,
    name: 'RAG知识库',
    description: '基于知识库检索增强生成，支持文档问答',
    icon: '📚'
  },
  {
    type: PromptType.AGENT,
    name: 'Agent智能体',
    description: '构建带工具调用能力的 AI Agent',
    icon: '🤖'
  }
]

// 工具定义（用于 Agent 模式）
export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, {
      type: string
      description?: string
      enum?: string[]
    }>
    required?: string[]
  }
}

// 预置工具库
export const PRESET_TOOLS: Record<string, ToolDefinition> = {
  get_current_weather: {
    name: 'get_current_weather',
    description: '获取指定城市的实时天气信息',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: '城市名称，如北京、上海' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'], description: '温度单位' }
      },
      required: ['location']
    }
  },
  web_search: {
    name: 'web_search',
    description: '搜索互联网获取最新信息',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '搜索关键词' },
        num_results: { type: 'number', description: '返回结果数量' }
      },
      required: ['query']
    }
  },
  code_interpreter: {
    name: 'code_interpreter',
    description: '执行 Python 代码进行数据分析或计算',
    parameters: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Python 代码' }
      },
      required: ['code']
    }
  },
  database_query: {
    name: 'database_query',
    description: '查询数据库获取结构化数据',
    parameters: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'SQL 查询语句' },
        database: { type: 'string', description: '目标数据库名称' }
      },
      required: ['sql']
    }
  },
  send_email: {
    name: 'send_email',
    description: '发送电子邮件',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: '收件人邮箱' },
        subject: { type: 'string', description: '邮件主题' },
        body: { type: 'string', description: '邮件正文' }
      },
      required: ['to', 'subject', 'body']
    }
  }
}

// 交互细节（用户补充的上下文信息）
export interface InteractionDetails {
  background?: string
  subject?: string
  style?: string
  mood?: string
  duration?: string
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
