/**
 * 术语翻译器
 * 负责协调向量检索、领域检测和澄清机制
 * 增强功能：支持反向澄清和动态角色卡插槽
 */

import { InMemoryVectorStore, getVectorStore } from './vector-store'
import { ClarificationEngine, getClarificationEngine } from './clarification-engine'
import { EnhancedClarificationEngine, getEnhancedClarificationEngine } from './enhanced-clarification-engine'
import { 
  TerminologyEntry, 
  TranslationResult, 
  RetrievalResult,
  ClarificationRequest,
  DOMAIN_KEYWORDS 
} from './types'

export class TerminologyTranslator {
  private vectorStore: InMemoryVectorStore
  private clarificationEngine: ClarificationEngine
  private embeddingCache: Map<string, number[]> = new Map()
  private initialized: boolean = false

  constructor() {
    this.vectorStore = getVectorStore()
    this.clarificationEngine = getEnhancedClarificationEngine() as any // 使用增强版澄清引擎，保持类型兼容
  }

  /**
   * 初始化术语库
   */
  async initialize(entries: TerminologyEntry[]): Promise<void> {
    if (this.initialized && this.vectorStore.size() > 0) {
      console.log('术语库已初始化，跳过')
      return
    }

    await this.vectorStore.addEntries(entries)
    this.initialized = true
    console.log(`✅ 术语库初始化完成，共加载 ${entries.length} 条术语`)
    console.log('📊 领域分布:', this.vectorStore.getDomainStats())
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized && this.vectorStore.size() > 0
  }

  /**
   * 设置向量（用于服务端初始化）
   */
  async setEmbedding(text: string, embedding: number[]): Promise<void> {
    this.embeddingCache.set(text, embedding)
  }

  /**
   * 获取缓存的向量
   */
  getCachedEmbedding(text: string): number[] | undefined {
    return this.embeddingCache.get(text)
  }

  /**
   * 简单领域检测（基于关键词）
   */
  detectDomains(query: string): string[] {
    const detected: string[] = []
    const lowerQuery = query.toLowerCase()

    for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      if (keywords.some(kw => lowerQuery.includes(kw))) {
        detected.push(domain)
      }
    }

    return detected
  }

  /**
   * 获取领域特定的思维链模板
   */
  getThinkingProcessTemplate(domain: string): string {
    const templates: Record<string, string> = {
      '医学': '医学诊断流程: 症状识别 → 病史采集 → 体格检查 → 辅助检查 → 鉴别诊断 → 治疗方案',
      '法律': '法律分析流程: 事实认定 → 法律依据检索 → 风险点分析 → 条款起草 → 合规审查',
      '金融': '金融分析流程: 市场调研 → 风险评估 → 资产配置 → 投资策略 → 风险控制',
      '技术': '技术开发流程: 需求分析 → 系统设计 → 编码实现 → 测试验证 → 部署运维',
      '商业': '商业策略流程: 市场分析 → 用户画像 → 产品定位 → 营销策略 → 效果评估',
      '教育': '教育设计流程: 学习目标 → 内容设计 → 教学方法 → 评估体系 → 反馈优化'
    }
    
    return templates[domain] || '通用分析流程: 问题识别 → 信息收集 → 方案设计 → 实施计划 → 效果评估'
  }

  /**
   * 检查是否需要反向澄清（当相似度低于阈值时）
   */
  needsReverseClarification(results: RetrievalResult[], threshold: number = 0.7): boolean {
    if (results.length === 0) return true
    
    // 检查平均相似度
    const avgSimilarity = results.reduce((sum, r) => sum + r.similarity, 0) / results.length
    return avgSimilarity < threshold
  }

  /**
   * 生成反向澄清请求
   */
  generateReverseClarificationRequest(
    query: string, 
    detectedDomains: string[],
    allDomains: string[]
  ): ClarificationRequest {
    return {
      type: 'domain_selection',
      message: `检测到您的需求比较模糊，无法精确匹配到专业知识。请选择您需要的具体领域：`,
      options: detectedDomains.length > 0 
        ? detectedDomains.map(domain => ({
            id: domain,
            label: domain,
            description: `与${domain}相关的专业知识`
          }))
        : allDomains.map(domain => ({
            id: domain,
            label: domain,
            description: `与${domain}相关的专业知识`
          })),
      original_query: query
    }
  }

  /**
   * 翻译小白术语到专家术语
   */
  async translate(
    query: string,
    queryVector: number[],
    selectedDomain?: string
  ): Promise<TranslationResult> {
    // 1. 检测可能的领域
    const detectedDomains = selectedDomain 
      ? [selectedDomain] 
      : this.detectDomains(query)

    // 2. 向量检索
    const searchOptions = selectedDomain 
      ? { domain: selectedDomain, topK: 5, minSimilarity: 0.3 }
      : { topK: 10, minSimilarity: 0.3 }

    const results = await this.vectorStore.search(queryVector, searchOptions)

    // 3. 检查是否需要反向澄清（当相似度过低时）
    if (this.needsReverseClarification(results)) {
      const clarification = this.generateReverseClarificationRequest(
        query,
        detectedDomains,
        this.vectorStore.getAllDomains()
      )

      return {
        needs_clarification: true,
        clarification,
        metadata: {
          query,
          domains_detected: detectedDomains,
          similarity_scores: results.map(r => r.similarity),
          clarification_reason: 'similarity_too_low'
        }
      }
    }

    // 4. 判断是否需要澄清
    const needsClarification = this.clarificationEngine.needsClarification(
      results,
      detectedDomains
    )

    if (needsClarification) {
      const clarification = this.clarificationEngine.generateClarificationRequest(
        query,
        results,
        this.vectorStore.getAllDomains()
      )

      return {
        needs_clarification: true,
        clarification,
        metadata: {
          query,
          domains_detected: detectedDomains,
          similarity_scores: results.map(r => r.similarity),
          clarification_reason: 'ambiguity_detected'
        }
      }
    }

    // 5. 不需要澄清，直接返回翻译结果
    const topResults = results.slice(0, 3)
    const primaryDomain = selectedDomain || detectedDomains[0] || '通用'
    const thinkingTemplate = this.getThinkingProcessTemplate(primaryDomain)
    
    const enhancedPrompt = this.buildEnhancedPrompt(query, topResults, thinkingTemplate)

    return {
      needs_clarification: false,
      translations: topResults.map(r => r.entry),
      enhanced_prompt: enhancedPrompt,
      metadata: {
        query,
        domains_detected: detectedDomains,
        similarity_scores: results.map(r => r.similarity),
        primary_domain: primaryDomain,
        thinking_template: thinkingTemplate
      }
    }
  }

  /**
   * 构建增强后的 Prompt（包含思维链模板）
   */
  private buildEnhancedPrompt(
    originalQuery: string,
    results: RetrievalResult[],
    thinkingTemplate: string
  ): string {
    if (results.length === 0) return originalQuery

    const topResult = results[0].entry

    // 构建术语映射参考
    let knowledgeContext = ''
    results.forEach((result, idx) => {
      knowledgeContext += `${idx + 1}. "${result.entry.layman_term}" → "${result.entry.expert_term}" (${result.entry.domain})\n`
    })

    return `## 术语映射参考

**用户原始需求**: ${originalQuery}

**检索到的专业术语映射**:
${knowledgeContext}

**最佳匹配**:
- 专业术语: ${topResult.expert_term}
- 所属领域: ${topResult.domain}

**专家级 Prompt 示例**:
${topResult.expert_example}

## 思维链模板

**专业分析流程**: ${thinkingTemplate}

---

请基于以上专业术语、示例和思维流程，生成优化后的 Prompt。确保使用正确的专业术语，模仿专家级示例的结构和语气，并遵循指定的思维流程。`
  }

  /**
   * 获取所有领域
   */
  getAllDomains(): string[] {
    return this.vectorStore.getAllDomains()
  }

  /**
   * 获取领域统计
   */
  getDomainStats(): Record<string, number> {
    return this.vectorStore.getDomainStats()
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.embeddingCache.clear()
  }

  /**
   * 获取术语库大小
   */
  size(): number {
    return this.vectorStore.size()
  }
}

// 单例实例
let translatorInstance: TerminologyTranslator | null = null

export function getTerminologyTranslator(): TerminologyTranslator {
  if (!translatorInstance) {
    translatorInstance = new TerminologyTranslator()
  }
  return translatorInstance
}
