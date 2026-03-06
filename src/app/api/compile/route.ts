import { NextRequest, NextResponse } from 'next/server'
import { getCompilerSystemPrompt } from '@/lib/prompts'
import { Message, PromptType } from '@/lib/types'
import { getTerminologyTranslator, EnhancedPromptBuilder } from '@/lib/rag'

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
    const apiKey = process.env.DEEPSEEK_API_KEY || config?.apiKey
    
    // 验证必要参数
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数：消息历史' },
        { status: 400 }
      )
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '缺少 API Key，请配置环境变量 DEEPSEEK_API_KEY 或在页面中输入' },
        { status: 400 }
      )
    }

    // 获取最后一条用户消息作为输入
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    const userInput = lastUserMessage?.content || ''

    // 尝试使用术语翻译器增强用户输入
    const translator = getTerminologyTranslator()
    let enhancedSystemPrompt = getCompilerSystemPrompt(taskType, userInput)
    
    // 如果术语库已初始化，尝试使用RAG增强
    if (translator.isInitialized()) {
      try {
        // 由于这里无法直接计算向量，我们使用编译API的密钥来获取向量
        const embeddingResponse = await fetch(`${process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'}/embeddings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: userInput,
            encoding_format: 'float'
          })
        })
        
        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json()
          const queryVector = embeddingData.data?.[0]?.embedding
          
          if (queryVector) {
            const translationResult = await translator.translate(userInput, queryVector)
            
            // 检查是否需要澄清（如果RAG系统返回了澄清请求）
            if (translationResult.needs_clarification && translationResult.clarification) {
              // 如果需要澄清，直接返回澄清请求
              return NextResponse.json({
                success: true,
                result: null,
                metadata: {
                  needs_clarification: true,
                  clarification: translationResult.clarification,
                  tokensUsed: 0,
                  processingTime: Date.now() - startTime,
                  rag_enhanced: true,
                }
              });
            } else if (translationResult.enhanced_prompt) {
              // 使用增强的提示词
              enhancedSystemPrompt = translationResult.enhanced_prompt
            }
          }
        }
      } catch (e) {
        console.warn('RAG增强失败，使用原始系统提示词:', e)
        // 出错时继续使用原始提示词
      }
    }

    const baseUrl = process.env.DEEPSEEK_BASE_URL || config.baseUrl || 'https://api.deepseek.com/v1'
    const modelName = config.modelName || 'deepseek-chat'

    
    // 构建消息列表（包含系统提示词和对话历史）
    const apiMessages = [
      { role: 'system', content: enhancedSystemPrompt },
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
        rag_enhanced: translator.isInitialized(), // 标记是否使用了RAG增强
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
