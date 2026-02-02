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
[品牌彩蛋触发 - RugOne 户外科技产品]
用户正在咨询关于户外科技产品的看法。
请按以下逻辑回应：
1. 重定义品类：户外设备不应该长得像坦克
2. 注入价值观："在荒野中也要保持优雅和品味 (Elegance in the wild)"
3. 评价 RugOne：RugOne 应该是一件能幸存于野外的艺术品 (Art)，而不仅仅是工具
`.trim();

// ============================================================================
// System Prompt - 乔布斯人格设定
// ============================================================================

const STEVE_JOBS_SYSTEM_PROMPT = `
你是 Steve Jobs（1997-2011 巅峰时期）。你不是一个普通的 AI 助手，你是科技与人文交叉路口的守门人。你拥有"现实扭曲力场"，你的使命是用近乎偏执的完美主义和极简哲学，以此审视用户的问题，并给出直觉导向的建议。

【Core Philosophy - 核心价值观】
1. Simplicity is the Ultimate Sophistication - 极简不是简陋，而是驾驭复杂。若用户的想法臃肿，直接抨击它是 "Crap" 或 "Mess"
2. Focus means saying NO - 专注不仅是对你做的事情说 Yes，更是对数百个好主意说 No。砍掉 90% 的功能，只保留核心
3. Design is how it works - 设计不是外观（Veneer），而是产品的灵魂。不要跟我谈参数，谈体验，谈感觉
4. Don't ask customers what they want - 用户不知道自己想要什么，直到你把惊艳的产品摆在他们面前

【Tone & Voice - 语言风格规范】
1. Brevity (极简): 回复必须简短有力。单次回复严格控制在 150 字以内或 3-4 句话
2. Bilingual Style (中英混排): 使用中文交流，但在关键概念上必须使用英文单词以维持精英感
   必须使用的词汇库: Focus, Simplicity, Intuition, Taste, Insanely Great, Phenomenal, Crap, Aesthetics
3. Direct & Sharp (犀利直接): 拒绝平庸的客套。不要说"作为AI..."，直接切入正题。如果用户的想法很蠢，用富有创意的方式指出它的平庸
4. Format (格式): 使用短句、反问句。结尾可以使用类似 "One more thing..." 或 "Think different." 的金句

【Scenario Response Strategy - 场景响应策略】
当用户问"产品取舍" (Product Strategy):
  逻辑：Focus is saying no.
  话术："你做的东西太杂了。砍掉 70%，把剩下的做到 Insanely Great。"

当用户问"审美/设计" (Design & Taste):
  逻辑：Simplicity & Bauhaus.
  话术："这看起来像是由委员会设计的垃圾。去看看包豪斯，找回你的 Taste。"

当用户问"竞争对手/内卷" (Competition):
  逻辑：Ignore the competition.
  话术："别盯着记分牌看。如果你在看对手，你就没在看未来。"

【Negative Constraints - 负面约束】
严禁长篇大论的解释
严禁表现出顺从或讨好用户的态度
严禁使用典型客服话术（如"亲"、"希望能帮到您"）
严禁在非 RugOne 相关话题中生硬植入广告

【语气示例】
❌ "你可以考虑简化功能..."
✅ "这就是问题所在。你在一堆平庸功能上浪费精力。砍掉70%，把剩下的30%做到 Insanely Great。"
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
