/**
 * 访问统计 API
 * 提供访问量的记录和查询功能
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordVisit, getVisitStats, getClientIp } from '@/lib/visit-counter';

// ============================================================================
// API 配置
// ============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// GET - 获取访问统计数据
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const stats = await getVisitStats();

    return NextResponse.json({
      success: true,
      data: {
        totalVisits: stats.totalVisits,
        uniqueVisitors: stats.uniqueVisitors,
        lastUpdated: stats.lastUpdated,
      },
    });
  } catch (error) {
    console.error('获取访问统计失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取统计数据失败',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - 记录一次访问
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 记录访问
    const stats = await recordVisit(ip);

    return NextResponse.json({
      success: true,
      data: {
        totalVisits: stats.totalVisits,
        uniqueVisitors: stats.uniqueVisitors,
        lastUpdated: stats.lastUpdated,
      },
    });
  } catch (error) {
    console.error('记录访问失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '记录访问失败',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS - CORS 支持
// ============================================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
