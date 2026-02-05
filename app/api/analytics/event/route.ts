/**
 * Analytics Event API - 埋点事件上报端点
 * 接收前端发送的埋点事件并存储
 */

import { NextRequest, NextResponse } from 'next/server';
import { type AnalyticsEvent } from '@/types/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// 数据存储
// ============================================================================

const ANALYTICS_FILE = 'data/analytics.json';

interface AnalyticsData {
  events: AnalyticsEvent[];
  stats: {
    total_events: number;
    last_updated: number;
  };
}

/**
 * 读取分析数据
 */
async function readAnalyticsData(): Promise<AnalyticsData> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // 文件不存在，返回默认数据
    return {
      events: [],
      stats: {
        total_events: 0,
        last_updated: Date.now(),
      },
    };
  }
}

/**
 * 写入分析数据
 */
async function writeAnalyticsData(data: AnalyticsData): Promise<void> {
  const fs = await import('fs/promises');
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

/**
 * 清理过期事件（保留最近90天）
 */
async function cleanupOldEvents(events: AnalyticsEvent[]): Promise<AnalyticsEvent[]> {
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  return events.filter((event) => event.timestamp > ninetyDaysAgo);
}

// ============================================================================
// POST 处理器
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const body = await req.json();
    const { event, properties } = body;

    // 验证请求
    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { error: 'invalid_request', message: 'event is required' },
        { status: 400 }
      );
    }

    // 获取用户信息
    const userIp = req.headers.get('x-forwarded-for') ||
                   req.headers.get('x-real-ip') ||
                   'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 匿名化处理 IP
    const anonymizedIp = anonymizeIP(userIp);

    // 创建事件对象
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        // 添加额外上下文
        ip: anonymizedIp,
        user_agent: userAgent,
      },
      timestamp: Date.now(),
      sessionId: body.sessionId || generateSessionId(),
    };

    // 读取现有数据
    const data = await readAnalyticsData();

    // 清理旧事件
    data.events = await cleanupOldEvents(data.events);

    // 添加新事件
    data.events.push(analyticsEvent);
    data.stats.total_events = data.events.length;
    data.stats.last_updated = Date.now();

    // 限制事件数量（最多保留 10000 条）
    if (data.events.length > 10000) {
      data.events = data.events.slice(-10000);
    }

    // 写入文件
    await writeAnalyticsData(data);

    return NextResponse.json({
      success: true,
      eventId: generateEventId(),
    });
  } catch (error) {
    console.error('Analytics event API error:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS 处理器 (CORS)
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 生成事件 ID
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 生成 Session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 匿名化 IP 地址（保留前3段，掩码后1段）
 */
function anonymizeIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  }
  // IPv6 或其他格式
  return ip.replace(/(\d+\.){3}\d+/, '$0***');
}
