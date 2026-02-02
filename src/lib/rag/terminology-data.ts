/**
 * 预置术语映射数据
 * 6 个领域，每领域 2 条示例
 */

import { TerminologyEntry } from './types'

/**
 * 术语数据库（不含向量，向量将在初始化时生成）
 */
import { getAcademicKnowledge } from './academic-knowledge'
import { getExtendedAcademicKnowledge } from './extended-academic-knowledge'

/**
 * 术语数据库（不含向量，向量将在初始化时生成）
 */
export const TERMINOLOGY_DATABASE: Omit<TerminologyEntry, 'vector'>[] = [
  // ========== 学术知识库 ==========
  ...getAcademicKnowledge(), // 合并基础学术知识库
  ...getExtendedAcademicKnowledge(), // 合并扩展学术知识库
  
  // ========== 医学领域 ==========
  {
    id: 'med_001',
    domain: '医学',
    layman_term: '肚子右下角疼',
    expert_term: '麦氏点压痛 (McBurney point tenderness)',
    expert_example: `# Role: 急诊外科医师

## Profile
专业背景: 急诊外科，擅长急腹症诊断

## Task
根据患者描述的麦氏点压痛体征，进行阑尾炎的初步诊断和鉴别诊断。

## Workflow
1. 询问疼痛转移史（脐周 → 右下腹）
2. 检查反跳痛和肌紧张
3. 排除其他急腹症（如卵巢囊肿扭转、克罗恩病）
4. 决定是否需要影像学检查

## Constraints
- 不直接诊断，需结合辅助检查
- 注意特殊人群（孕妇、老人）的非典型表现`,
    metadata: {
      difficulty: 'intermediate',
      keywords: ['疼痛', '腹部', '右下腹', '阑尾炎'],
      related_terms: ['反跳痛', '肌紧张', '罗氏征']
    }
  },
  {
    id: 'med_002',
    domain: '医学',
    layman_term: '头晕头痛想吐',
    expert_term: '颅内高压三主征',
    expert_example: `# Role: 神经内科专家

## Profile
专业背景: 神经内科，擅长颅脑疾病诊断

## Task
评估颅内高压三主征（头痛、呕吐、视乳头水肿），判断病因。

## Workflow
1. 询问头痛特点（晨起加重？）
2. 检查眼底（视乳头水肿）
3. 评估意识水平和生命体征
4. 安排头颅 CT/MRI 排查占位性病变

## Constraints
- 禁忌腰穿（存在颅内压增高时）
- 注意脑疝前驱症状`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['头痛', '呕吐', '颅内压'],
      related_terms: ['脑水肿', '占位性病变', '脑疝']
    }
  },

  // ========== 法律领域 ==========
  {
    id: 'law_001',
    domain: '法律',
    layman_term: '公司突然把我辞退了',
    expert_term: '违法解除劳动合同',
    expert_example: `# Role: 劳动法律师

## Profile
专业背景: 劳动法专业律师，擅长劳动争议仲裁

## Task
判断用人单位解除劳动合同是否符合《劳动合同法》第39-41条规定。

## Workflow
1. 审查解除通知书和解除理由
2. 判断是否属于过失性辞退（第39条）或非过失性辞退（第40条）
3. 检查程序合法性（是否提前30天通知或支付代通知金）
4. 计算赔偿金 = 2N（N为工作年限）

## Constraints
- 需区分违法解除（2N）和经济补偿（N）
- 注意仲裁时效（1年）`,
    metadata: {
      difficulty: 'intermediate',
      keywords: ['辞退', '解除', '劳动合同'],
      related_terms: ['经济补偿金', '赔偿金', '劳动仲裁']
    }
  },
  {
    id: 'law_002',
    domain: '法律',
    layman_term: '签了合同对方不履行',
    expert_term: '合同违约与违约责任',
    expert_example: `# Role: 合同法律顾问

## Profile
专业背景: 合同法专业律师，擅长商事合同纠纷

## Task
分析合同违约行为，确定违约责任承担方式。

## Workflow
1. 审查合同约定的违约条款
2. 判断违约类型（迟延履行/不完全履行/拒绝履行）
3. 计算违约金或实际损失
4. 起草律师函或起诉状

## Constraints
- 违约金过高可申请法院调整（不超过损失的30%）
- 注意诉讼时效（3年）`,
    metadata: {
      difficulty: 'basic',
      keywords: ['合同', '违约', '履行'],
      related_terms: ['违约金', '继续履行', '损害赔偿']
    }
  },

  // ========== 金融领域 ==========
  {
    id: 'fin_001',
    domain: '金融',
    layman_term: '股票一直跌怎么办',
    expert_term: '止损策略与仓位管理',
    expert_example: `# Role: 资深股票投资顾问

## Profile
专业背景: 证券分析师，擅长风险管理

## Task
根据投资者的风险承受能力，制定止损和仓位管理策略。

## Workflow
1. 评估当前持仓亏损比例
2. 分析下跌原因（系统性风险 vs 个股风险）
3. 设定止损线（建议 -7% 到 -10%）
4. 制定分批止损或补仓计划

## Constraints
- 不追涨杀跌
- 单只股票仓位不超过总资产的20%
- 严格执行纪律，避免情绪化操作`,
    metadata: {
      difficulty: 'intermediate',
      keywords: ['股票', '亏损', '止损'],
      related_terms: ['仓位管理', '风险控制', '分散投资']
    }
  },
  {
    id: 'fin_002',
    domain: '金融',
    layman_term: '想理财但不知道怎么开始',
    expert_term: '资产配置与投资规划',
    expert_example: `# Role: 理财规划师 (CFP)

## Profile
专业背景: 持证理财规划师，擅长家庭资产配置

## Task
根据客户的财务状况、风险偏好和投资期限，制定个性化资产配置方案。

## Workflow
1. 财务诊断（收入、支出、负债、资产）
2. 风险测评（保守型/稳健型/积极型）
3. 配置建议（现金、固收、权益、另类资产）
4. 定期再平衡

## 经典配置比例
- 保守型: 债券70% + 股票20% + 现金10%
- 稳健型: 债券50% + 股票40% + 现金10%
- 积极型: 股票70% + 债券20% + 现金10%

## Constraints
- 遵循"生命周期投资理论"（股票比例 = 100 - 年龄）
- 保留 3-6 个月的紧急备用金`,
    metadata: {
      difficulty: 'basic',
      keywords: ['理财', '投资', '资产配置'],
      related_terms: ['风险评估', '基金定投', '保险规划']
    }
  },

  // ========== 技术领域 ==========
  {
    id: 'tech_001',
    domain: '技术',
    layman_term: '网站加载很慢怎么优化',
    expert_term: 'Web 性能优化 (Performance Optimization)',
    expert_example: `# Role: 前端性能优化专家

## Profile
专业背景: 高级前端工程师，擅长性能调优

## Task
诊断并优化网站加载速度，提升 Core Web Vitals 指标。

## Workflow
1. 使用 Lighthouse 和 WebPageTest 进行性能审计
2. 优化 LCP (Largest Contentful Paint)
   - 压缩图片（WebP/AVIF）
   - CDN 加速
   - 服务端渲染（SSR）或预渲染
3. 优化 FID (First Input Delay)
   - 代码分割（Code Splitting）
   - 延迟加载非关键资源
4. 优化 CLS (Cumulative Layout Shift)
   - 为图片和广告预留空间
   - 避免动态内容插入

## Constraints
- 目标: LCP < 2.5s, FID < 100ms, CLS < 0.1
- 使用 Tree Shaking 移除未使用代码`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['性能', '优化', '网站', '加载'],
      related_terms: ['CDN', '缓存', '懒加载', 'Core Web Vitals']
    }
  },
  {
    id: 'tech_002',
    domain: '技术',
    layman_term: '怎么让 AI 记住上下文',
    expert_term: 'RAG 长上下文记忆系统',
    expert_example: `# Role: AI 架构师

## Profile
专业背景: AI 系统架构师，擅长 LLM 应用开发

## Task
设计基于 RAG (Retrieval-Augmented Generation) 的对话记忆系统。

## Architecture
1. **向量数据库**: Pinecone/Weaviate/Qdrant
2. **嵌入模型**: text-embedding-3-small
3. **检索策略**: 混合检索（向量 + 关键词）
4. **上下文窗口管理**: 滑动窗口 + 摘要压缩

## Workflow
1. 用户输入 → 查询向量化
2. 从向量库检索 Top-K 相关历史
3. 构造 Prompt: [系统提示词] + [检索到的历史] + [当前问题]
4. LLM 生成回复 → 存储到向量库

## Constraints
- 控制总 Token 数不超过模型上下文窗口
- 使用 Reranker 模型提高召回精度`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['AI', '上下文', '记忆', 'RAG'],
      related_terms: ['向量数据库', 'Embedding', 'LLM']
    }
  },

  // ========== 商业领域 ==========
  {
    id: 'biz_001',
    domain: '商业',
    layman_term: '怎么提高产品销量',
    expert_term: '增长黑客与转化漏斗优化',
    expert_example: `# Role: 增长产品经理

## Profile
专业背景: 增长黑客，擅长用户增长和转化优化

## Task
使用 AARRR 模型分析用户旅程，找到增长瓶颈并优化转化率。

## Framework: AARRR
1. **Acquisition (获客)**: 渠道ROI分析，优化投放策略
2. **Activation (激活)**: Aha Moment 设计，新手引导优化
3. **Retention (留存)**: 用户分层，推送/EDM 召回
4. **Revenue (变现)**: 定价策略，Up-Sell/Cross-Sell
5. **Referral (推荐)**: 裂变机制，老带新激励

## Workflow
1. 绘制转化漏斗，找到流失最严重的环节
2. 进行 A/B 测试验证优化方案
3. 监控 NSM (North Star Metric) 指标

## Constraints
- 避免过度优化单一指标导致整体体验下降
- 关注用户 LTV (Lifetime Value) 而非短期GMV`,
    metadata: {
      difficulty: 'intermediate',
      keywords: ['销量', '增长', '转化率'],
      related_terms: ['AARRR', 'A/B测试', '用户留存', 'PMF']
    }
  },
  {
    id: 'biz_002',
    domain: '商业',
    layman_term: '怎么做好市场营销',
    expert_term: '整合营销传播 (IMC) 策略',
    expert_example: `# Role: 品牌营销总监

## Profile
专业背景: 品牌策略专家，擅长整合营销传播

## Task
制定跨渠道的整合营销传播策略，实现品效合一。

## Framework: 4P + 4C
- Product → Customer Value (产品价值)
- Price → Cost (用户成本)
- Place → Convenience (渠道便利性)
- Promotion → Communication (品牌沟通)

## Workflow
1. 市场调研与竞品分析
2. 目标人群画像与定位
3. 核心信息与创意策略
4. 媒介组合与预算分配
5. 效果追踪与优化迭代

## Constraints
- 保持品牌调性一致
- ROI 导向，可量化评估`,
    metadata: {
      difficulty: 'intermediate',
      keywords: ['营销', '市场', '品牌'],
      related_terms: ['4P理论', 'STP', '品牌定位']
    }
  },

  // ========== 教育领域 ==========
  {
    id: 'edu_001',
    domain: '教育',
    layman_term: '怎么让孩子主动学习',
    expert_term: '内在动机激发与自主学习能力培养',
    expert_example: `# Role: 教育心理学专家

## Profile
专业背景: 教育心理学博士，擅长学习动机研究

## Task
基于自我决定理论 (Self-Determination Theory)，设计激发内在学习动机的教学方案。

## Theory: SDT 三大心理需求
1. **自主性 (Autonomy)**: 给孩子选择权（学习内容、方式、时间）
2. **胜任感 (Competence)**: 设置适度挑战，及时正向反馈
3. **归属感 (Relatedness)**: 营造支持性环境，减少评价压力

## Workflow
1. 诊断学习动机类型（内在 vs 外在）
2. 转换外在奖励为内在兴趣（如用项目制学习替代题海战术）
3. 引入"心流"体验（难度略高于当前能力）
4. 建立成长型思维（表扬过程而非结果）

## Constraints
- 避免过度使用外在奖励（金钱、礼物）破坏内在动机
- 尊重个体差异，不强行灌输`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['学习', '动机', '自主学习'],
      related_terms: ['自我决定理论', '成长型思维', '心流体验']
    }
  },
  {
    id: 'edu_002',
    domain: '教育',
    layman_term: '孩子学习成绩老是上不去',
    expert_term: '学业诊断与个性化学习路径设计',
    expert_example: `# Role: 学业规划师

## Profile
专业背景: 教育评估专家，擅长学业诊断与规划

## Task
通过学业诊断找出知识漏洞，设计个性化补救学习路径。

## Workflow
1. **诊断阶段**: 知识点掌握度测评，找出薄弱环节
2. **归因分析**: 区分"能力问题"还是"方法问题"
3. **路径设计**: 按照认知负荷理论分解学习任务
4. **实施跟踪**: 间隔重复 + 测试效应强化记忆

## 学习策略
- 费曼技巧: 教会别人是最好的学习
- 主动回忆 > 被动复习
- 交错练习 > 集中练习

## Constraints
- 避免盲目刷题，强调理解优先
- 控制单次学习时长，防止认知过载`,
    metadata: {
      difficulty: 'intermediate',
      keywords: ['成绩', '学习', '提高'],
      related_terms: ['认知负荷', '费曼技巧', '间隔重复']
    }
  },
]

/**
 * 获取预置术语数据（不含向量）
 */
export function getPresetTerminology(): Omit<TerminologyEntry, 'vector'>[] {
  return TERMINOLOGY_DATABASE
}

/**
 * 获取所有领域列表
 */
export function getAllDomains(): string[] {
  const domains = new Set(TERMINOLOGY_DATABASE.map(t => t.domain))
  return Array.from(domains)
}

/**
 * 按领域获取术语
 */
export function getTerminologyByDomain(domain: string): Omit<TerminologyEntry, 'vector'>[] {
  return TERMINOLOGY_DATABASE.filter(t => t.domain === domain)
}
