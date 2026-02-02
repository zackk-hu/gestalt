/**
 * RAG 术语翻译系统
 * 统一导出入口
 */

// 类型定义
export * from './types'

// 向量存储
export { InMemoryVectorStore, getVectorStore } from './vector-store'

// 澄清引擎
export { ClarificationEngine, getClarificationEngine } from './clarification-engine'

// 术语翻译器
export { TerminologyTranslator, getTerminologyTranslator } from './terminology-translator'

// 术语数据
export { 
  TERMINOLOGY_DATABASE, 
  getPresetTerminology, 
  getAllDomains,
  getTerminologyByDomain 
} from './terminology-data'

// 学术知识库
export { 
  ACADEMIC_KNOWLEDGE_DATABASE, 
  getAcademicKnowledge, 
  getAcademicKnowledgeByDomain 
} from './academic-knowledge'

// 扩展学术知识库
export { 
  EXTENDED_ACADEMIC_KNOWLEDGE_DATABASE, 
  getExtendedAcademicKnowledge, 
  getExtendedAcademicKnowledgeByDomain 
} from './extended-academic-knowledge'

// 增强澄清引擎
export { 
  EnhancedClarificationEngine, 
  getEnhancedClarificationEngine 
} from './enhanced-clarification-engine'

// 增强提示词构建器
export { 
  EnhancedPromptBuilder 
} from './enhanced-prompt-builder'
