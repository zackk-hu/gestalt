/**
 * 内存向量数据库
 * 使用余弦相似度进行检索
 */

import { TerminologyEntry, RetrievalResult, SearchOptions } from './types'

export class InMemoryVectorStore {
  private entries: Map<string, TerminologyEntry> = new Map()
  private domainIndex: Map<string, Set<string>> = new Map()

  /**
   * 添加术语条目
   */
  async addEntry(entry: TerminologyEntry): Promise<void> {
    this.entries.set(entry.id, entry)
    
    // 构建领域索引
    if (!this.domainIndex.has(entry.domain)) {
      this.domainIndex.set(entry.domain, new Set())
    }
    this.domainIndex.get(entry.domain)!.add(entry.id)
  }

  /**
   * 批量添加条目
   */
  async addEntries(entries: TerminologyEntry[]): Promise<void> {
    for (const entry of entries) {
      await this.addEntry(entry)
    }
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
    
    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    return denominator === 0 ? 0 : dotProduct / denominator
  }

  /**
   * 向量检索
   */
  async search(
    queryVector: number[],
    options?: SearchOptions
  ): Promise<RetrievalResult[]> {
    const { topK = 5, domain, minSimilarity = 0.0 } = options || {}
    
    let candidateIds: string[]
    
    // 如果指定领域,只在该领域内检索
    if (domain && this.domainIndex.has(domain)) {
      candidateIds = Array.from(this.domainIndex.get(domain)!)
    } else {
      candidateIds = Array.from(this.entries.keys())
    }
    
    const results: RetrievalResult[] = []
    
    for (const id of candidateIds) {
      const entry = this.entries.get(id)!
      if (!entry.vector) continue
      
      const similarity = this.cosineSimilarity(queryVector, entry.vector)
      
      if (similarity >= minSimilarity) {
        results.push({
          entry,
          similarity,
          relevance_score: similarity
        })
      }
    }
    
    // 按相似度排序并返回 TopK
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
  }

  /**
   * 按 ID 获取条目
   */
  getEntry(id: string): TerminologyEntry | undefined {
    return this.entries.get(id)
  }

  /**
   * 获取所有领域
   */
  getAllDomains(): string[] {
    return Array.from(this.domainIndex.keys())
  }

  /**
   * 按领域获取条目数量
   */
  getDomainStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    for (const [domain, ids] of this.domainIndex.entries()) {
      stats[domain] = ids.size
    }
    return stats
  }

  /**
   * 获取领域内的所有条目
   */
  getEntriesByDomain(domain: string): TerminologyEntry[] {
    const ids = this.domainIndex.get(domain)
    if (!ids) return []
    return Array.from(ids).map(id => this.entries.get(id)!).filter(Boolean)
  }

  /**
   * 清空数据
   */
  clear(): void {
    this.entries.clear()
    this.domainIndex.clear()
  }

  /**
   * 获取总条目数
   */
  size(): number {
    return this.entries.size
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.entries.size > 0
  }
}

// 单例实例
let vectorStoreInstance: InMemoryVectorStore | null = null

export function getVectorStore(): InMemoryVectorStore {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new InMemoryVectorStore()
  }
  return vectorStoreInstance
}
