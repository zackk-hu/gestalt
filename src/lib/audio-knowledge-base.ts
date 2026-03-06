/**
 * Prompt Optimizer 音频生成知识库
 * 包含：参考艺术家、音乐流派、AI 音频模型文档
 */

// ==========================================
// 1. 音乐流派参考库
// ==========================================

export interface MusicGenre {
  name: string
  chineseName: string
  description: string
  characteristics: string[]
  suggestedInstruments: string[]
  tempoRange: string
  moodKeywords: string[]
  referenceArtists: string[]
}

export const MUSIC_GENRES: Record<string, MusicGenre> = {
  'classical': {
    name: 'Classical',
    chineseName: '古典',
    description: '欧洲传统古典音乐，强调结构和技法',
    characteristics: ['高度结构化', '丰富的动态变化', '复杂的和声', '注重乐器技巧'],
    suggestedInstruments: ['钢琴', '小提琴', '大提琴', '长笛', '木管乐组', '铜管乐组'],
    tempoRange: '60-180 BPM',
    moodKeywords: ['优雅', '庄严', '宏大', '思辨', '深邃'],
    referenceArtists: ['贝多芬', '莫扎特', '巴赫', '肖邦', '柴可夫斯基']
  },
  'jazz': {
    name: 'Jazz',
    chineseName: '爵士',
    description: '起源于非洲美国，强调即兴创作和复杂的节奏',
    characteristics: ['即兴性强', '复杂节奏', '灵活的和声进展', '强调互动'],
    suggestedInstruments: ['萨克斯风', '爵士鼓', '低音吉他', '钢琴', '小号', '长号'],
    tempoRange: '80-200 BPM',
    moodKeywords: ['酷爽', '知性', '放松', '复杂', '洒脱'],
    referenceArtists: ['迈尔斯戴维斯', '约翰柯川', '埃灵顿公爵', '比尔埃文斯', '赫比汉考克']
  },
  'blues': {
    name: 'Blues',
    chineseName: '布鲁斯',
    description: '源于美国深南，强调情感表达和 12 小节结构',
    characteristics: ['12 小节结构', '六度音阶', '强烈情感', '重复主题'],
    suggestedInstruments: ['电吉他', '口琴', '钢琴', '贝斯', '鼓'],
    tempoRange: '80-120 BPM',
    moodKeywords: ['感伤', '深情', '原始', '粗粝', '灵魂感'],
    referenceArtists: ['BB 金', '罗伯特约翰逊', '鲁迪威廉斯', '毫达沃特', '威利迪克森']
  },
  'electronic': {
    name: 'Electronic',
    chineseName: '电子音乐',
    description: '使用电子设备和合成器创作的音乐，强调节奏和律动',
    characteristics: ['合成声音', '精确节奏', '重复律动', '宽阔音域'],
    suggestedInstruments: ['合成器', '鼓机', '采样器', '电子鼓', '电子贝斯'],
    tempoRange: '120-140 BPM（House）; 170-180 BPM（Drum and Bass）',
    moodKeywords: ['现代', '律动', '科幻', '沉浸', '高能'],
    referenceArtists: ['克拉夫特维克', '约翰卡彭特', '德夫特朋克', '威廉巴塞洛缪', '珍妮特杰克逊']
  },
  'hiphop': {
    name: 'Hip-Hop',
    chineseName: '嘻哈',
    description: '强调节奏和说唱，来自非裔美国文化，包含采样和节拍制作',
    characteristics: ['强劲鼓节奏', '采样应用', '说唱歌词', '即兴性', '社会意识'],
    suggestedInstruments: ['鼓机', '采样器', '电子贝斯', '键盘', '转盘'],
    tempoRange: '85-100 BPM',
    moodKeywords: ['街头', '力量', '叛逆', '节奏感', '态度'],
    referenceArtists: ['祖母绿鞋', 'DJ 库尔', '公共敌人', 'A 部落叫提问', '臭氧和恩太梦']
  },
  'rock': {
    name: 'Rock',
    chineseName: '摇滚',
    description: '强调电吉他和强劲鼓声，源于 50 年代，包含多种衍生风格',
    characteristics: ['强劲鼓声', '失真吉他', '强有力的人声', '三和弦结构'],
    suggestedInstruments: ['电吉他', '贝斯吉他', '鼓组', '键盘', '人声'],
    tempoRange: '120-180 BPM',
    moodKeywords: ['能量', '反叛', '激情', '强势', '自由'],
    referenceArtists: ['甲壳虫乐队', '滚石乐队', '粉红弗洛伊德', '皇后乐队', '引导者']
  },
  'ambient': {
    name: 'Ambient',
    chineseName: '环境音乐',
    description: '强调氛围和质感，适合背景播放，强调音色层次',
    characteristics: ['最小化结构', '丰富音色', '缓慢变化', '无明确节拍'],
    suggestedInstruments: ['合成器', '电钢琴', '垫音', '录音采样', '无定音鼓'],
    tempoRange: '无特定速度',
    moodKeywords: ['冥想', '放松', '神秘', '空灵', '沉浸'],
    referenceArtists: ['布赖恩埃诺', '帕特甲基尔迪', '威廉巴塞洛缪', '蒂姆赫克尔', '草间弥生']
  },
  'folk': {
    name: 'Folk',
    chineseName: '民谣',
    description: '传统民间音乐，强调叙事和文化传承',
    characteristics: ['叙事性', '传统乐器', '真挚歌词', '口头传统'],
    suggestedInstruments: ['声学吉他', '小提琴', '班卓琴', '手鼓', '人声'],
    tempoRange: '60-120 BPM',
    moodKeywords: ['真挚', '乡愁', '素朴', '叙述', '传统'],
    referenceArtists: ['鲍勃迪伦', '琼贝雷兹', '保罗西蒙', '华晨宇', '李志']
  },
  'pop': {
    name: 'Pop',
    chineseName: '流行',
    description: '通俗易懂的大众音乐，强调旋律和可唱性',
    characteristics: ['朗朗上口', '重复副歌', '简洁结构', '广泛吸引力'],
    suggestedInstruments: ['键盘', '吉他', '鼓组', '弦乐组', '人声'],
    tempoRange: '90-130 BPM',
    moodKeywords: ['欢快', '积极', '中性', '易听', '主流'],
    referenceArtists: ['迈克尔杰克逊', '麦当娜', '泰勒斯威夫特', '阿黛尔', '周杰伦']
  },
  'metal': {
    name: 'Metal',
    chineseName: '金属',
    description: '强调失真吉他和激烈情感的摇滚子流派',
    characteristics: ['重失真吉他', '快速节奏', '激烈人声', '复杂和声'],
    suggestedInstruments: ['失真电吉他', '低音吉他', '鼓组', '合成器', '人声'],
    tempoRange: '140-200 BPM',
    moodKeywords: ['激烈', '能量', '黑暗', '强势', '反叛'],
    referenceArtists: ['黑色安息日', '金属乐队', '铁娘子', '炼狱', '麦格德斯']
  },
  'indie': {
    name: 'Indie',
    chineseName: '独立',
    description: '独立制作的音乐，强调创意和非主流特征',
    characteristics: ['实验性', '独特视角', '低保真美学', '创意安排'],
    suggestedInstruments: ['吉他', '键盘', '鼓组', '贝斯', '各种实验乐器'],
    tempoRange: '90-140 BPM',
    moodKeywords: ['另类', '创意', '粗粝', '真挚', '不主流'],
    referenceArtists: ['独立摇滚乐队', '动物集体乐队', '小妖精', '弧光', '卡梅隆']
  }
}

// ==========================================
// 2. AI 音频生成模型参考
// ==========================================

export interface AudioModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  strengths: string[]
  limitations: string[]
  suggestedFor: string[]
  website?: string
  apiAvailable?: boolean
}

export const AUDIO_MODELS: AudioModel[] = [
  {
    id: 'suno',
    name: 'Suno AI',
    description: '专业级 AI 音乐生成模型，支持创建完整的歌曲（包括歌词和主唱）',
    capabilities: ['完整歌曲生成', '歌词自动生成', '人声合成', '多种风格切换'],
    strengths: ['生成质量高', '风格多样化', '支持歌词输入', '音乐完整度好'],
    limitations: ['处理时间较长', '商业使用需要订阅', '控制度不如专业 DAW', '模型可能重复特定旋律'],
    suggestedFor: ['音乐创作', '背景音乐', '演示音乐', '创意音乐实验'],
    website: 'https://www.suno.ai',
    apiAvailable: true
  },
  {
    id: 'udio',
    name: 'Udio',
    description: 'Google 支持的 AI 音乐生成，强调创意和可控性',
    capabilities: ['音乐生成', '风格定制', '实时控制', '种子控制'],
    strengths: ['界面友好', '快速生成', '高度可定制', '支持多重语言'],
    limitations: ['免费配额有限', '某些风格效果不稳定', '歌词生成不如 Suno'],
    suggestedFor: ['快速原型', '背景音乐', '游戏配乐', '视频编辑'],
    website: 'https://www.udio.com',
    apiAvailable: true
  },
  {
    id: 'audiocraft',
    name: 'Meta AudioCraft',
    description: 'Meta 开源的 AI 音频生成工具包，可本地部署',
    capabilities: ['音乐生成', '音效生成', '带条件生成', '时间控制'],
    strengths: ['开源可自定义', '可本地部署', '社区支持强', '多种控制维度'],
    limitations: ['学习曲线陡', '生成速度取决于硬件', '文档可能不完整', '需要技术背景'],
    suggestedFor: ['研究开发', '本地部署', '定制工具', '技术型用户'],
    website: 'https://github.com/facebookresearch/audiocraft',
    apiAvailable: false
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: '专业级文本转语音 (TTS) 模型，支持自然语音和情感表达',
    capabilities: ['文本转语音', '语音克隆', '多语言支持', '情感表达'],
    strengths: ['音质极高', '语音自然流畅', '支持多种语言', '情感控制强'],
    limitations: ['主要用于语音而非音乐', '需要订阅', '隐私考虑（语音克隆）'],
    suggestedFor: ['有声书', '播客制作', '游戏配音', '教育内容'],
    website: 'https://elevenlabs.io',
    apiAvailable: true
  },
  {
    id: 'bark',
    name: 'Bark by Suno',
    description: '文本转语音开源模型，支持多种音频效果和方言',
    capabilities: ['文本转语音', '音效生成', '多语言', '方言支持'],
    strengths: ['开源免费', '本地可部署', '支持非语言音频', '快速'],
    limitations: ['音质不如商业 TTS', '可能有口音问题', '社区支持不如大厂'],
    suggestedFor: ['原型开发', '教育项目', '小规模项目', '成本敏感'],
    website: 'https://github.com/suno-ai/bark',
    apiAvailable: false
  },
  {
    id: 'musicgen',
    name: 'MusicGen by Meta',
    description: 'Meta 的音乐生成模型，支持条件文本生成',
    capabilities: ['音乐生成', '风格控制', '长度灵活', '条件生成'],
    strengths: ['多样的风格控制', '生成速度快', '开源可用', '支持多种条件'],
    limitations: ['音乐多样性有限', '某些风格掌握不足', '商业模型较小'],
    suggestedFor: ['实验探索', '教学', '背景音乐生成', '快速原型'],
    website: 'https://github.com/facebookresearch/musicgen',
    apiAvailable: false
  },
  {
    id: 'jukebox',
    name: 'Jukebox by OpenAI',
    description: 'OpenAI 的音乐生成模型，可模仿特定艺术家风格',
    capabilities: ['音乐生成', '艺术家模仿', '长篇音乐', '风格转换'],
    strengths: ['艺术家风格准确', '可生成长篇音乐', '质量稳定', '创意流派支持'],
    limitations: ['计算资源需求大', '模型较旧', '商业授权复杂'],
    suggestedFor: ['艺术研究', '音乐实验', '演示', '创意项目'],
    website: 'https://github.com/openai/jukebox',
    apiAvailable: false
  }
]

// ==========================================
// 3. 参考艺术家数据库
// ==========================================

export interface ReferenceArtist {
  name: string
  chineseName?: string
  genres: string[]
  era: string
  keyCharacteristics: string[]
  notableWorks: string[]
  promptKeywords: string[]
  bestFor: string[]
}

export const REFERENCE_ARTISTS: ReferenceArtist[] = [
  {
    name: 'Miles Davis',
    chineseName: '迈尔斯·戴维斯',
    genres: ['Jazz', 'Bebop', 'Cool Jazz'],
    era: '1940s-1990s',
    keyCharacteristics: ['即兴创作', '复杂和声', '带过滤器的小号音色', '创新精神'],
    notableWorks: ['Kind of Blue', 'Bitches Brew', 'In a Silent Way'],
    promptKeywords: ['crisp trumpet', 'modal jazz', 'sophisticated', 'improvisational'],
    bestFor: ['爵士音乐', '深夜氛围', '知性背景音乐']
  },
  {
    name: 'Daft Punk',
    chineseName: '傻朋克',
    genres: ['Electronic', 'House', 'Funk'],
    era: '1997-2021',
    keyCharacteristics: ['电子合成', '法国住宅音乐', '机械化人声', '舞蹈节奏'],
    notableWorks: ['Homework', 'Discovery', 'Homework: American Tour'],
    promptKeywords: ['robotic voice', 'funky synth', 'electronic', 'future funk'],
    bestFor: ['舞蹈音乐', '电子音乐', '科幻主题']
  },
  {
    name: 'Björk',
    chineseName: '比约克',
    genres: ['Electronic', 'Experimental', 'Alternative'],
    era: '1977-present',
    keyCharacteristics: ['实验性', '独特嗓音', '自然与技术融合', '艺术形式创新'],
    notableWorks: ['Debut', 'Post', 'Medúlla'],
    promptKeywords: ['ethereal vocals', 'experimental', 'orchestral', 'avant-garde'],
    bestFor: ['艺术电影配乐', '实验音乐', '创意项目']
  },
  {
    name: 'Brian Eno',
    chineseName: '布莱恩·埃诺',
    genres: ['Ambient', 'Electronic', 'Experimental'],
    era: '1970s-present',
    keyCharacteristics: ['环境音乐创始人', '层次化声景', '静思冥想', '音色质感'],
    notableWorks: ['Music for Airports', 'Discreet Music', 'The Shutov Assembly'],
    promptKeywords: ['ambient', 'atmospheric', 'layered synths', 'meditative'],
    bestFor: ['冥想音乐', '工作背景音乐', '苏醒助眠']
  },
  {
    name: 'Ludovico Einaudi',
    chineseName: '卢多维科·艾诺迪',
    genres: ['Classical', 'Minimalism', 'Contemporary'],
    era: '1982-present',
    keyCharacteristics: ['最小主义钢琴', '重复主题', '情感表达', '电影感'],
    notableWorks: ['Una Mattina', 'Nuvole Bianche', 'Experience'],
    promptKeywords: ['minimalist piano', 'repeating motif', 'emotional', 'cinematic'],
    bestFor: ['电影配乐', '深思冥想', '感人视频']
  },
  {
    name: 'Hans Zimmer',
    chineseName: '汉斯·季默',
    genres: ['Film Score', 'Electronic', 'Orchestral'],
    era: '1983-present',
    keyCharacteristics: ['宏大配乐', '电子与交响融合', '张力营造', '情感递进'],
    notableWorks: ['The Lion King', 'Inception', 'Interstellar'],
    promptKeywords: ['orchestral', 'cinematic', 'dramatic', 'electronic symphony'],
    bestFor: ['电影配乐', '游戏背景音乐', '宏大场景']
  },
  {
    name: 'Grimes',
    chineseName: '格莱姆斯',
    genres: ['Electronic', 'Experimental Pop', 'Avant-garde'],
    era: '2009-present',
    keyCharacteristics: ['当代电子流行', '实验声音设计', '视觉艺术结合', '反叛精神'],
    notableWorks: ['Visions', 'Art Angels', 'Miss_Anthropocene'],
    promptKeywords: ['futuristic', 'glitchy', 'ethereal pop', 'experimental electronic'],
    bestFor: ['科幻电影', '实验音乐', '青年文化']
  },
  {
    name: 'John Williams',
    chineseName: '约翰·威廉姆斯',
    genres: ['Film Score', 'Orchestral', 'Classical'],
    era: '1960s-present',
    keyCharacteristics: ['标志性旋律', '交响管弦乐', '冒险精神', '历史巨作'],
    notableWorks: ['Star Wars', 'Jaws', 'Harry Potter'],
    promptKeywords: ['orchestral', 'heroic', 'nostalgic', 'iconic theme'],
    bestFor: ['冒险电影', '儿童作品', '传奇故事']
  }
]

// ==========================================
// 4. 音频技术参数参考
// ==========================================

export interface AudioTechSpecs {
  sampleRate: string[]
  bitRate: string[]
  channels: string[]
  format: string[]
  recommendedFor: Record<string, { sampleRate: string; bitRate: string }>
}

export const AUDIO_TECH_SPECS: AudioTechSpecs = {
  sampleRate: [
    '44.1 kHz (CD 质量，标准)',
    '48 kHz (视频制作，专业)',
    '96 kHz (高分辨率（HR）音乐)',
    '192 kHz (超高分辨率（UHR）音乐)'
  ],
  bitRate: [
    '128 kbps (低比特率，压缩)',
    '192 kbps (中等质量)',
    '256 kbps (接近 CD 质量)',
    '320 kbps (最高 MP3 质量)',
    '无损 (FLAC, WAV)'
  ],
  channels: [
    '单声道 (Mono)',
    '立体声 (Stereo)',
    '5.1 环绕声 (5.1 Surround)',
    '7.1 环绕声 (7.1 Surround)',
    '沉浸式音频 (Immersive Audio)'
  ],
  format: [
    'MP3 (有损压缩，广泛兼容)',
    'AAC (有损压缩，Apple 标准)',
    'WAV (无损原始格式)',
    'FLAC (无损压缩)',
    'OGG Vorbis (开源有损)',
    'opus (现代压缩，低比特率)'
  ],
  recommendedFor: {
    'web_streaming': { sampleRate: '44.1 kHz', bitRate: '128-192 kbps' },
    'podcast': { sampleRate: '44.1 kHz', bitRate: '64-128 kbps' },
    'music_production': { sampleRate: '48 kHz', bitRate: '192-320 kbps' },
    'professional_audio': { sampleRate: '96 kHz', bitRate: '无损' },
    'gaming': { sampleRate: '48 kHz', bitRate: '128-256 kbps' },
    'voice_acting': { sampleRate: '48 kHz', bitRate: '192 kbps' }
  }
}

// ==========================================
// 5. 音频生成提示词关键词库
// ==========================================

export interface AudioPromptKeywords {
  category: string
  keywords: string[]
  examples: string[]
}

export const AUDIO_PROMPT_KEYWORDS: AudioPromptKeywords[] = [
  {
    category: '音色描述 (Tone & Timbre)',
    keywords: [
      'warm', 'bright', 'dark', 'thick', 'thin', 'creamy', 'crisp', 'smooth',
      'harsh', 'mellow', 'piercing', 'soft', 'clear', 'muddy', 'crystalline',
      '温暖的', '明亮的', '黑暗的', '清晰的', '柔和的', '刺耳的'
    ],
    examples: ['warm jazz trumpet', 'bright synthesizer', 'mellow acoustic guitar']
  },
  {
    category: '节奏与速度 (Rhythm & Tempo)',
    keywords: [
      'upbeat', 'mellow', 'fast', 'slow', 'groovy', 'syncopated', 'steady',
      'swing', 'laid-back', 'energetic', 'driving', 'relaxed',
      '快速的', '缓慢的', '摇摆感', '稳定的'
    ],
    examples: ['upbeat house beat', 'slow blues rhythm', 'syncopated funk groove']
  },
  {
    category: '情感与氛围 (Emotion & Atmosphere)',
    keywords: [
      'uplifting', 'melancholic', 'energetic', 'calm', 'mysterious', 'happy',
      'sad', 'aggressive', 'peaceful', 'dramatic', 'playful', 'threatening',
      '欢快的', '沉思的', '神秘的', '平静的', '戏剧性的'
    ],
    examples: ['uplifting and inspiring', 'melancholic and introspective', 'mysterious and ethereal']
  },
  {
    category: '乐器组合 (Instrumentation)',
    keywords: [
      'acoustic guitar', 'electric guitar', 'piano', 'violin', 'drums',
      'bass', 'synthesizer', 'flute', 'saxophone', 'trumpet', 'cello',
      'strings', 'horns', 'woodwinds', 'percussion',
      '声学吉他', '电吉他', '钢琴', '小提琴', '鼓', '合成器'
    ],
    examples: ['acoustic guitar and strings', 'electric guitar with drums', 'piano and violin duet']
  },
  {
    category: '制作风格 (Production Style)',
    keywords: [
      'lo-fi', 'hi-fi', 'vintage', 'modern', 'raw', 'polished', 'glitchy',
      'organic', 'synthetic', 'layered', 'minimalist', 'lush', 'sparse',
      '复古的', '现代的', '粗糙的', '精致的', '有机的', '合成的'
    ],
    examples: ['lo-fi hip-hop aesthetic', 'modern vintage blend', 'polished production']
  },
  {
    category: '参考风格 (Reference Style)',
    keywords: [
      'in the style of', 'inspired by', 'similar to', 'reminiscent of',
      '风格参考', '灵感来自', '类似于'
    ],
    examples: ['in the style of Miles Davis', 'inspired by Daft Punk', 'similar to Hans Zimmer']
  }
]
