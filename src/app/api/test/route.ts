import { NextRequest, NextResponse } from 'next/server'
import { Message } from '@/lib/types'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { prompt, messages, modelId, config } = body as {
      prompt: string
      messages: Message[]
      modelId: string
      config: { apiKey: string; baseUrl: string }
    }

    // 优先使用服务器端环境变量的 API Key
    const apiKey = process.env.DEEPSEEK_API_KEY || config?.apiKey
    
    // 验证必要参数
    if (!prompt || !messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '缺少 API Key，请配置环境变量 DEEPSEEK_API_KEY 或在页面中输入' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.DEEPSEEK_BASE_URL || config.baseUrl || 'https://api.deepseek.com/v1'
    const model = modelId || 'deepseek-chat'

    // 构建消息列表：System Prompt + 对话历史
    const apiMessages = [
      { role: 'system', content: prompt },
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
        model: model,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Test API Error:', response.status, errorText)
      return NextResponse.json(
        { success: false, error: `调用失败 (${response.status}): ${errorText || '无详细信息'}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content

    if (!result) {
      return NextResponse.json(
        { success: false, error: '模型返回空结果' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      result,
      metadata: {
        model,
        tokensUsed: data.usage?.total_tokens,
        processingTime,
      }
    })

  } catch (error) {
    console.error('Test API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    
    return NextResponse.json(
      { success: false, error: `调用失败: ${errorMessage}` },
      { status: 500 }
    )
  }
}
