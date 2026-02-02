import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

/**
 * 向量嵌入 API
 * 使用 ModelScope 的 bge-large-zh 中文嵌入模型
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少 text 参数' },
        { status: 400 }
      )
    }

    const apiKey = process.env.MODELSCOPE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '缺少 MODELSCOPE_API_KEY 环境变量' },
        { status: 500 }
      )
    }

    // 使用 OpenAI SDK 调用 ModelScope 的嵌入 API
    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api-inference.modelscope.cn/v1'
    })

    // 调用嵌入模型
    const response = await client.embeddings.create({
      model: 'AI-ModelScope/bge-large-zh-v1.5',
      input: text,
      encoding_format: 'float'
    })

    const embedding = response.data[0].embedding

    return NextResponse.json({
      success: true,
      embedding,
      dimensions: embedding.length
    })

  } catch (error) {
    console.error('Embedding API Error:', error)
    
    // 提取错误信息
    const errorMessage = error instanceof Error ? error.message : '向量化失败'
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
