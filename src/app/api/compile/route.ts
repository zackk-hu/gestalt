import { NextRequest, NextResponse } from 'next/server'
import { getCompilerSystemPrompt } from '@/lib/prompts'
import { Message, PromptType } from '@/lib/types'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { messages, config, taskType = PromptType.TEXT } = body as { 
      messages: Message[]
      config: { apiKey: string, baseUrl: string, modelName: string }
      taskType?: PromptType
    }

    // 优先使用服务器端环境变量的 API Key
    const apiKey = process.env.MODELSCOPE_API_KEY || config?.apiKey
    
    // 验证必要参数
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数：消息历史' },
        { status: 400 }
      )
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '缺少 API Key，请配置环境变量 MODELSCOPE_API_KEY 或在页面中输入' },
        { status: 400 }
      )
    }

    // 获取最后一条用户消息作为输入
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    const userInput = lastUserMessage?.content || ''

    // 根据任务类型获取对应的系统提示词
    const systemPrompt = getCompilerSystemPrompt(taskType, userInput)

    const baseUrl = process.env.MODELSCOPE_BASE_URL || config.baseUrl || 'https://api-inference.modelscope.cn/v1'
    const modelName = config.modelName || 'Qwen/Qwen2.5-72B-Instruct'

    // 构建消息列表（包含系统提示词和对话历史）
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ]

    // 调用 API
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      return NextResponse.json(
        { success: false, error: `API 错误 (${response.status}): ${errorText || '无详细信息'}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'API 返回空结果' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      result,
      metadata: {
        tokensUsed: data.usage?.total_tokens,
        processingTime,
      }
    })

  } catch (error) {
    console.error('Compile API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    
    return NextResponse.json(
      { success: false, error: `编译失败: ${errorMessage}` },
      { status: 500 }
    )
  }
}
