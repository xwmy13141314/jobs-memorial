/**
 * Analytics Stats API - 统计数据查询端点
 * 返回埋点数据的统计分析结果
 */

import { NextRequest, NextResponse } from 'next/server';
import type { StatsResponse } from '@/types/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// 数据读取
// ============================================================================

const ANALYTICS_FILE = 'data/analytics.json';

interface AnalyticsData {
  events: any[];
  stats: {
    total_events: number;
    last_updated: number;
  };
}

async function readAnalyticsData(): Promise<AnalyticsData | null> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// ============================================================================
// GET 处理器
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    // 读取分析数据
    const data = await readAnalyticsData();

    if (!data || data.events.length === 0) {
      return NextResponse.json({
        chats: {
          total_chats: 0,
          total_messages: 0,
          avg_rounds: 0,
          avg_duration_ms: 0,
        },
        popular_tags: [],
        top_quotes: [],
        brand_triggers: 0,
        errors: {
          total_errors: 0,
          errors_by_type: {},
          error_rate: 0,
        },
        last_updated: Date.now(),
      } as StatsResponse);
    }

    // 计算统计数据
    const stats = calculateStats(data.events);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Analytics stats API error:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// ============================================================================
// 统计计算
// ============================================================================

function calculateStats(events: any[]): StatsResponse {
  // 对话相关统计
  const chatOpenedEvents = events.filter(e => e.event === 'chat.opened');
  const messageEvents = events.filter(e => e.event === 'chat.message_sent');
  const completedEvents = events.filter(e => e.event === 'chat.completed');

  // 平均对话轮数和时长
  let avgRounds = 0;
  let avgDuration = 0;

  if (completedEvents.length > 0) {
    const totalRounds = completedEvents.reduce((sum, e) => sum + (e.properties.rounds || 0), 0);
    const totalDuration = completedEvents.reduce((sum, e) => sum + (e.properties.duration_ms || 0), 0);
    avgRounds = Math.round(totalRounds / completedEvents.length);
    avgDuration = Math.round(totalDuration / completedEvents.length);
  }

  // 热门标签统计
  const tagClickEvents = events.filter(e => e.event === 'tag.clicked');
  const tagCounts = new Map<string, number>();

  for (const event of tagClickEvents) {
    const label = event.properties.tag_label || event.properties.tag_id || 'Unknown';
    tagCounts.set(label, (tagCounts.get(label) || 0) + 1);
  }

  const popularTags = Array.from(tagCounts.entries())
    .map(([tag_label, count]) => ({
      tag_id: tag_label.toLowerCase().replace(/\s+/g, '-'),
      tag_label,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 金句分享统计
  const quoteEvents = events.filter(e => e.event === 'quote.shared');
  const quoteCounts = new Map<string, { count: number; method: 'copy' | 'download' }>();

  for (const event of quoteEvents) {
    const quoteLength = event.properties.quote_length || 0;
    const quoteRange = getQuoteRange(quoteLength);
    const method = event.properties.method || 'copy';

    const key = `${quoteRange}_${method}`;
    const existing = quoteCounts.get(key) || { count: 0, method };
    existing.count++;
    quoteCounts.set(key, existing);
  }

  const topQuotes = Array.from(quoteCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => ({
      quote: `金句 (${item.method})`,
      shares: item.count,
      method: item.method,
    }));

  // 品牌关键词触发统计
  const brandTriggerEvents = events.filter(e =>
    e.event === 'keyword.triggered' && e.properties.category === 'brand'
  );

  // 错误统计
  const errorEvents = events.filter(e =>
    e.event.startsWith('rate_limit.') ||
    e.event.startsWith('content_blocked.') ||
    e.event.startsWith('ai.error.')
  );

  const errorsByType: Record<string, number> = {};
  for (const event of errorEvents) {
    const errorType = event.event;
    errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
  }

  const errorRate = events.length > 0
    ? (errorEvents.length / events.length) * 100
    : 0;

  return {
    chats: {
      total_chats: chatOpenedEvents.length,
      total_messages: messageEvents.length,
      avg_rounds: avgRounds,
      avg_duration_ms: avgDuration,
    },
    popular_tags,
    top_quotes,
    brand_triggers: brandTriggerEvents.length,
    errors: {
      total_errors: errorEvents.length,
      errors_by_type: errorsByType,
      error_rate: Math.round(errorRate * 100) / 100,
    },
    last_updated: Date.now(),
  };
}

/**
 * 根据长度获取金句范围描述
 */
function getQuoteRange(length: number): string {
  if (length < 30) return '短句 (<30字)';
  if (length < 50) return '中句 (30-50字)';
  if (length < 80) return '长句 (50-80字)';
  return '超长句 (>80字)';
}

// ============================================================================
// OPTIONS 处理器 (CORS)
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
