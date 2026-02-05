/**
 * AI Health - AI 提供商健康检查
 * 检查各个 AI 提供商的可用性
 */

import type { AIProvider, AIProviderId } from './ai-config';
import { AI_PROVIDERS, getEnabledProviders } from './ai-config';

// ============================================================================
// 类型定义
// ============================================================================

export interface HealthStatus {
  all: AIProvider[];
  healthy: Record<AIProviderId, boolean>;
  healthyCount: number;
  hasBackup: boolean;
}

export interface ProviderHealth {
  provider: AIProviderId;
  name: string;
  healthy: boolean;
  responseTime?: number;
  error?: string;
}

// ============================================================================
// 健康检查
// ============================================================================

/**
 * 检查所有 AI 提供商的健康状态
 */
export async function checkAIHealth(): Promise<HealthStatus> {
  const results: Record<AIProviderId, boolean> = {} as Record<AIProviderId, boolean>;

  for (const provider of AI_PROVIDERS) {
    if (!provider.enabled) {
      results[provider.id as AIProviderId] = false;
      continue;
    }

    try {
      const healthy = await checkProviderHealth(provider);
      results[provider.id as AIProviderId] = healthy;
    } catch {
      results[provider.id as AIProviderId] = false;
    }
  }

  const healthyCount = Object.values(results).filter(Boolean).length;
  const enabledProviders = getEnabledProviders();

  return {
    all: AI_PROVIDERS,
    healthy: results,
    healthyCount,
    hasBackup: healthyCount > 1,
  };
}

/**
 * 检查单个提供商的健康状态
 */
export async function checkProviderHealth(provider: AIProvider): Promise<boolean> {
  if (!provider.enabled) {
    return false;
  }

  const startTime = Date.now();

  try {
    switch (provider.id) {
      case 'zhipu':
        return await checkZhipuHealth();
      case 'deepseek':
        return await checkDeepSeekHealth();
      case 'openai':
        return await checkOpenAIHealth();
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * 检查智谱 AI 健康状态
 */
async function checkZhipuHealth(): Promise<boolean> {
  try {
    const { generateZhipuToken } = await import('./zhipu-jwt');
    const apiKey = process.env.ZHIPU_API_KEY;

    if (!apiKey) return false;

    const token = generateZhipuToken(apiKey);

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 检查 DeepSeek 健康状态
 */
async function checkDeepSeekHealth(): Promise<boolean> {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return false;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 检查 OpenAI 健康状态
 */
async function checkOpenAIHealth(): Promise<boolean> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return false;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 获取详细的健康检查结果
 */
export async function getDetailedHealth(): Promise<ProviderHealth[]> {
  const results: ProviderHealth[] = [];

  for (const provider of AI_PROVIDERS) {
    if (!provider.enabled) {
      results.push({
        provider: provider.id as AIProviderId,
        name: provider.name,
        healthy: false,
        error: '未启用',
      });
      continue;
    }

    const startTime = Date.now();

    try {
      const healthy = await checkProviderHealth(provider);
      const responseTime = Date.now() - startTime;

      results.push({
        provider: provider.id as AIProviderId,
        name: provider.name,
        healthy,
        responseTime: healthy ? responseTime : undefined,
        error: healthy ? undefined : '连接失败',
      });
    } catch (error) {
      results.push({
        provider: provider.id as AIProviderId,
        name: provider.name,
        healthy: false,
        error: (error as Error).message,
      });
    }
  }

  return results;
}

/**
 * 定期健康检查（用于后台监控）
 */
export function startHealthCheck(intervalMs: number = 5 * 60 * 1000) {
  // 每 5 分钟检查一次
  return setInterval(async () => {
    try {
      const health = await checkAIHealth();
      console.log('[AI Health Check]', health);

      // 如果所有提供商都不健康，发送告警
      if (health.healthyCount === 0) {
        console.error('[AI Health] 所有 AI 提供商均不可用！');
        // 这里可以添加告警逻辑（发送邮件、短信等）
      }
    } catch (error) {
      console.error('[AI Health Check] 失败:', error);
    }
  }, intervalMs);
}
