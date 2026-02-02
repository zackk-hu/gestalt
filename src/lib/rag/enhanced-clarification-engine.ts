/**
 * 增强版澄清引擎
 * 提供更智能的澄清机制，支持上下文感知和渐进式澄清
 */

import { 
  ClarificationRequest, 
  ClarificationOption, 
  RetrievalResult,
  DOMAIN_DESCRIPTIONS,
  TerminologyEntry
} from './types'

export class EnhancedClarificationEngine {
  private readonly LOW_CONFIDENCE_THRESHOLD = 0.6
  private readonly AMBIGUITY_SCORE_THRESHOLD = 0.15  // 多个领域得分接近时触发

  /**
   * 计算各领域的综合得分
   */
  private calculateDomainScores(
    results: RetrievalResult[],
    domains: string[]
  ): Record<string, number> {
    const scores: Record<string, number> = {}
    
    for (const domain of domains) {
      const domainResults = results.filter(r => r.entry.domain === domain)
      if (domainResults.length > 0) {
        // 使用加权平均 (前面结果权重更高)
        let totalWeight = 0
        let weightedScore = 0
        
        domainResults.forEach((r, idx) => {
          const weight = 1 / (idx + 1)
          weightedScore += r.similarity * weight
          totalWeight += weight
        })
        
        scores[domain] = totalWeight > 0 ? weightedScore / totalWeight : 0
      }
    }
    
    return scores
  }

  /**
   * 从结果中提取领域
   */
  private extractDomainsFromResults(results: RetrievalResult[]): string[] {
    const domains = new Set<string>()
    results.forEach(r => domains.add(r.entry.domain))
    return Array.from(domains)
  }

  /**
   * 获取领域描述
   */
  private getDomainDescription(domain: string): string {
    return DOMAIN_DESCRIPTIONS[domain] || '专业领域相关内容'
  }

  /**
   * 判断是否需要澄清（兼容原方法，支持额外上下文）
   */
  needsClarification(
    results: RetrievalResult[],
    detectedDomains: string[],
    context?: string
  ): boolean {
    // 使用原始逻辑作为基础
    // 情况1: 检索结果为空
    if (results.length === 0) return true

    // 情况2: 最高相似度低于阈值
    if (results[0].similarity < this.LOW_CONFIDENCE_THRESHOLD) return true

    // 情况3: 检测到多个领域且得分接近 (歧义)
    if (detectedDomains.length >= 2) {
      const domainScores = this.calculateDomainScores(results, detectedDomains)
      const topScores = Object.values(domainScores)
        .sort((a, b) => b - a)
        .slice(0, 2)
      
      if (topScores.length >= 2) {
        const scoreDiff = topScores[0] - topScores[1]
        if (scoreDiff < this.AMBIGUITY_SCORE_THRESHOLD) {
          return true  // 多个领域分数接近,存在歧义
        }
      }
    }

    // 增强逻辑：如果所有结果的相似度都低于某个阈值
    const allLowConfidence = results.every(r => r.similarity < 0.3);
    if (allLowConfidence) return true;

    // 增强逻辑：如果上下文信息不足且检索结果不明确，则需要澄清
    if (context && context.trim().length < 10) {
      return true;
    }

    return false
  }

  /**
   * 生成澄清请求（兼容原方法，支持额外上下文）
   */
  generateClarificationRequest(
    query: string,
    results: RetrievalResult[],
    allDomains: string[],
    context?: string
  ): ClarificationRequest {
    // 如果没有任何结果
    if (results.length === 0) {
      return this.createDomainSelectionRequest(query, allDomains)
    }

    // 如果有结果但置信度低
    const detectedDomains = this.extractDomainsFromResults(results)
    
    if (detectedDomains.length === 0) {
      return this.createDomainSelectionRequest(query, allDomains)
    }

    // 如果存在多个可能领域
    if (detectedDomains.length >= 2) {
      return this.createDomainDisambiguationRequest(query, detectedDomains, results)
    }

    // 如果是单一领域但相似度不高
    return this.createTermRefinementRequest(query, results)
  }

  /**
   * 创建领域选择请求
   */
  private createDomainSelectionRequest(
    query: string,
    availableDomains: string[]
  ): ClarificationRequest {
    const displayQuery = query.length > 30 ? query.slice(0, 30) + '...' : query
    
    return {
      type: 'domain_selection',
      message: `您的需求"${displayQuery}"可能涉及多个专业领域。请选择最相关的领域以获得更精准的术语翻译:`,
      options: availableDomains.map(domain => ({
        id: domain,
        label: domain,
        description: this.getDomainDescription(domain),
        domain
      })),
      original_query: query
    }
  }

  /**
   * 创建领域消歧请求
   */
  private createDomainDisambiguationRequest(
    query: string,
    domains: string[],
    results: RetrievalResult[]
  ): ClarificationRequest {
    const domainScores = this.calculateDomainScores(results, domains)
    const displayQuery = query.length > 30 ? query.slice(0, 30) + '...' : query
    
    return {
      type: 'domain_selection',
      message: `检测到您的描述"${displayQuery}"可能涉及多个领域，请选择您实际想表达的专业领域:`,
      options: domains
        .sort((a, b) => (domainScores[b] || 0) - (domainScores[a] || 0))
        .map(domain => ({
          id: domain,
          label: domain,
          description: `相关度: ${((domainScores[domain] || 0) * 100).toFixed(0)}%`,
          domain
        })),
      original_query: query
    }
  }

  /**
   * 创建术语细化请求
   */
  private createTermRefinementRequest(
    query: string,
    results: RetrievalResult[]
  ): ClarificationRequest {
    return {
      type: 'term_refinement',
      message: `找到以下可能相关的专业术语，请选择最符合您需求的:`,
      options: results.slice(0, 4).map((result, idx) => ({
        id: `term_${idx}_${result.entry.id}`,
        label: result.entry.expert_term,
        description: `${result.entry.domain} | 匹配度: ${(result.similarity * 100).toFixed(0)}%`,
        domain: result.entry.domain
      })),
      original_query: query
    }
  }

  /**
   * 生成渐进式澄清请求（分层次逐步澄清）
   */
  generateProgressiveClarification(
    query: string,
    results: RetrievalResult[],
    allDomains: string[],
    hierarchyLevel: 'broad' | 'medium' | 'specific' = 'broad'
  ): ClarificationRequest {
    let message = '';
    let options: ClarificationOption[] = [];

    switch (hierarchyLevel) {
      case 'broad':
        // 广泛领域选择
        message = `检测到您的需求涉及专业领域，请选择最相关的领域：`;
        options = allDomains.map(domain => ({
          id: domain,
          label: domain,
          description: `包含该领域下的专业术语和知识`
        }));
        break;

      case 'medium':
        // 中等粒度选择（领域内的子类别）
        message = `请进一步明确您需要的具体方面：`;
        // 基于术语元数据生成子类别选项
        const subCategories = this.getSubCategories(results);
        options = subCategories.map(category => ({
          id: category,
          label: category,
          description: `相关专业子领域`
        }));
        break;

      case 'specific':
        // 具体术语选择
        message = `请选择最符合您需求的具体术语：`;
        options = results.slice(0, 5).map(result => ({
          id: result.entry.id,
          label: result.entry.expert_term,
          description: result.entry.layman_term
        }));
        break;
    }

    return {
      type: 'domain_selection',
      message,
      options,
      original_query: query
    };
  }

  /**
   * 从术语结果中提取子类别
   */
  private getSubCategories(results: RetrievalResult[]): string[] {
    const categories = new Set<string>();
    
    results.forEach(result => {
      if (result.entry.metadata?.difficulty) {
        categories.add(result.entry.metadata.difficulty);
      }
      if (result.entry.metadata?.keywords) {
        result.entry.metadata.keywords.forEach(keyword => categories.add(keyword));
      }
      if (result.entry.metadata?.related_terms) {
        result.entry.metadata.related_terms.forEach(term => categories.add(term));
      }
    });

    return Array.from(categories).slice(0, 8); // 限制选项数量
  }

  /**
   * 基于实体识别的澄清
   */
  generateEntityBasedClarification(
    query: string,
    entities: string[],
    allDomains: string[]
  ): ClarificationRequest {
    const message = `检测到您提到了以下关键概念：${entities.join(', ')}。请选择您希望深入了解的方面：`;
    
    const options: ClarificationOption[] = [
      ...entities.map(entity => ({
        id: `entity_${entity}`,
        label: entity,
        description: `关于"${entity}"的专业知识`
      })),
      ...allDomains.map(domain => ({
        id: `domain_${domain}`,
        label: domain,
        description: `在${domain}领域中的相关知识`
      }))
    ];

    return {
      type: 'domain_selection',
      message,
      options,
      original_query: query
    };
  }
}

// 单例实例
let enhancedClarificationEngineInstance: EnhancedClarificationEngine | null = null;

export function getEnhancedClarificationEngine(): EnhancedClarificationEngine {
  if (!enhancedClarificationEngineInstance) {
    enhancedClarificationEngineInstance = new EnhancedClarificationEngine();
  }
  return enhancedClarificationEngineInstance;
}