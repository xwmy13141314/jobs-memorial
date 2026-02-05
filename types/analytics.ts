/**
 * Analytics - 埋点系统类型定义
 */

// ============================================================================
// 事件类型
// ============================================================================

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface EventRequestBody {
  event: string;
  properties: Record<string, any>;
}

export interface EventResponseBody {
  success: boolean;
  eventId: string;
}

// ============================================================================
// 统计数据类型
// ============================================================================

export interface ChatStats {
  total_chats: number;
  total_messages: number;
  avg_rounds: number;
  avg_duration_ms: number;
}

export interface TagStats {
  tag_id: string;
  tag_label: string;
  count: number;
}

export interface QuoteStats {
  quote: string;
  shares: number;
  method: 'copy' | 'download';
}

export interface ErrorStats {
  total_errors: number;
  errors_by_type: Record<string, number>;
  error_rate: number;
}

export interface StatsResponse {
  chats: ChatStats;
  popular_tags: TagStats[];
  top_quotes: QuoteStats[];
  brand_triggers: number;
  errors: ErrorStats;
  last_updated: number;
}

// ============================================================================
// 事件属性类型
// ============================================================================

export interface ChatOpenedEvent {
  source: 'button' | 'tag' | 'direct';
  page: string;
}

export interface ChatMessageSentEvent {
  preset_id?: string;
  message_length: number;
  has_brand_keyword: boolean;
}

export interface ChatCompletedEvent {
  rounds: number;
  duration_ms: number;
  messages_count: number;
}

export interface TagClickedEvent {
  tag_id: string;
  tag_label: string;
}

export interface KeywordTriggeredEvent {
  keyword: string;
  category: 'brand' | 'general';
}

export interface QuoteSharedEvent {
  method: 'copy' | 'download';
  quote_length: number;
}

export interface RateLimitHitEvent {
  limit_type: 'ip' | 'session';
  remaining: number;
}

export interface ContentBlockedEvent {
  reason: string;
  category: 'sensitive' | 'ad';
}

export interface AIErrorEvent {
  provider: 'zhipu' | 'deepseek' | 'openai';
  error_type: string;
}

// ============================================================================
// 事件名称常量
// ============================================================================

export const ANALYTICS_EVENTS = {
  // 对话相关
  CHAT_OPENED: 'chat.opened',
  CHAT_MESSAGE_SENT: 'chat.message_sent',
  CHAT_COMPLETED: 'chat.completed',

  // 内容相关
  TAG_CLICKED: 'tag.clicked',
  KEYWORD_TRIGGERED: 'keyword.triggered',
  QUOTE_SHARED: 'quote.shared',

  // 错误相关
  RATE_LIMIT_HIT: 'rate_limit.hit',
  CONTENT_BLOCKED: 'content.blocked',
  AI_ERROR: 'ai.error',
} as const;
