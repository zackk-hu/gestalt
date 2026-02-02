/**
 * RAG 术语翻译系统类型定义
 */

/**
 * 术语映射条目
 */
export interface TerminologyEntry {
  id: string
  domain: string                        // 领域: 医学、法律、金融、技术、商业、教育
  layman_term: string                   // 小白术语
  expert_term: string                   // 专家术语
  expert_example: string                // 专家级 Prompt 示例
  vector?: number[]                     // 向量表示
  metadata?: {
    difficulty: 'basic' | 'intermediate' | 'advanced'
    keywords: string[]
    related_terms: string[]
  }
}

/**
 * 检索结果
 */
export interface RetrievalResult {
  entry: TerminologyEntry
  similarity: number                    // 相似度分数 [0-1]
  relevance_score: number               // 综合相关性得分
}

/**
 * 澄清选项
 */
export interface ClarificationOption {
  id: string
  label: string
  description?: string
  domain?: string
}

/**
 * 澄清请求
 */
export interface ClarificationRequest {
  type: 'domain_selection' | 'term_refinement'
  message: string
  options: ClarificationOption[]
  original_query: string
}

/**
 * 翻译结果
 */
export interface TranslationResult {
  needs_clarification: boolean
  clarification?: ClarificationRequest
  translations?: TerminologyEntry[]
  enhanced_prompt?: string              // 增强后的 Prompt
  metadata: {
    query: string
    domains_detected: string[]
    similarity_scores: number[]
    clarification_reason?: 'similarity_too_low' | 'ambiguity_detected'
    primary_domain?: string
    thinking_template?: string
  }
}

/**
 * 向量检索选项
 */
export interface SearchOptions {
  topK?: number
  domain?: string
  minSimilarity?: number
}

/**
 * 领域描述映射
 */
export const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  '医学': '涉及疾病、症状、诊断、治疗等医疗相关内容',
  '法律': '涉及法律法规、诉讼、合同等法律事务',
  '金融': '涉及投资、理财、银行、证券等金融业务',
  '技术': '涉及编程、软件、硬件等技术开发',
  '商业': '涉及市场营销、管理、运营等商业活动',
  '教育': '涉及教学、培训、学习方法等教育领域',
}

/**
 * 领域关键词映射（用于初步领域检测）
 */
export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  '医学': ['疼', '痛', '症状', '诊断', '治疗', '病', '医', '药', '检查', '手术', '发烧', '头晕'],
  '法律': ['合同', '诉讼', '法律', '法规', '权利', '义务', '违约', '赔偿', '起诉', '仲裁', '辞退'],
  '金融': ['投资', '理财', '股票', '基金', '贷款', '利率', '收益', '风险', '亏损', '资产'],
  '技术': ['代码', '编程', '系统', '算法', '数据库', 'API', '开发', '部署', '性能', '优化', '网站'],
  '商业': ['市场', '营销', '销售', '客户', '产品', '运营', '管理', '战略', '增长', '转化'],
  '教育': ['学习', '教学', '培训', '课程', '考试', '教育', '老师', '学生', '孩子', '成绩'],
}
