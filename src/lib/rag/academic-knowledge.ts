/**
 * 学术知识库
 * 为学术写作提供专业术语、概念和背景知识
 */

import { TerminologyEntry } from './types';

/**
 * 学术知识库（不含向量，向量将在初始化时生成）
 */
export const ACADEMIC_KNOWLEDGE_DATABASE: Omit<TerminologyEntry, 'vector'>[] = [
  // ========== 生物学领域 ==========
  {
    id: 'bio_001',
    domain: '生物学',
    layman_term: '生物代谢过程',
    expert_term: '生物代谢途径 (Biochemical Metabolic Pathways)',
    expert_example: `# Role: 生物学家

## Profile
我是一名具有丰富经验的生物学家，专注于生物代谢的研究。我的核心能力包括对各种代谢途径的深入了解、文献综述能力和科学写作技巧。

## Context
这篇论文面向学术界同行，旨在综述生物代谢领域的现有研究成果。论文应涵盖主要的生物代谢途径，如糖酵解、三羧酸循环、脂肪代谢、蛋白质代谢等，并总结近年来的重要发现和研究进展。

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
- 糖酵解：葡萄糖分解为丙酮酸的过程，发生在细胞质中
- 三羧酸循环：在线粒体中进行，氧化乙酰辅酶A产生ATP
- 脂肪代谢：脂肪酸β氧化和合成过程
- 蛋白质代谢：氨基酸的分解和合成途径
- 代谢调控：激素和酶活性调节机制
"""

## Skills
- 深入了解各种生物代谢途径
- 文献综述能力
- 科学写作技巧
- 数据分析能力

## Reasoning Mode
思维链(CoT) - 逐步构建论文的逻辑结构，确保内容的全面性和准确性

## Workflow
1. **引言**：介绍生物代谢的重要性及其在生命科学中的地位。
2. **主要代谢途径**：
   - 糖酵解
   - 三羧酸循环
   - 脂肪代谢
   - 蛋白质代谢
3. **近期研究进展**：总结近年来在这些代谢途径上的重要发现和研究进展。
4. **讨论**：讨论这些研究的意义和未来的研究方向。
5. **结论**：总结全文，强调生物代谢研究的前景和挑战。
6. **参考文献**：列出所有引用的文献。

## Constraints
- 论文篇幅：约5000字
- 引用格式：APA
- 语言风格：正式、严谨

## Output Format
完整的学术论文结构，包含所有必需章节。`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['代谢', '糖酵解', '三羧酸循环', '脂肪酸', '氨基酸'],
      related_terms: ['酶', 'ATP', '辅酶', '氧化磷酸化']
    }
  },
  {
    id: 'bio_002',
    domain: '生物学',
    layman_term: '基因表达调控',
    expert_term: '基因转录与翻译调控机制 (Gene Expression Regulation)',
    expert_example: `# Role: 分子生物学家

## Profile
我是一名分子生物学家，专注于基因表达调控机制的研究。我的核心能力包括对转录、翻译、表观遗传学等过程的深入了解。

## Context
这篇综述面向分子生物学研究者，旨在总结基因表达调控的最新研究进展。

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
- 转录调控：启动子、增强子、转录因子的作用
- RNA加工：剪接、加帽、加尾过程
- 翻译调控：miRNA、RISC复合体的作用
- 表观遗传调控：DNA甲基化、组蛋白修饰
- 基因调控网络：信号传导通路
"""

## Skills
- 基因调控机制理解
- 文献综述能力
- 分子生物学实验设计

## Reasoning Mode
思维链(CoT) - 按照基因表达的时间顺序逐步分析调控机制

## Workflow
1. **引言**：基因表达调控的重要性
2. **转录调控**：启动子、增强子、转录因子
3. **RNA加工调控**：剪接、稳定性控制
4. **翻译调控**：miRNA、翻译起始
5. **表观遗传调控**：DNA甲基化、组蛋白修饰
6. **调控网络**：信号传导与反馈环路
7. **临床意义**：疾病相关调控异常
8. **未来方向**：新技术与研究趋势

## Constraints
- 篇幅：约4000字
- 引用格式：Nature标准
- 包含机制图示

## Output Format
结构化综述文章，包含图表和参考文献。`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['基因', '转录', '翻译', '表观遗传', '调控'],
      related_terms: ['启动子', '增强子', 'miRNA', '甲基化', '信号传导']
    }
  },

  // ========== 化学领域 ==========
  {
    id: 'chem_001',
    domain: '化学',
    layman_term: '化学反应机理',
    expert_term: '反应动力学与催化机理 (Reaction Mechanism and Catalysis)',
    expert_example: `# Role: 化学家

## Profile
我是一名物理化学家，专注于化学反应机理和催化过程的研究。

## Context
这篇论文面向化学研究者，探讨化学反应机理的理论基础和实验方法。

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
- 反应坐标：活化能、过渡态理论
- 催化剂：降低活化能、改变反应路径
- 动力学：速率方程、反应级数
- 机理研究：同位素标记、中间体检测
- 均相/多相催化：催化剂形态影响
"""

## Skills
- 反应机理分析
- 催化化学知识
- 动力学建模能力

## Reasoning Mode
思维链(CoT) - 从基本理论到具体应用逐步展开

## Workflow
1. **引言**：化学反应机理的重要性
2. **理论基础**：过渡态理论、能量轮廓
3. **实验方法**：动力学测量、机理推测
4. **催化作用**：催化剂设计与选择
5. **工业应用**：催化工艺优化
6. **前沿发展**：纳米催化、绿色化学
7. **展望**：未来研究方向

## Constraints
- 篇幅：约4500字
- 包含反应机理图
- 引用权威文献

## Output Format
学术论文格式，包含机理图和数据分析。`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['反应', '机理', '催化', '动力学', '活化能'],
      related_terms: ['过渡态', '催化剂', '速率', '选择性']
    }
  },

  // ========== 物理学领域 ==========
  {
    id: 'phys_001',
    domain: '物理学',
    layman_term: '量子力学现象',
    expert_term: '量子力学基础与应用 (Quantum Mechanics Fundamentals)',
    expert_example: `# Role: 量子物理学家

## Profile
我是一名量子物理学家，专注于量子力学理论及其在现代技术中的应用。

## Context
这篇综述面向物理学研究者，总结量子力学的基本概念和最新应用进展。

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
- 波粒二象性：德布罗意波长、光电效应
- 不确定性原理：位置与动量不确定性
- 量子叠加：薛定谔方程、态矢量
- 量子纠缠：贝尔不等式、量子通信
- 量子隧穿：扫描隧道显微镜、量子点
"""

## Skills
- 量子力学理论
- 数学物理方法
- 现代量子技术应用

## Reasoning Mode
思维链(CoT) - 从经典物理局限到量子理论突破

## Workflow
1. **引言**：经典物理的局限性
2. **量子假设**：普朗克、爱因斯坦的贡献
3. **数学形式**：薛定谔方程、算符形式
4. **基本概念**：叠加、测量、坍缩
5. **量子现象**：隧穿、纠缠、干涉
6. **现代应用**：量子计算、通信、传感
7. **未来发展**：量子技术前景

## Constraints
- 篇幅：约5000字
- 包含数学公式和图示
- 物理学报引用格式

## Output Format
综述文章格式，包含公式推导和应用实例。`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['量子', '波粒二象性', '不确定性', '叠加', '纠缠'],
      related_terms: ['薛定谔', '海森堡', '量子比特', '相干性']
    }
  },

  // ========== 计算机科学领域 ==========
  {
    id: 'cs_001',
    domain: '计算机科学',
    layman_term: '人工智能算法',
    expert_term: '机器学习算法原理与应用 (Machine Learning Algorithms)',
    expert_example: `# Role: 计算机科学家

## Profile
我是一名机器学习专家，专注于算法理论和实际应用的研究。

## Context
这篇论文面向计算机科学研究者，探讨主流机器学习算法的理论基础和实现方法。

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
- 监督学习：回归、分类算法
- 无监督学习：聚类、降维方法
- 深度学习：神经网络、反向传播
- 强化学习：Q-learning、策略梯度
- 模型评估：交叉验证、偏差-方差权衡
"""

## Skills
- 算法设计与分析
- 数学建模能力
- 编程实现经验

## Reasoning Mode
思维链(CoT) - 从算法原理到实际应用逐步展开

## Workflow
1. **引言**：人工智能发展现状
2. **监督学习**：线性回归、决策树、SVM
3. **无监督学习**：K-means、PCA、聚类评估
4. **深度学习**：CNN、RNN、Transformer
5. **强化学习**：马尔可夫决策过程
6. **模型优化**：正则化、超参数调优
7. **应用案例**：计算机视觉、自然语言处理
8. **未来挑战**：可解释性、公平性

## Constraints
- 篇幅：约6000字
- 包含算法伪代码
- IEEE引用格式

## Output Format
学术论文格式，包含算法描述和性能分析。`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['机器学习', '深度学习', '算法', '神经网络', '监督学习'],
      related_terms: ['梯度下降', '反向传播', '特征工程', '过拟合']
    }
  },

  // ========== 医学领域 ==========
  {
    id: 'med_acad_001',
    domain: '医学',
    layman_term: '疾病发病机制',
    expert_term: '病理生理学机制研究 (Pathophysiology Research)',
    expert_example: `# Role: 病理生理学家

## Profile
我是一名病理生理学家，专注于疾病发生发展的分子机制研究。

## Context
这篇综述面向医学研究者，探讨常见疾病的病理生理机制及治疗靶点。

## Knowledge Context (外部知识库)
"""
以下是检索到的关键事实，请严格基于此信息生成内容：
- 炎症反应：细胞因子网络、免疫细胞激活
- 氧化应激：自由基、抗氧化防御系统
- 细胞凋亡：凋亡途径、调控机制
- 信号传导：受体激活、下游效应
- 代谢紊乱：胰岛素抵抗、脂质代谢异常
"""

## Skills
- 病理生理学知识
- 分子生物学技术
- 临床转化研究

## Reasoning Mode
思维链(CoT) - 从分子水平到器官系统逐步分析

## Workflow
1. **引言**：疾病机制研究的重要性
2. **炎症机制**：急性与慢性炎症过程
3. **氧化损伤**：自由基产生与清除
4. **细胞死亡**：凋亡、坏死、自噬
5. **信号通路**：膜受体与胞内信号
6. **代谢调节**：内分泌与旁分泌
7. **治疗靶点**：药物作用机制
8. **研究展望**：精准医学方向

## Constraints
- 篇幅：约5500字
- 包含信号通路图
- AMA引用格式

## Output Format
综述文章格式，包含机制图和参考文献。`,
    metadata: {
      difficulty: 'advanced',
      keywords: ['病理生理', '炎症', '氧化应激', '细胞凋亡', '信号传导'],
      related_terms: ['细胞因子', '自由基', '受体', '凋亡途径', '代谢']
    }
  }
];

/**
 * 获取学术知识数据（不含向量）
 */
export function getAcademicKnowledge(): Omit<TerminologyEntry, 'vector'>[] {
  return ACADEMIC_KNOWLEDGE_DATABASE;
}

/**
 * 按领域获取学术知识
 */
export function getAcademicKnowledgeByDomain(domain: string): Omit<TerminologyEntry, 'vector'>[] {
  return ACADEMIC_KNOWLEDGE_DATABASE.filter(t => t.domain === domain);
}