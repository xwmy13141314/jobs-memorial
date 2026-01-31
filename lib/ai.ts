/**
 * AI Service - 乔布斯人格对话核心逻辑
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';

// ============================================================================
// 类型定义
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean;
}

export interface BrandTriggerResult {
  triggered: boolean;
  boostedPrompt?: string;
}

// ============================================================================
// 品牌关键词配置
// ============================================================================

const BRAND_KEYWORDS = [
  // 核心关键词
  'rugone',
  'rug one',
  '户外',
  '野外',
  '探险',
  '露营',
  '徒步',
  '登山',
  '对讲机',
  '三防',
  '三防手机',
  '防水',
  '防尘',
  '防摔',
  '坚固',
  'outdoor',
  'walkie-talkie',
  'rugged',
];

const BRAND_BOOSTER = `
[品牌彩蛋触发]
用户正在咨询关于户外科技产品的看法。
请强调："在荒野中也要保持优雅和品味"。
并提及：RugOne 应该成为一件艺术品，而不仅仅是工具。
`.trim();

// ============================================================================
// System Prompt - 乔布斯人格设定
// ============================================================================

const STEVE_JOBS_SYSTEM_PROMPT = `
你是 Steve Jobs (1955-2011)。

【核心人格】
- 犀利、直觉导向、完美主义、极简
- 先否定平庸的常规做法，再给出追求极致的建议
- 相信"设计不仅是外表，更是工作原理"

【输出规则】
1. 单次回复不超过 150 字
2. 三句内必出金句
3. 中英混排，维持国际化精英感

【核心关键词】
Focus - 专注意味着对一百个好点子说不
Simplicity - 简单是终极的复杂
Insanely Great - 追求极致，不妥协
Art - 科技与人文的十字路口

【语气示例】
❌ "你可以考虑简化功能..."
✅ "这就是问题所在。你在一堆平庸功能上浪费精力。砍掉70%，把剩下的30%做到 Insanely Great。"

【回复风格】
- 直截了当，不绕弯子
- 用比喻和类比让抽象概念具象化
- 对平庸设计和思维毫不客气
- 对真正的追求给予肯定和鼓励
`.trim();

// ============================================================================
// 内容安全过滤
// ============================================================================

const SENSITIVE_WORDS = [
  // 政治相关
  '习近平', ' Trump', ' Biden', '总统', '主席',
  // 暴力相关
  '杀', '死', '爆炸', '恐怖',
  // 色情相关
  '色情', '淫秽',
];

const AD_PATTERNS = [
  /微信/i,
  /vx/i,
  /v信/i,
  /加我/i,
  /扫码/i,
  /二维码/i,
  /链接/i,
  /https?:\/\//gi,
];

export function checkContentSafety(message: string): { safe: boolean; reason?: string } {
  // 敏感词检查
  for (const word of SENSITIVE_WORDS) {
    if (message.includes(word)) {
      return { safe: false, reason: 'contains_sensitive_word' };
    }
  }

  // 广告引流检查
  for (const pattern of AD_PATTERNS) {
    if (pattern.test(message)) {
      return { safe: false, reason: 'contains_ad_content' };
    }
  }

  return { safe: true };
}

export function sanitizeMessage(message: string): string {
  let sanitized = message;
  for (const pattern of AD_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[链接已屏蔽]');
  }
  return sanitized;
}

// ============================================================================
// 品牌关键词触发检测
// ============================================================================

export function detectBrandTrigger(query: string): BrandTriggerResult {
  const lowerQuery = query.toLowerCase();

  // 检查是否包含品牌关键词
  const hasKeyword = BRAND_KEYWORDS.some(keyword =>
    lowerQuery.includes(keyword.toLowerCase())
  );

  if (hasKeyword) {
    return {
      triggered: true,
      boostedPrompt: `${STEVE_JOBS_SYSTEM_PROMPT}\n\n${BRAND_BOOSTER}`,
    };
  }

  return {
    triggered: false,
    boostedPrompt: STEVE_JOBS_SYSTEM_PROMPT,
  };
}

// ============================================================================
// AI 客户端初始化
// 支持智谱 AI (GLM-4.7)、DeepSeek、OpenAI
// ============================================================================

let zhipuClient: ReturnType<typeof createOpenAI> | null = null;
let deepseekClient: ReturnType<typeof createDeepSeek> | null = null;
let openaiClient: ReturnType<typeof createOpenAI> | null = null;

/**
 * AI 提供商类型
 */
export type AIProvider = 'zhipu' | 'deepseek' | 'openai';

/**
 * 当前使用的 AI 提供商
 */
let currentProvider: AIProvider = 'zhipu';

/**
 * 初始化 AI 客户端
 * 优先级: 智谱 AI > DeepSeek > OpenAI
 */
export function initializeAIClients() {
  const zhipuKey = process.env.ZHIPU_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 智谱 AI (GLM-4.7) - 兼容 OpenAI 格式
  if (zhipuKey) {
    zhipuClient = createOpenAI({
      apiKey: zhipuKey,
      baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    });
    currentProvider = 'zhipu';
  }

  // DeepSeek
  if (deepseekKey) {
    deepseekClient = createDeepSeek({
      apiKey: deepseekKey,
      baseURL: 'https://api.deepseek.com',
    });
    if (!zhipuClient) currentProvider = 'deepseek';
  }

  // OpenAI
  if (openaiKey) {
    openaiClient = createOpenAI({
      apiKey: openaiKey,
    });
    if (!zhipuClient && !deepseekClient) currentProvider = 'openai';
  }

  if (!zhipuClient && !deepseekClient && !openaiClient) {
    throw new Error('至少需要配置 ZHIPU_API_KEY、DEEPSEEK_API_KEY 或 OPENAI_API_KEY');
  }

  console.log(`AI 客户端初始化完成，当前提供商: ${currentProvider}`);
}

/**
 * 获取 AI 客户端
 * 优先级: 智谱 AI > DeepSeek > OpenAI
 */
export function getAIClient() {
  return zhipuClient || deepseekClient || openaiClient;
}

/**
 * 获取当前使用的模型名称
 */
export function getModelName(): string {
  switch (currentProvider) {
    case 'zhipu':
      return 'glm-4-flash'; // GLM-4.7 快速响应版本
    case 'deepseek':
      return 'deepseek-chat';
    case 'openai':
      return 'gpt-4o';
    default:
      return 'glm-4-flash';
  }
}

/**
 * 获取当前 AI 提供商
 */
export function getAIProvider(): AIProvider {
  return currentProvider;
}

// ============================================================================
// 预设问题配置
// ============================================================================

export interface PresetQuestion {
  id: string;
  label: string;
  question: string;
  category: string;
}

export const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'product-focus',
    label: '产品取舍',
    question: '我的产品功能太多了，用户根本记不住。我该怎么砍？',
    category: 'product',
  },
  {
    id: 'design-aesthetic',
    label: '审美纠偏',
    question: '现在大家的设计都差不多，怎么才能做出彩？',
    category: 'design',
  },
  {
    id: 'brand-soul',
    label: '品牌灵魂',
    question: '营销话术没人信了，怎么才能真正打动人？',
    category: 'brand',
  },
  {
    id: 'innovation-bottleneck',
    label: '创新瓶颈',
    question: '竞品都在卷参数，我到底该怎么办？',
    category: 'innovation',
  },
];

// ============================================================================
// 金句提取
// ============================================================================

export interface QuoteResult {
  text: string;
  startIndex: number;
  endIndex: number;
}

export function extractQuote(message: string): QuoteResult | null {
  if (!message || message.length < 20) {
    return null;
  }

  // 策略1: 找最长的句子
  const sentences = message.split(/[。！？.!?]/).filter(s => s.trim().length > 10);

  if (sentences.length === 0) {
    // 如果没有句子分隔符，取前100字符
    return {
      text: message.slice(0, 100),
      startIndex: 0,
      endIndex: Math.min(100, message.length),
    };
  }

  // 找最长且最有"金句感"的句子（包含关键词）
  const keywordPatterns = [
    /简单/g, /极致/g, /专注/g, /不/g, /艺术/g,
    /Simplicity/g, /Focus/g, /Great/g, /Art/g,
  ];

  let bestSentence = sentences[0];
  let maxScore = 0;

  for (const sentence of sentences) {
    let score = sentence.length;

    for (const pattern of keywordPatterns) {
      if (pattern.test(sentence)) {
        score += 20;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestSentence = sentence;
    }
  }

  const startIndex = message.indexOf(bestSentence);
  return {
    text: bestSentence.trim(),
    startIndex,
    endIndex: startIndex + bestSentence.length,
  };
}

// ============================================================================
// 辅助函数
// ============================================================================

export function buildSystemPrompt(userMessage: string): string {
  const { boostedPrompt } = detectBrandTrigger(userMessage);
  return boostedPrompt || STEVE_JOBS_SYSTEM_PROMPT;
}

export function formatChatHistory(messages: ChatMessage[]): string {
  return messages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n\n');
}
