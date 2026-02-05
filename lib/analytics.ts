/**
 * Analytics - 埋点数据收集系统
 */

import { ANALYTICS_EVENTS, type AnalyticsEvent } from '@/types/analytics';

// ============================================================================
// Session 管理
// ============================================================================

const SESSION_STORAGE_KEY = 'jobs_memorial_session_id';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24小时

/**
 * 获取或创建 Session ID
 */
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * 生成 Session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 重置 Session ID
 */
export function resetSessionId(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  getSessionId();
}

// ============================================================================
// 事件收集
// ============================================================================

/**
 * 记录分析事件（发送到服务器）
 */
export async function trackEvent(
  eventName: string,
  properties: Record<string, any> = {}
): Promise<boolean> {
  try {
    const sessionId = getSessionId();
    const event: AnalyticsEvent = {
      event: eventName,
      properties,
      timestamp: Date.now(),
      sessionId,
    };

    // 异步发送，不阻塞主线程
    sendEventToServer(event).catch((error) => {
      console.error('Failed to send analytics event:', error);
    });

    return true;
  } catch (error) {
    console.error('Failed to track event:', error);
    return false;
  }
}

/**
 * 发送事件到服务器
 */
async function sendEventToServer(event: AnalyticsEvent): Promise<void> {
  const response = await fetch('/api/analytics/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 追踪对话打开
 */
export function trackChatOpened(source: 'button' | 'tag' | 'direct', page: string = '/') {
  return trackEvent(ANALYTICS_EVENTS.CHAT_OPENED, { source, page });
}

/**
 * 追踪消息发送
 */
export function trackChatMessageSent(
  presetId?: string,
  messageLength?: number,
  hasBrandKeyword?: boolean
) {
  return trackEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, {
    preset_id: presetId,
    message_length: messageLength,
    has_brand_keyword: hasBrandKeyword,
  });
}

/**
 * 追踪对话完成
 */
export function trackChatCompleted(rounds: number, durationMs: number, messagesCount: number) {
  return trackEvent(ANALYTICS_EVENTS.CHAT_COMPLETED, {
    rounds,
    duration_ms: durationMs,
    messages_count: messagesCount,
  });
}

/**
 * 追踪标签点击
 */
export function trackTagClicked(tagId: string, tagLabel: string) {
  return trackEvent(ANALYTICS_EVENTS.TAG_CLICKED, {
    tag_id: tagId,
    tag_label: tagLabel,
  });
}

/**
 * 追踪关键词触发
 */
export function trackKeywordTriggered(keyword: string, category: 'brand' | 'general') {
  return trackEvent(ANALYTICS_EVENTS.KEYWORD_TRIGGERED, {
    keyword,
    category,
  });
}

/**
 * 追踪金句分享
 */
export function trackQuoteShared(method: 'copy' | 'download', quoteLength: number) {
  return trackEvent(ANALYTICS_EVENTS.QUOTE_SHARED, {
    method,
    quote_length: quoteLength,
  });
}

/**
 * 追踪限流触发
 */
export function trackRateLimitHit(limitType: 'ip' | 'session', remaining: number) {
  return trackEvent(ANALYTICS_EVENTS.RATE_LIMIT_HIT, {
    limit_type: limitType,
    remaining,
  });
}

/**
 * 追踪内容拦截
 */
export function trackContentBlocked(reason: string, category: 'sensitive' | 'ad') {
  return trackEvent(ANALYTICS_EVENTS.CONTENT_BLOCKED, {
    reason,
    category,
  });
}

/**
 * 追踪 AI 错误
 */
export function trackAIError(provider: 'zhipu' | 'deepseek' | 'openai', errorType: string) {
  return trackEvent(ANALYTICS_EVENTS.AI_ERROR, {
    provider,
    error_type: errorType,
  });
}

// ============================================================================
// 获取统计数据
// ============================================================================

/**
 * 获取统计数据
 */
export async function getAnalyticsStats() {
  try {
    const response = await fetch('/api/analytics/stats');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return null;
  }
}
