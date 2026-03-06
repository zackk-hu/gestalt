'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Locale = 'zh' | 'en'

const translations = {
  zh: {
    // ProtectedLayout / Auth
    'app.title': 'Gestalt 提示词优化器',
    'app.loading': '加载中...',
    'app.welcome': '欢迎使用 Gestalt',
    'app.welcomeDesc': '请先登录或注册以开始使用提示词编译器',
    'app.getStarted': '开始使用',
    'app.logout': '登出',

    // AuthModal
    'auth.welcomeBack': '欢迎回来',
    'auth.createAccount': '创建账户',
    'auth.name': '姓名',
    'auth.namePlaceholder': '请输入姓名',
    'auth.email': '邮箱',
    'auth.emailPlaceholder': '请输入邮箱地址',
    'auth.password': '密码',
    'auth.passwordPlaceholder': '请输入密码',
    'auth.processing': '处理中...',
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.noAccount': '还没有账户？',
    'auth.hasAccount': '已有账户？',
    'auth.registerNow': '立即注册',
    'auth.loginNow': '立即登录',
    'auth.loginSuccess': '登录成功！',
    'auth.registerSuccess': '注册成功！',
    'auth.wrongCredentials': '邮箱或密码错误',
    'auth.emailExists': '该邮箱已被注册',
    'auth.operationFailed': '操作失败，请稍后重试',

    // ChatPanel
    'chat.title': '优化平台',
    'chat.clear': '清空',
    'chat.taskType': '任务类型：',
    'chat.startChat': '开始对话，描述你想要的',
    'chat.promptSuffix': '提示词',
    'chat.imageEffect': '图片效果',
    'chat.videoEffect': '视频效果',
    'chat.audioEffect': '音频效果',
    'chat.textAutoDesc': '系统会自动判断任务复杂度，智能切换推理模式，支持 RAG 知识增强',
    'chat.imageAutoDesc': '系统会用"导演视角"结构化你的创意，支持风格参考检索',
    'chat.videoAutoDesc': '系统会生成专业的分镜脚本和运镜指令，支持影片风格参考',
    'chat.audioAutoDesc': '系统支持通用/专业两种模式，提供完整的音频生成优化方案',
    'chat.intuition': '直觉式 · 简单任务',
    'chat.cot': '思维链 · 中等任务',
    'chat.tot': '思维树 · 复杂任务',
    'chat.error': '抱歉，发生了错误：',
    'chat.unknownError': '未知错误',
    'chat.networkError': '网络错误，请检查连接后重试',
    'chat.attachment': '附件',
    'chat.image': '图片',
    'chat.document': '文档',
    'chat.file': '文件',
    'chat.select': '选择',
    'chat.cancelEsc': '取消 (Esc)',
    'chat.confirmResend': '确认并重新发送 (Enter)',
    'chat.editMessage': '编辑此消息',
    'chat.analyzing': '分析任务复杂度...',
    'chat.selectOption': '请选择一个选项继续...',
    'chat.regenerate': '重新生成',
    'chat.removeAttachment': '移除附件',
    'chat.maxFiles': '已达到最大文件数量',
    'chat.uploadFile': '上传文件',
    'chat.inputPlaceholder': '描述你想要的提示词... (Enter 发送，Shift+Enter 换行)',
    'chat.inputHint': '悬停消息可编辑 · 支持上传图片/文档',
    'chat.maxFilesHint': '个',
    'chat.currentMode': '当前模式：',

    // TestPanel
    'test.title': '效果验证平台',
    'test.reset': '重置',
    'test.copied': '已复制',
    'test.copy': '复制',
    'test.exitFullscreen': '退出全屏 (Esc)',
    'test.promptPlaceholder': '左侧对话生成的 Prompt 会自动显示在这里，也可以手动输入...',
    'test.configured': '已配置',
    'test.fullscreenEdit': '全屏编辑',
    'test.startChat': '开始对话测试',
    'test.chatWith': '使用 {model} 进行对话',
    'test.promptReady': 'System Prompt 已配置，开始提问吧',
    'test.inputPlaceholder': '输入消息... (Enter 发送)',
    'test.currentModel': '当前模型',
    'test.messageCount': '{count} 条消息',
    'test.configPrompt': '配置好 Prompt 后',
    'test.clickStart': '点击「开始对话测试」进入交互模式',
    'test.error': '错误',
    'test.networkError': '网络错误，请检查连接后重试',

    // ConfigPanel
    'config.button': '配置',
    'config.title': '引擎配置',
    'config.apiKeyHint': '你的 API Key 将仅保存在本地浏览器中',
    'config.modelName': '模型名称',
    'config.quickPresets': '快速预设',
    'config.recommended': '推荐',
    'config.reset': '重置',
    'config.save': '保存配置',

    // Types
    'type.text': '文本生成',
    'type.textDesc': '对话、写作、代码、分析等文本任务，支持 RAG 知识增强',
    'type.image': '图片生成',
    'type.imageDesc': 'Midjourney、Flux、DALL-E 等图像模型，支持参考图检索',
    'type.video': '视频生成',
    'type.videoDesc': 'Sora、Runway、Veo 等视频模型，支持风格参考检索',
    'type.audio': '音频生成',
    'type.audioDesc': 'Suno、Udio、AudioCraft 等音频模型，支持多种音频类型生成',

    // Model descriptions
    'model.qwen72b': '通义千问大模型，综合能力强',
    'model.qwen32b': '通义千问中等规模，响应更快',
    'model.deepseekV3': 'DeepSeek 最新模型，推理能力强',
    'model.deepseekR1': 'DeepSeek R1 蒸馏版，逻辑推理专长',

    // Theme
    'theme.light': '浅色',
    'theme.dark': '深色',

    // Landing Page
    'landing.headline': 'Gestalt',
    'landing.subheadline': '提示词优化器',
    'landing.tagline': "从'对话'到'编译'，重构你的人机交互方式。",
    'landing.featuresTitle': '核心能力',
    'landing.featuresSubtitle': '重新定义提示词工程的每一个环节',
    'landing.feature1Title': '智能推理引擎',
    'landing.feature1Desc': '自动判断任务复杂度，在直觉式、思维链（CoT）和思维树（ToT）之间智能切换，确保每一次编译都精准高效。',
    'landing.feature2Title': 'RAG 知识增强',
    'landing.feature2Desc': '内置学术知识库与术语翻译引擎，让你的提示词具备专业领域的深度理解与精确表达。',
    'landing.feature3Title': '多模态编译',
    'landing.feature3Desc': '不仅支持文本，还能为 Midjourney、DALL-E、Sora 等图像/视频模型编译出专业级提示词。',
    'landing.feature4Title': '实时效果验证',
    'landing.feature4Desc': '编译完成即刻测试。内置多模型对话平台，一键验证 Prompt 在真实场景中的表现。',
    'landing.statsTitle': '数据',
    'landing.statsSubtitle': '全方位提示词工程解决方案',
    'landing.stat1Value': '3',
    'landing.stat1Label': '推理模式',
    'landing.stat2Value': '10+',
    'landing.stat2Label': '模型支持',
    'landing.stat3Value': '3',
    'landing.stat3Label': '任务类型',
    'landing.stat4Value': '99%',
    'landing.stat4Label': '编译准确率',
  },
  en: {
    // ProtectedLayout / Auth
    'app.title': 'Gestalt',
    'app.loading': 'Loading...',
    'app.welcome': 'Welcome to Gestalt',
    'app.welcomeDesc': 'Please log in or register to start using the prompt compiler',
    'app.getStarted': 'Get Started',
    'app.logout': 'Logout',

    // AuthModal
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Account',
    'auth.name': 'Name',
    'auth.namePlaceholder': 'Enter your name',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.processing': 'Processing...',
    'auth.login': 'Log In',
    'auth.register': 'Sign Up',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.registerNow': 'Sign Up',
    'auth.loginNow': 'Log In',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Registration successful!',
    'auth.wrongCredentials': 'Invalid email or password',
    'auth.emailExists': 'This email is already registered',
    'auth.operationFailed': 'Operation failed, please try again later',

    // ChatPanel
    'chat.title': 'Prompt Compiler',
    'chat.clear': 'Clear',
    'chat.taskType': 'Task Type: ',
    'chat.startChat': 'Start a conversation, describe your desired ',
    'chat.promptSuffix': 'prompt',
    'chat.imageEffect': 'image effect',
    'chat.videoEffect': 'video effect',
    'chat.audioEffect': 'audio effect',
    'chat.textAutoDesc': 'Auto-detects task complexity, switches reasoning modes, supports RAG knowledge enhancement',
    'chat.imageAutoDesc': 'Structures your creativity with a "director\'s eye" perspective, supports style reference retrieval',
    'chat.videoAutoDesc': 'Generates professional storyboards and camera instructions, supports film style references',
    'chat.audioAutoDesc': 'Supports general/professional modes, provides complete audio generation optimization solutions',
    'chat.intuition': 'Intuition · Simple',
    'chat.cot': 'Chain-of-Thought · Medium',
    'chat.tot': 'Tree-of-Thoughts · Complex',
    'chat.error': 'Sorry, an error occurred: ',
    'chat.unknownError': 'Unknown error',
    'chat.networkError': 'Network error, please check your connection',
    'chat.attachment': 'Attachment',
    'chat.image': 'Image',
    'chat.document': 'Document',
    'chat.file': 'File',
    'chat.select': 'Select',
    'chat.cancelEsc': 'Cancel (Esc)',
    'chat.confirmResend': 'Confirm & Resend (Enter)',
    'chat.editMessage': 'Edit this message',
    'chat.analyzing': 'Analyzing task complexity...',
    'chat.selectOption': 'Please select an option to continue...',
    'chat.regenerate': 'Regenerate',
    'chat.removeAttachment': 'Remove attachment',
    'chat.maxFiles': 'Maximum file limit reached',
    'chat.uploadFile': 'Upload file',
    'chat.inputPlaceholder': 'Describe the prompt you want... (Enter to send, Shift+Enter for new line)',
    'chat.inputHint': 'Hover to edit messages · Upload images/documents supported',
    'chat.maxFilesHint': '',
    'chat.currentMode': 'Mode: ',

    // TestPanel
    'test.title': 'Test Platform',
    'test.reset': 'Reset',
    'test.copied': 'Copied',
    'test.copy': 'Copy',
    'test.exitFullscreen': 'Exit Fullscreen (Esc)',
    'test.promptPlaceholder': 'The prompt generated from the left panel will appear here, or type manually...',
    'test.configured': 'Configured',
    'test.fullscreenEdit': 'Fullscreen Edit',
    'test.startChat': 'Start Chat Test',
    'test.chatWith': 'Chat with {model}',
    'test.promptReady': 'System Prompt configured, start asking questions',
    'test.inputPlaceholder': 'Type a message... (Enter to send)',
    'test.currentModel': 'Model',
    'test.messageCount': '{count} messages',
    'test.configPrompt': 'After configuring the Prompt',
    'test.clickStart': 'Click "Start Chat Test" to enter interactive mode',
    'test.error': 'Error',
    'test.networkError': 'Network error, please check your connection',

    // ConfigPanel
    'config.button': 'Config',
    'config.title': 'Engine Config',
    'config.apiKeyHint': 'Your API Key is stored locally in the browser only',
    'config.modelName': 'Model Name',
    'config.quickPresets': 'Quick Presets',
    'config.recommended': 'Recommended',
    'config.reset': 'Reset',
    'config.save': 'Save',

    // Types
    'type.text': 'Text',
    'type.textDesc': 'Chat, writing, code, analysis and more, with RAG knowledge enhancement',
    'type.image': 'Image',
    'type.imageDesc': 'Midjourney, Flux, DALL-E and other image models with reference retrieval',
    'type.video': 'Video',
    'type.videoDesc': 'Sora, Runway, Veo and other video models with style references',
    'type.audio': 'Audio',
    'type.audioDesc': 'Suno, Udio, AudioCraft and other audio models supporting multiple audio types',

    // Model descriptions
    'model.qwen72b': 'Qwen large model, strong overall capability',
    'model.qwen32b': 'Qwen mid-size, faster response',
    'model.deepseekV3': 'DeepSeek latest model, strong reasoning',
    'model.deepseekR1': 'DeepSeek R1 distilled, logic reasoning specialist',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    // Landing Page
    'landing.headline': 'Gestalt',
    'landing.subheadline': 'Gestalt',
    'landing.tagline': "From 'conversation' to 'compilation', redefine your human-machine interaction.",
    'landing.featuresTitle': 'Core Capabilities',
    'landing.featuresSubtitle': 'Redefining every step of prompt engineering',
    'landing.feature1Title': 'Smart Reasoning Engine',
    'landing.feature1Desc': 'Auto-detects task complexity, intelligently switches between Intuition, Chain-of-Thought (CoT) and Tree-of-Thoughts (ToT) modes.',
    'landing.feature2Title': 'RAG Knowledge Enhancement',
    'landing.feature2Desc': 'Built-in academic knowledge base and terminology translator for professional-grade prompt generation.',
    'landing.feature3Title': 'Multi-Modal Compilation',
    'landing.feature3Desc': 'Beyond text — compile professional prompts for Midjourney, DALL-E, Sora and other image/video models.',
    'landing.feature4Title': 'Real-time Verification',
    'landing.feature4Desc': 'Test immediately after compilation. Built-in multi-model chat platform to verify prompt performance.',
    'landing.statsTitle': 'Data',
    'landing.statsSubtitle': 'Complete prompt engineering solution',
    'landing.stat1Value': '3',
    'landing.stat1Label': 'Reasoning Modes',
    'landing.stat2Value': '10+',
    'landing.stat2Label': 'Models Supported',
    'landing.stat3Value': '3',
    'landing.stat3Label': 'Task Types',
    'landing.stat4Value': '99%',
    'landing.stat4Label': 'Compile Accuracy',
  }
} as const

type TranslationKey = keyof typeof translations.zh

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')

  useEffect(() => {
    const saved = localStorage.getItem('prompt-optimizer-locale') as Locale
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('prompt-optimizer-locale', newLocale)
  }, [])

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let text: string = translations[locale][key] || translations.zh[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
