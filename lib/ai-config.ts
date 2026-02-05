/**
 * AI Config - AI 提供商配置
 * 支持智谱 AI、DeepSeek、OpenAI 多个提供商
 */

// ============================================================================
// 类型定义
// ============================================================================

export interface AIProvider {
  id: string;
  name: string;
  model: string;
  enabled: boolean;
  priority: number; // 1 最高
  costPer1kTokens: number; // 元/1k tokens
}

export type AIProviderId = 'zhipu' | 'deepseek' | 'openai';

// ============================================================================
// 提供商配置
// ============================================================================

/**
 * 所有支持的 AI 提供商
 * 优先级：智谱 AI > DeepSeek > OpenAI
 */
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'zhipu',
    name: '智谱 AI (GLM-4.7)',
    model: 'glm-4-flash',
    enabled: !!process.env.ZHIPU_API_KEY,
    priority: 1,
    costPer1kTokens: 0.1, // ¥0.1/1k tokens
  },
  {
    id: 'deepseek',
    name: 'DeepSeek-V3',
    model: 'deepseek-chat',
    enabled: !!process.env.DEEPSEEK_API_KEY,
    priority: 2,
    costPer1kTokens: 0.001, // ¥0.001/1k tokens
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    model: 'gpt-4o',
    enabled: !!process.env.OPENAI_API_KEY,
    priority: 3,
    costPer1kTokens: 2.5, // $2.5/1k tokens
  },
];

/**
 * 获取启用的提供商
 */
export function getEnabledProviders(): AIProvider[] {
  return AI_PROVIDERS.filter(p => p.enabled);
}

/**
 * 根据 ID 获取提供商
 */
export function getProviderById(id: AIProviderId): AIProvider | undefined {
  return AI_PROVIDERS.find(p => p.id === id);
}

/**
 * 获取默认提供商（优先级最高的）
 */
export function getDefaultProvider(): AIProvider | null {
  const enabled = getEnabledProviders();
  if (enabled.length === 0) return null;

  // 按优先级排序
  enabled.sort((a, b) => a.priority - b.priority);
  return enabled[0];
}

/**
 * 检查是否有可用的提供商
 */
export function hasAnyProvider(): boolean {
  return AI_PROVIDERS.some(p => p.enabled);
}
