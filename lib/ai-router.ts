/**
 * AI Router - AI 提供商智能路由器
 * 支持多提供商自动切换和负载均衡
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import type { ChatMessage } from './ai';
import type { AIProviderId } from './ai-config';
import { getProviderById, getEnabledProviders } from './ai-config';

// ============================================================================
// 类型定义
// ============================================================================

export interface ChatResult {
  content: string;
  provider: AIProviderId;
  model: string;
  tokens?: number;
}

export interface RouterConfig {
  maxRetries?: number;
  preferredProvider?: AIProviderId;
  enableFailover?: boolean;
}

// ============================================================================
// AIRouter 类
// ============================================================================

export class AIRouter {
  private clients: Map<AIProviderId, any>;
  private failureCount: Map<AIProviderId, number>;
  private lastFailureTime: Map<AIProviderId, number>;
  private cooldownPeriod: number = 5 * 60 * 1000; // 5分钟冷却期

  constructor() {
    this.clients = new Map();
    this.failureCount = new Map();
    this.lastFailureTime = new Map();
    this.initializeClients();
  }

  /**
   * 初始化 AI 客户端
   */
  private initializeClients() {
    // 智谱 AI
    if (process.env.ZHIPU_API_KEY) {
      this.clients.set('zhipu', createOpenAI({
        apiKey: process.env.ZHIPU_API_KEY,
        baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
      }));
    }

    // DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
      this.clients.set('deepseek', createDeepSeek({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      }));
    }

    // OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.clients.set('openai', createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }));
    }
  }

  /**
   * 选择最佳 AI 提供商
   */
  private async selectProvider(preferred?: AIProviderId): Promise<AIProviderId> {
    const enabled = getEnabledProviders();

    if (enabled.length === 0) {
      throw new Error('没有可用的 AI 提供商');
    }

    const now = Date.now();

    // 如果指定了首选且可用
    if (preferred) {
      const provider = getProviderById(preferred);
      if (provider && provider.enabled && !this.isInCooldown(preferred, now)) {
        return preferred;
      }
    }

    // 按优先级和失败次数排序
    const sorted = enabled.sort((a, b) => {
      const aFailures = this.failureCount.get(a.id as AIProviderId) || 0;
      const bFailures = this.failureCount.get(b.id as AIProviderId) || 0;

      if (aFailures !== bFailures) {
        return aFailures - bFailures; // 失败少的优先
      }

      return a.priority - b.priority; // 优先级高的优先
    });

    // 选择第一个未在冷却期的
    for (const provider of sorted) {
      const providerId = provider.id as AIProviderId;
      if (!this.isInCooldown(providerId, now)) {
        return providerId;
      }
    }

    // 全部冷却中，使用优先级最高的
    return sorted[0].id as AIProviderId;
  }

  /**
   * 检查提供商是否在冷却期
   */
  private isInCooldown(providerId: AIProviderId, now: number): boolean {
    const lastFailure = this.lastFailureTime.get(providerId) || 0;
    return (now - lastFailure) < this.cooldownPeriod;
  }

  /**
   * 记录失败
   */
  private recordFailure(providerId: AIProviderId) {
    const count = (this.failureCount.get(providerId) || 0) + 1;
    this.failureCount.set(providerId, count);
    this.lastFailureTime.set(providerId, Date.now());
  }

  /**
   * 重置失败计数
   */
  private resetFailure(providerId: AIProviderId) {
    this.failureCount.set(providerId, 0);
  }

  /**
   * 调用 AI（自动重试和故障转移）
   */
  async chat(
    messages: ChatMessage[],
    systemPrompt: string,
    config: RouterConfig = {}
  ): Promise<ChatResult> {
    const {
      maxRetries = 2,
      preferredProvider,
      enableFailover = true,
    } = config;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // 选择提供商
        const providerId = await this.selectProvider(preferredProvider);
        const provider = getProviderById(providerId)!;
        const client = this.clients.get(providerId);

        if (!client) {
          throw new Error(`AI 客户端未初始化: ${providerId}`);
        }

        console.log(`[AIRouter] 使用提供商: ${provider.name} (${providerId})`);

        // 构建消息列表
        const chatMessages = [
          { role: 'system', content: systemPrompt },
          ...messages,
        ];

        // 调用 AI（这里使用简化的调用方式）
        // 实际项目中应该使用流式响应和正确的 SDK
        const response = await this.callAI(client, chatMessages, provider.model);

        // 成功后重置失败计数
        this.resetFailure(providerId);

        return {
          content: response.content,
          provider: providerId,
          model: provider.model,
          tokens: response.tokens,
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`[AIRouter] 调用失败 (${attempt + 1}/${maxRetries + 1}):`, error);

        // 记录失败
        if (enableFailover) {
          const providerId = await this.selectProvider(preferredProvider);
          this.recordFailure(providerId);
        }

        // 最后一次尝试失败，抛出错误
        if (attempt === maxRetries) {
          throw new Error(`所有 AI 提供商均不可用: ${lastError.message}`);
        }
      }
    }

    throw lastError || new Error('AI 调用失败');
  }

  /**
   * 调用 AI API（具体实现）
   */
  private async callAI(client: any, messages: any[], model: string): Promise<{
    content: string;
    tokens: number;
  }> {
    // 这里使用简化的实现
    // 实际项目中应该使用 Vercel AI SDK 的 streamText 函数

    try {
      // 生成 JWT token（智谱 AI）
      if (model.startsWith('glm-')) {
        const { generateZhipuToken } = await import('./zhipu-jwt');
        const apiKey = process.env.ZHIPU_API_KEY!;
        const token = generateZhipuToken(apiKey);

        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.8,
            stream: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return {
          content: data.choices[0].message.content,
          tokens: data.usage?.total_tokens || 0,
        };
      }

      // 其他提供商使用 SDK
      // 这里需要根据实际情况调整

      throw new Error('未实现的 AI 提供商');
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取失败统计
   */
  getFailureStats(): Record<AIProviderId, number> {
    return Object.fromEntries(this.failureCount) as Record<AIProviderId, number>;
  }

  /**
   * 重置所有失败计数
   */
  resetAllFailures() {
    this.failureCount.clear();
    this.lastFailureTime.clear();
  }
}

// ============================================================================
// 单例实例
// ============================================================================

let routerInstance: AIRouter | null = null;

export function getAIRouter(): AIRouter {
  if (!routerInstance) {
    routerInstance = new AIRouter();
  }
  return routerInstance;
}

export function resetAIRouter() {
  routerInstance = null;
}
