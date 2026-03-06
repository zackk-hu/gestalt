// ==========================================
// 科研期刊知识库
// 包含 Top 期刊图表规范和设计指南
// ==========================================

export interface JournalSpec {
  id: string
  name: string
  fullName: string
  tier: 'top' | 'high'
  field: string
  color: string
  figureSpecs: {
    maxWidthMm: number
    maxHeightMm: number
    resolutionDpi: number
    formats: string[]
    colorMode: string[]
    fontSizePt: { min: number; max: number }
  }
  designGuidelines: string[]
  colorPalette: string[]
  examplePromptPrefix: string
}

export const JOURNALS: JournalSpec[] = [
  {
    id: 'nature',
    name: 'Nature',
    fullName: 'Nature',
    tier: 'top',
    field: '综合',
    color: '#E05252',
    figureSpecs: {
      maxWidthMm: 183,
      maxHeightMm: 247,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PDF'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 5, max: 7 }
    },
    designGuidelines: [
      '单栏图宽度 89mm，双栏图最宽 183mm',
      '颜色需区分色盲友好型，避免纯红绿对比',
      '所有文字需清晰可读，最小 5pt',
      '比例尺和标注需完整',
      '统计显著性标注需使用 ns, *, **, *** 格式',
      '图例字体与正文一致，建议 Helvetica 或 Arial'
    ],
    colorPalette: ['#E05252', '#5B9BD5', '#70AD47', '#FFC000', '#7030A0'],
    examplePromptPrefix: 'Scientific figure for Nature journal, clean minimalist style, CMYK color, 300 DPI,'
  },
  {
    id: 'science',
    name: 'Science',
    fullName: 'Science',
    tier: 'top',
    field: '综合',
    color: '#B71C7E',
    figureSpecs: {
      maxWidthMm: 183,
      maxHeightMm: 247,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PDF', 'PNG'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 6, max: 8 }
    },
    designGuidelines: [
      '单栏宽度 55mm，双栏宽度 114mm，全宽 174mm',
      '行高图片最大高度与版心同高',
      '字体建议 Arial，不低于 6pt',
      '数据图需包含误差棒和样本量',
      '流程图/示意图需简洁清晰',
      '彩色图在印刷版和网络版均需可读'
    ],
    colorPalette: ['#B71C7E', '#1565C0', '#2E7D32', '#F57F17', '#6A1B9A'],
    examplePromptPrefix: 'Publication-quality scientific illustration for Science magazine, precise anatomical accuracy,'
  },
  {
    id: 'cell',
    name: 'Cell',
    fullName: 'Cell',
    tier: 'top',
    field: '生命科学',
    color: '#00695C',
    figureSpecs: {
      maxWidthMm: 178,
      maxHeightMm: 220,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PDF'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 6, max: 8 }
    },
    designGuidelines: [
      '单栏 85mm，双栏 176mm',
      '图片最大高度 190mm（留 30mm 图例）',
      '建议使用色盲安全调色板',
      '细胞图像需标注比例尺',
      '蛋白质结构图需标注关键残基',
      '多组对比需使用统一颜色方案'
    ],
    colorPalette: ['#00695C', '#AD1457', '#1565C0', '#E65100', '#4527A0'],
    examplePromptPrefix: 'Cell biology scientific figure, detailed molecular illustration, vibrant but professional palette,'
  },
  {
    id: 'pnas',
    name: 'PNAS',
    fullName: 'Proceedings of the National Academy of Sciences',
    tier: 'top',
    field: '综合',
    color: '#1565C0',
    figureSpecs: {
      maxWidthMm: 175,
      maxHeightMm: 230,
      resolutionDpi: 600,
      formats: ['TIFF', 'EPS', 'PDF', 'PNG'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 6, max: 9 }
    },
    designGuidelines: [
      '分辨率要求更高：最低 600 DPI',
      '单栏 87mm，双栏 178mm',
      '字体推荐 Arial 或 Helvetica',
      '图表应自成一体，不依赖正文理解',
      '颜色方案需在黑白打印下仍可区分',
      '化学结构式需符合 IUPAC 标准'
    ],
    colorPalette: ['#1565C0', '#C62828', '#2E7D32', '#F9A825', '#6A1B9A'],
    examplePromptPrefix: 'PNAS scientific figure, high resolution 600DPI, self-explanatory chart with comprehensive labels,'
  },
  {
    id: 'nature-medicine',
    name: 'Nature Medicine',
    fullName: 'Nature Medicine',
    tier: 'top',
    field: '医学',
    color: '#880E4F',
    figureSpecs: {
      maxWidthMm: 183,
      maxHeightMm: 247,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PDF'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 5, max: 7 }
    },
    designGuidelines: [
      '临床数据图需包含置信区间',
      '生存曲线需标注患者数量',
      '影像学数据需标注比例尺和方向',
      '热图颜色方案需直观反映数据含义',
      '流式细胞图需清晰标注门控策略',
      'ROC 曲线需标注 AUC 值'
    ],
    colorPalette: ['#880E4F', '#0D47A1', '#1B5E20', '#E65100', '#4A148C'],
    examplePromptPrefix: 'Medical research figure for Nature Medicine, clinical data visualization, precise and professional,'
  },
  {
    id: 'lancet',
    name: 'The Lancet',
    fullName: 'The Lancet',
    tier: 'top',
    field: '医学',
    color: '#B71C1C',
    figureSpecs: {
      maxWidthMm: 190,
      maxHeightMm: 255,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PNG', 'PDF'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 6, max: 8 }
    },
    designGuidelines: [
      '图宽：全宽 190mm，半宽 90mm',
      '临床试验图需包含 CONSORT 流程图元素',
      '颜色方案要考虑色觉障碍读者',
      '地图数据需标注数据来源',
      '流行病学曲线需标注关键事件节点',
      '森林图需规范呈现元分析结果'
    ],
    colorPalette: ['#B71C1C', '#1A237E', '#004D40', '#F57F17', '#311B92'],
    examplePromptPrefix: 'Lancet medical journal figure, epidemiology or clinical data, clean professional style,'
  },
  {
    id: 'nejm',
    name: 'NEJM',
    fullName: 'New England Journal of Medicine',
    tier: 'top',
    field: '医学',
    color: '#263238',
    figureSpecs: {
      maxWidthMm: 183,
      maxHeightMm: 240,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PDF'],
      colorMode: ['CMYK'],
      fontSizePt: { min: 6, max: 8 }
    },
    designGuidelines: [
      '仅接受 CMYK 色彩模式',
      '图片必须嵌入高分辨率字体',
      'K线图和统计散点图需包含四分位距',
      '实验室影像图需校色一致',
      '药物试验数据需包含安全性数据',
      '所有轴需有清晰单位标注'
    ],
    colorPalette: ['#263238', '#B71C1C', '#1565C0', '#2E7D32', '#F57F17'],
    examplePromptPrefix: 'NEJM clinical figure, strictly CMYK, authoritative medical illustration style,'
  },
  {
    id: 'nature-communications',
    name: 'Nature Comms',
    fullName: 'Nature Communications',
    tier: 'high',
    field: '综合',
    color: '#0277BD',
    figureSpecs: {
      maxWidthMm: 183,
      maxHeightMm: 247,
      resolutionDpi: 300,
      formats: ['TIFF', 'EPS', 'PDF', 'PNG'],
      colorMode: ['CMYK', 'RGB'],
      fontSizePt: { min: 5, max: 7 }
    },
    designGuidelines: [
      '遵循 Nature 系列图表规范',
      '鼓励数据可视化创新形式',
      '多组学数据图需使用统一坐标系',
      '网络图需清晰标注节点和边的含义',
      '单细胞测序图需标注细胞类型',
      '时序数据需清晰标注时间轴'
    ],
    colorPalette: ['#0277BD', '#AD1457', '#2E7D32', '#E65100', '#4527A0'],
    examplePromptPrefix: 'Nature Communications scientific figure, interdisciplinary research visualization, modern style,'
  }
]

// 生物医学实体类型
export const BIO_ENTITY_TYPES = [
  { type: 'protein', label: '蛋白质', color: '#E05252', icon: '🧬' },
  { type: 'gene', label: '基因', color: '#5B9BD5', icon: '🔬' },
  { type: 'compound', label: '化合物', color: '#70AD47', icon: '⚗️' },
  { type: 'pathway', label: '通路', color: '#FFC000', icon: '🔗' },
  { type: 'cell', label: '细胞类型', color: '#7030A0', icon: '🫧' },
  { type: 'disease', label: '疾病', color: '#C55A11', icon: '🏥' },
  { type: 'drug', label: '药物', color: '#2E75B6', icon: '💊' },
  { type: 'organism', label: '生物体', color: '#548235', icon: '🦠' }
]

// 关系类型
export const RELATION_TYPES = [
  { type: 'activates', label: '激活', color: '#70AD47', arrow: '→' },
  { type: 'inhibits', label: '抑制', color: '#E05252', arrow: '⊣' },
  { type: 'binds', label: '结合', color: '#5B9BD5', arrow: '—' },
  { type: 'phosphorylates', label: '磷酸化', color: '#FFC000', arrow: '→p' },
  { type: 'upregulates', label: '上调', color: '#70AD47', arrow: '↑' },
  { type: 'downregulates', label: '下调', color: '#E05252', arrow: '↓' },
  { type: 'colocalizes', label: '共定位', color: '#7030A0', arrow: '≈' },
  { type: 'regulates', label: '调控', color: '#2E75B6', arrow: '↔' }
]

// 获取期刊信息
export function getJournalById(id: string): JournalSpec | undefined {
  return JOURNALS.find(j => j.id === id)
}

// 生成期刊规范的AI提示词前缀
export function buildJournalPromptSpec(journal: JournalSpec): string {
  return `${journal.examplePromptPrefix} ` +
    `${journal.figureSpecs.resolutionDpi} DPI, ` +
    `max ${journal.figureSpecs.maxWidthMm}mm wide, ` +
    `${journal.figureSpecs.colorMode[0]} color mode, ` +
    `font size ${journal.figureSpecs.fontSizePt.min}-${journal.figureSpecs.fontSizePt.max}pt`
}
