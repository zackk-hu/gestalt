import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const mode = formData.get('mode') as string || 'basic'
    const journalId = formData.get('journalId') as string || ''
    const userRequirements = formData.get('userRequirements') as string || ''

    if (!file) {
      return NextResponse.json({ success: false, error: '未上传文件' }, { status: 400 })
    }

    // 将文件转成 Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 用 pdf-parse 解析 PDF 文本
    type PdfParseFunc = (buf: Buffer) => Promise<{ text: string; numpages: number }>
    const pdfParseModule = await import('pdf-parse')
    const pdfParse = (pdfParseModule as unknown as { default?: PdfParseFunc } & PdfParseFunc).default
      ?? (pdfParseModule as unknown as PdfParseFunc)
    let pdfText = ''
    let numPages = 0
    try {
      const pdfData = await pdfParse(buffer)
      pdfText = pdfData.text || ''
      numPages = pdfData.numpages || 0
    } catch {
      return NextResponse.json({ success: false, error: 'PDF 解析失败，请确保上传有效的 PDF 文件' }, { status: 422 })
    }

    // 截断过长文本（保留前 6000 字符用于 AI 分析）
    const truncatedText = pdfText.slice(0, 6000)

    const apiKey = process.env.DEEPSEEK_API_KEY
    const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'

    if (!apiKey) {
      // 无 API Key 时返回基础解析结果
      return NextResponse.json({
        success: true,
        data: {
          mode: 'basic',
          fileName: file.name,
          numPages,
          textLength: pdfText.length,
          extractedText: truncatedText,
          summary: null,
          entities: [],
          relations: [],
          blueprint: null
        }
      })
    }

    const openai = new OpenAI({ apiKey, baseURL })

    if (mode === 'deep') {
      // 深度分析模式：提取实体、关系、生成蓝图提示词
      const systemPrompt = `你是一位专业的科研论文分析专家和科学图表设计师。
请对用户提供的论文摘录进行深度分析，以 JSON 格式返回以下内容：

{
  "title": "论文标题",
  "authors": ["作者1", "作者2"],
  "journal": "期刊名",
  "abstract": "摘要（100字以内）",
  "keywords": ["关键词1", "关键词2", ...],
  "researchType": "研究类型（实验研究/综述/临床研究/计算研究）",
  "mainFindings": ["主要发现1", "主要发现2", "主要发现3"],
  "entities": [
    { "name": "实体名", "type": "protein|gene|compound|pathway|cell|disease|drug|organism", "role": "角色描述" }
  ],
  "relations": [
    { "from": "实体A", "to": "实体B", "type": "activates|inhibits|binds|phosphorylates|upregulates|downregulates|regulates", "evidence": "证据描述" }
  ],
  "suggestedFigureType": "建议图类型（通路图/网络图/柱状图/热图/流程图/示意图）",
  "blueprintPrompt": {
    "midjourney": "Midjourney风格提示词",
    "dalle": "DALL-E风格提示词",
    "stable_diffusion": "Stable Diffusion风格提示词"
  }
}`

      let journalContext = ''
      if (journalId) {
        journalContext = `\n目标期刊：${journalId}，请在生成的提示词中考虑该期刊的图表规范。`
      }
      if (userRequirements) {
        journalContext += `\n用户需求：${userRequirements}`
      }

      const response = await openai.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL_NAME || 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请分析以下论文内容：\n\n${truncatedText}${journalContext}` }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      const rawContent = response.choices[0]?.message?.content || '{}'
      let analysisResult: Record<string, unknown> = {}
      try {
        // 提取 JSON 块
        const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)\n?```/) || rawContent.match(/(\{[\s\S]*\})/)
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : rawContent
        analysisResult = JSON.parse(jsonStr)
      } catch {
        analysisResult = { raw: rawContent }
      }

      return NextResponse.json({
        success: true,
        data: {
          mode: 'deep',
          fileName: file.name,
          numPages,
          textLength: pdfText.length,
          ...analysisResult
        }
      })
    } else {
      // 基础分析模式：仅摘要提取
      const response = await openai.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL_NAME || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是论文分析助手。请从提供的论文文本中提取：标题、作者、摘要（中文，150字以内）、关键词（5个以内）、主要贡献（3点以内）。以 JSON 格式返回。'
          },
          { role: 'user', content: truncatedText }
        ],
        temperature: 0.2,
        max_tokens: 800
      })

      const rawContent = response.choices[0]?.message?.content || '{}'
      let summaryResult: Record<string, unknown> = {}
      try {
        const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)\n?```/) || rawContent.match(/(\{[\s\S]*\})/)
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : rawContent
        summaryResult = JSON.parse(jsonStr)
      } catch {
        summaryResult = { summary: rawContent }
      }

      return NextResponse.json({
        success: true,
        data: {
          mode: 'basic',
          fileName: file.name,
          numPages,
          textLength: pdfText.length,
          extractedText: truncatedText.slice(0, 500),
          ...summaryResult
        }
      })
    }
  } catch (error) {
    console.error('[analyze-pdf] Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    )
  }
}
