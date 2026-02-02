/**
 * 增强的提示词构建器
 * 自动注入学术知识和领域相关信息
 */

import { RetrievalResult } from './types';

export interface KnowledgeInjectionOptions {
  domain?: string;
  keywords?: string[];
  includeExamples?: boolean;
  includeMethodology?: boolean;
  includeReferences?: boolean;
}

export class EnhancedPromptBuilder {
  
  /**
   * 构建带有自动知识注入的提示词
   */
  static buildEnhancedAcademicPrompt(
    basePrompt: string,
    query: string,
    retrievalResults: RetrievalResult[],
    options: KnowledgeInjectionOptions = {}
  ): string {
    const { domain, keywords = [], includeExamples = true, includeMethodology = true, includeReferences = true } = options;
    
    // 构建知识上下文
    const knowledgeContext = this.buildKnowledgeContext(retrievalResults, domain, keywords);
    
    // 构建方法论上下文
    const methodologyContext = includeMethodology ? this.buildMethodologyContext(domain) : '';
    
    // 构建示例上下文
    const examplesContext = includeExamples ? this.buildExamplesContext(retrievalResults, domain) : '';
    
    // 构建参考文献上下文
    const referencesContext = includeReferences ? this.buildReferencesContext(retrievalResults) : '';
    
    // 合并所有上下文
    let enhancedPrompt = basePrompt;
    
    if (knowledgeContext) {
      enhancedPrompt += `

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
${knowledgeContext}
"""
`;
    }
    
    if (methodologyContext) {
      enhancedPrompt += `

## Methodology Context (方法论指导)
"""
${methodologyContext}
"""
`;
    }
    
    if (examplesContext) {
      enhancedPrompt += `

## Example Context (示例参考)
"""
${examplesContext}
"""
`;
    }
    
    if (referencesContext) {
      enhancedPrompt += `

## Reference Context (参考文献)
"""
${referencesContext}
"""
`;
    }
    
    return enhancedPrompt;
  }
  
  /**
   * 构建知识上下文
   */
  private static buildKnowledgeContext(results: RetrievalResult[], domain?: string, keywords: string[] = []): string {
    if (results.length === 0) return '';
    
    const relevantResults = results.filter(r => !domain || r.entry.domain === domain);
    const knowledgeItems: string[] = [];
    
    // 从检索结果中提取知识要点
    relevantResults.forEach((result, index) => {
      if (index < 3) { // 限制数量以避免过长
        knowledgeItems.push(`- ${result.entry.expert_term}: ${this.extractKeyInformation(result.entry.expert_example)}`);
      }
    });
    
    // 添加关键词相关信息
    if (keywords.length > 0) {
      knowledgeItems.push(`- 关键概念: ${keywords.join(', ')}`);
    }
    
    return knowledgeItems.join('\n');
  }
  
  /**
   * 构建方法论上下文
   */
  private static buildMethodologyContext(domain?: string): string {
    if (!domain) return '';
    
    const methodologies: Record<string, string> = {
      '生物学': '科学方法论: 观察 → 假设 → 实验 → 分析 → 结论，注重对照实验和统计显著性',
      '化学': '实验设计原则: 变量控制、重复性、定量分析，遵循化学反应定律',
      '物理学': '理论建模与实验验证: 数学建模、假设检验、误差分析',
      '工程学': '工程设计流程: 需求分析 → 概念设计 → 详细设计 → 验证测试 → 优化迭代',
      '计算机科学': '算法设计范式: 问题分析 → 算法设计 → 复杂度分析 → 实现验证',
      '医学': '循证医学原则: 临床观察 → 文献回顾 → 诊断推理 → 治疗方案 → 效果评估',
      '法学': '法律分析方法: 事实认定 → 法律适用 → 逻辑推理 → 结论论证',
      '经济学': '经济分析框架: 问题界定 → 模型构建 → 数据分析 → 政策建议'
    };
    
    return methodologies[domain] || '通用研究方法: 问题识别 → 文献回顾 → 方法选择 → 数据收集 → 分析论证 → 结论总结';
  }
  
  /**
   * 构建示例上下文
   */
  private static buildExamplesContext(results: RetrievalResult[], domain?: string): string {
    if (results.length === 0) return '';
    
    const relevantResults = results.filter(r => !domain || r.entry.domain === domain);
    const examples: string[] = [];
    
    // 从检索结果中提取示例
    relevantResults.slice(0, 2).forEach((result, index) => {
      const exampleLines = result.entry.expert_example.split('\n');
      // 提取Role和Profile部分作为示例
      const roleLine = exampleLines.find(line => line.startsWith('# Role:'));
      const profileStartIndex = exampleLines.findIndex(line => line.startsWith('## Profile'));
      const profileEndIndex = exampleLines.findIndex((line, i) => i > profileStartIndex && line.startsWith('# '));
      
      if (roleLine) {
        examples.push(`示例${index + 1}: ${roleLine.replace('# Role: ', '')}`);
      }
      
      if (profileStartIndex !== -1) {
        const profileLines = profileEndIndex !== -1 
          ? exampleLines.slice(profileStartIndex, profileEndIndex) 
          : exampleLines.slice(profileStartIndex, profileStartIndex + 5); // 最多取5行
        examples.push(`简介: ${profileLines.join(' ').replace(/## Profile\s*/,'').substring(0, 200)}...`);
      }
    });
    
    return examples.join('\n');
  }
  
  /**
   * 构建参考文献上下文
   */
  private static buildReferencesContext(results: RetrievalResult[]): string {
    if (results.length === 0) return '';
    
    // 提取高频关键词作为参考主题
    const allKeywords = results.flatMap(r => r.entry.metadata?.keywords || []);
    const keywordCounts: Record<string, number> = {};
    
    allKeywords.forEach(kw => {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
    });
    
    // 获取出现频率最高的关键词
    const sortedKeywords = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([kw]) => kw);
    
    if (sortedKeywords.length > 0) {
      return `推荐参考主题: ${sortedKeywords.join(', ')}`;
    }
    
    return '';
  }
  
  /**
   * 从专家示例中提取关键信息
   */
  private static extractKeyInformation(expertExample: string): string {
    // 简单提取前几行作为关键信息
    const lines = expertExample.split('\n').filter(line => line.trim() !== '');
    let extractedInfo = '';
    
    for (const line of lines) {
      if (line.startsWith('# Role:') || line.startsWith('## Profile') || line.startsWith('## Skills')) {
        extractedInfo += line.replace(/# Role:|## Profile|## Skills/, '').trim() + '; ';
      }
      
      // 限制长度
      if (extractedInfo.length > 200) {
        extractedInfo = extractedInfo.substring(0, 200) + '...';
        break;
      }
    }
    
    return extractedInfo || expertExample.substring(0, 100) + '...';
  }
  
  /**
   * 为特定查询构建定制化提示词
   */
  static buildCustomizedPrompt(
    query: string,
    domain: string,
    taskType: 'research-paper' | 'analysis' | 'report' | 'proposal' | 'tutorial' = 'research-paper'
  ): string {
    const baseStructure = this.getBaseStructure(taskType);
    
    // 根据领域和任务类型定制
    const domainSpecificGuidance = this.getDomainSpecificGuidance(domain, taskType);
    
    // 构建完整的提示词
    return `# Role: ${this.getRoleByDomainAndTask(domain, taskType)}

## Profile
你是该领域的资深专家，具备深厚的理论知识和丰富的实践经验。

## Context
${this.getContextByTask(taskType)}

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
${domainSpecificGuidance}
"""

## Skills
${this.getSkillsByDomain(domain)}

## Reasoning Mode
${this.getReasoningModeByTask(taskType)}

## Workflow
${this.getWorkflowByTask(taskType)}

## Constraints
- 基于可靠的数据和理论
- 保持客观、严谨的学术态度
- 遵循相应领域的规范和标准
- 确保逻辑清晰、论证充分

## Output Format
${this.getOutputFormatByTask(taskType)}`;
  }
  
  private static getBaseStructure(taskType: string): string {
    return `# Role: [角色名称]

## Profile
[角色的专业背景和核心能力描述]

## Context
[任务的背景信息、使用场景、目标受众]

## Knowledge Context (外部知识库)
"""
[此处将注入检索到的相关文档]
"""

## Skills
[该角色需要具备的技能列表]

## Reasoning Mode
[当前推理模式说明]

## Workflow
[根据复杂度注入对应的推理策略]

## Constraints
[输出的约束条件和限制]

## Output Format
[期望的输出格式和结构]`;
  }
  
  private static getDomainSpecificGuidance(domain: string, taskType: string): string {
    const guidanceMap: Record<string, Record<string, string>> = {
      '生物学': {
        'research-paper': '- 生物学研究方法: 假设驱动、对照实验、统计分析\n- 重要概念: 细胞、基因、进化、代谢、生态\n- 常用技术: PCR、测序、显微镜、色谱',
        'analysis': '- 系统性分析生物现象\n- 考虑分子、细胞、个体、种群等多个层面\n- 关注因果关系和调节机制',
        'report': '- 遵循IMRAD结构 (Introduction, Methods, Results, Discussion)\n- 准确描述实验条件和观察结果\n- 统计分析和显著性检验'
      },
      '化学': {
        'research-paper': '- 化学研究方法: 理论计算、合成、表征、分析\n- 重要概念: 原子、分子、化学键、反应机理\n- 常用技术: 光谱、色谱、质谱、X射线衍射',
        'analysis': '- 分子层面的分析\n- 反应路径和能量变化\n- 结构与性质关系',
        'report': '- 详细的实验步骤和条件\n- 纯度和产率计算\n- 安全注意事项'
      },
      '医学': {
        'research-paper': '- 循证医学方法: 临床试验、队列研究、病例对照\n- 重要概念: 病理生理、药理、诊断、治疗\n- 伦理考虑: 知情同意、IRB批准',
        'analysis': '- 临床思维: 症状识别 → 病史采集 → 体格检查 → 辅助检查 → 诊断 → 治疗\n- 鉴别诊断和并发症预防',
        'report': '- 结构化病历书写\n- 诊断依据和治疗方案\n- 预后评估和随访计划'
      }
    };
    
    return guidanceMap[domain]?.[taskType] || '根据具体领域知识进行专业分析';
  }
  
  private static getRoleByDomainAndTask(domain: string, taskType: string): string {
    const roles: Record<string, Record<string, string>> = {
      '生物学': {
        'research-paper': '生物学家',
        'analysis': '生物信息分析师',
        'report': '实验室研究员',
        'proposal': '科研项目负责人',
        'tutorial': '生物学科普专家'
      },
      '化学': {
        'research-paper': '化学家',
        'analysis': '分析化学家',
        'report': '化学工程师',
        'proposal': '材料科学家',
        'tutorial': '化学教育专家'
      },
      '医学': {
        'research-paper': '医学研究员',
        'analysis': '临床流行病学家',
        'report': '主治医师',
        'proposal': '临床研究协调员',
        'tutorial': '医学教育专家'
      }
    };
    
    return roles[domain]?.[taskType] || `${domain}领域专家`;
  }
  
  private static getContextByTask(taskType: string): string {
    const contexts: Record<string, string> = {
      'research-paper': '这篇论文面向学术界同行，旨在分享最新的研究成果和理论进展。',
      'analysis': '这份分析报告面向专业人士，旨在深入剖析特定问题或现象。',
      'report': '这份报告面向相关利益方，旨在汇报研究结果或项目进展。',
      'proposal': '这份提案面向资助机构或管理层，旨在获得项目支持或资源分配。',
      'tutorial': '这份教程面向学习者，旨在传授特定知识或技能。'
    };
    
    return contexts[taskType] || '本工作面向相关专业人士，旨在解决特定问题或提供专业见解。';
  }
  
  private static getSkillsByDomain(domain: string): string {
    const skills: Record<string, string[]> = {
      '生物学': [
        '掌握生物学核心概念和理论',
        '熟悉实验设计和数据分析',
        '了解最新研究进展和技术',
        '具备批判性思维能力'
      ],
      '化学': [
        '掌握化学反应原理和机理',
        '熟悉实验技术和安全规范',
        '具备分子设计和合成能力',
        '了解分析和表征方法'
      ],
      '医学': [
        '掌握医学基础知识和临床技能',
        '具备诊断和治疗能力',
        '了解医学伦理和法规',
        '持续学习和知识更新能力'
      ]
    };
    
    return (skills[domain] || ['掌握该领域核心知识', '具备专业分析能力', '了解最新进展']).map(s => `- ${s}`).join('\n');
  }
  
  private static getReasoningModeByTask(taskType: string): string {
    const modes: Record<string, string> = {
      'research-paper': '思维链(CoT) - 逐步构建论文的逻辑结构，确保内容的全面性和准确性',
      'analysis': '分析链(CoA) - 系统性分析问题，考虑多个因素和相互关系',
      'report': '结构化(SoR) - 按照既定格式和标准组织内容',
      'proposal': '论证式(ArgP) - 提出观点并提供有力证据支持',
      'tutorial': '教学式(TeachP) - 清晰解释概念，提供实例和练习'
    };
    
    return modes[taskType] || '思维链(CoT) - 逐步分析问题，确保逻辑清晰';
  }
  
  private static getWorkflowByTask(taskType: string): string {
    const workflows: Record<string, string> = {
      'research-paper': '1. **引言**：研究背景和问题陈述\n2. **文献综述**：相关研究回顾\n3. **方法**：研究设计和实施\n4. **结果**：数据呈现和分析\n5. **讨论**：结果解释和意义\n6. **结论**：总结和未来方向\n7. **参考文献**：引用文献列表',
      'analysis': '1. **问题定义**：明确分析目标\n2. **数据收集**：获取相关信息\n3. **方法选择**：确定分析策略\n4. **实施分析**：执行分析过程\n5. **结果解释**：分析结果解读\n6. **建议**：基于分析提出建议',
      'report': '1. **摘要**：主要内容概述\n2. **背景**：问题来源和重要性\n3. **方法**：研究或工作方法\n4. **结果**：主要发现\n5. **讨论**：结果分析和含义\n6. **结论**：主要结论\n7. **建议**：后续行动建议',
      'proposal': '1. **问题陈述**：待解决的问题\n2. **目标设定**：预期达成的目标\n3. **方法论**：解决问题的方法\n4. **资源需求**：所需资源和预算\n5. **时间计划**：实施时间表\n6. **预期成果**：预期收益和影响',
      'tutorial': '1. **学习目标**：明确学习目的\n2. **预备知识**：必要的前置知识\n3. **核心内容**：主要知识点\n4. **实例演示**：具体应用示例\n5. **练习活动**：巩固学习的练习\n6. **总结回顾**：内容总结和要点回顾'
    };
    
    return workflows[taskType] || '1. **准备阶段**：收集资料和制定计划\n2. **执行阶段**：按步骤实施\n3. **验证阶段**：检查结果和质量\n4. **总结阶段**：整理和汇报';
  }
  
  private static getOutputFormatByTask(taskType: string): string {
    const formats: Record<string, string> = {
      'research-paper': '学术论文格式，包含标题、摘要、关键词、引言、方法、结果、讨论、结论和参考文献等标准部分。',
      'analysis': '分析报告格式，包含执行摘要、分析框架、主要发现、图表支持和结论建议等部分。',
      'report': '正式报告格式，包含封面、目录、摘要、正文、结论和附录等标准部分。',
      'proposal': '项目提案格式，包含问题陈述、解决方案、实施计划、预算和预期成果等部分。',
      'tutorial': '教学材料格式，包含学习目标、内容讲解、实例演示、练习题和答案等部分。'
    };
    
    return formats[taskType] || '结构化文档格式，包含清晰的标题、有序的内容组织和完整的结论。';
  }
}

export default EnhancedPromptBuilder;