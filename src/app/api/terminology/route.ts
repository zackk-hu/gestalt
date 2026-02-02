import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { 
  getTerminologyTranslator, 
  getPresetTerminology,
  TerminologyEntry 
} from '@/lib/rag'

// 初始化标志
let isInitialized = false
let initializationPromise: Promise<void> | null = null

/**
 * 获取文本的向量表示
 */
async function getEmbedding(text: string, client: OpenAI): Promise<number[]> {
  const response = await client.embeddings.create({
    model: 'AI-ModelScope/bge-large-zh-v1.5',
    input: text,
    encoding_format: 'float'
  })
  return response.data[0].embedding
}

/**
 * 确保术语库已初始化
 */
async function ensureInitialized(): Promise<void> {
  if (isInitialized) return
  
  // 防止并发初始化
  if (initializationPromise) {
    await initializationPromise
    return
  }

  initializationPromise = (async () => {
    const apiKey = process.env.MODELSCOPE_API_KEY
    if (!apiKey) {
      throw new Error('缺少 MODELSCOPE_API_KEY 环境变量')
    }

    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api-inference.modelscope.cn/v1'
    })

    const translator = getTerminologyTranslator()
    
    // 检查是否已经初始化
    if (translator.isInitialized()) {
      isInitialized = true
      return
    }

    const presetData = getPresetTerminology()
    
    console.log(`🔄 正在初始化术语库，共 ${presetData.length} 条数据...`)
    
    // 为预置数据生成向量
    const entriesWithVectors: TerminologyEntry[] = []
    
    for (const entry of presetData) {
      try {
        const vector = await getEmbedding(entry.layman_term, client)
        entriesWithVectors.push({
          ...entry,
          vector
        })
        console.log(`  ✓ ${entry.domain}: ${entry.layman_term}`)
      } catch (error) {
        console.error(`  ✗ 生成向量失败: ${entry.layman_term}`, error)
      }
    }
    
    await translator.initialize(entriesWithVectors)
    isInitialized = true
    console.log('✅ 术语库初始化完成')
  })()

  await initializationPromise
}

/**
 * 术语翻译 API
 * POST /api/terminology
 */
export async function POST(request: NextRequest) {
  try {
    const { query, selectedDomain } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少 query 参数' },
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

    // 确保术语库已初始化
    await ensureInitialized()

    // 获取查询向量
    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api-inference.modelscope.cn/v1'
    })
    
    const queryVector = await getEmbedding(query, client)

    // 执行翻译
    const translator = getTerminologyTranslator()
    const result = await translator.translate(query, queryVector, selectedDomain)

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Terminology API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : '术语翻译失败'
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * 获取术语库状态
 * GET /api/terminology
 */
export async function GET() {
  try {
    const translator = getTerminologyTranslator()
    
    return NextResponse.json({
      success: true,
      initialized: translator.isInitialized(),
      size: translator.size(),
      domains: translator.getAllDomains(),
      stats: translator.getDomainStats()
    })
  } catch (error) {
    console.error('Terminology Status Error:', error)
    
    return NextResponse.json(
      { success: false, error: '获取状态失败' },
      { status: 500 }
    )
  }
}
