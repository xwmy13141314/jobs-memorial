/**
 * 访问统计工具 - 支持多存储后端
 *
 * 存储方式选择：
 * - 默认：文件存储 (data/visit-stats.json) - 适用于本地开发
 * - Vercel KV：检测到 KV 环境时自动使用 - 适用于 Vercel 生产部署
 */

import { kv } from '@vercel/kv';

// ============================================================================
// 类型定义
// ============================================================================

interface VisitData {
  totalVisits: number;
  uniqueVisitors: number;
  lastUpdated: number;
}

interface FileVisitData {
  totalVisits: number;
  uniqueVisitors: number;
  ipRecords: Record<string, number>;
  lastUpdated: number;
}

// ============================================================================
// 常量配置
// ============================================================================

const VISIT_STATS_KEY = 'steve-jobs:visit-stats';
const IP_RECORDS_PREFIX = 'steve-jobs:ip:';
const IP_TTL = 86400; // 24小时（秒）

const DEFAULT_STATS = {
  totalVisits: 580,
  uniqueVisitors: 0,
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检测是否可用 Vercel KV
 */
async function isKvAvailable(): Promise<boolean> {
  try {
    await kv.get('test');
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取客户端IP地址
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}

// ============================================================================
// Vercel KV 存储实现
// ============================================================================

/**
 * 使用 KV 记录访问
 */
async function recordVisitWithKV(ip: string): Promise<VisitData> {
  const ipKey = `${IP_RECORDS_PREFIX}${ip}`;

  // 检查 IP 是否已记录
  const existingRecord = await kv.get<number>(ipKey);

  let stats: VisitData;
  const currentStats = await kv.get<VisitData>(VISIT_STATS_KEY);

  if (currentStats) {
    stats = currentStats;
  } else {
    stats = {
      ...DEFAULT_STATS,
      lastUpdated: Date.now(),
    };
  }

  if (!existingRecord && ip !== 'unknown') {
    // 新访客
    stats.totalVisits += 1;
    stats.uniqueVisitors += 1;
    stats.lastUpdated = Date.now();

    // 记录 IP，24小时后自动过期
    await kv.set(ipKey, Date.now(), { ex: IP_TTL });
    await kv.set(VISIT_STATS_KEY, stats);
  }

  return stats;
}

/**
 * 使用 KV 获取统计数据
 */
async function getStatsWithKV(): Promise<VisitData> {
  const stats = await kv.get<VisitData>(VISIT_STATS_KEY);

  if (stats) {
    return stats;
  }

  return {
    ...DEFAULT_STATS,
    lastUpdated: Date.now(),
  };
}

// ============================================================================
// 文件存储实现（备用）
// ============================================================================

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISIT_DATA_FILE = path.join(DATA_DIR, 'visit-stats.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readFileData(): Promise<FileVisitData> {
  await ensureDataDir();

  try {
    const data = await fs.readFile(VISIT_DATA_FILE, 'utf-8');
    return JSON.parse(data) as FileVisitData;
  } catch {
    return {
      totalVisits: DEFAULT_STATS.totalVisits,
      uniqueVisitors: DEFAULT_STATS.uniqueVisitors,
      ipRecords: {},
      lastUpdated: Date.now(),
    };
  }
}

async function writeFileData(data: FileVisitData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(VISIT_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function shouldCountIp(ipRecords: Record<string, number>, ip: string): boolean {
  if (ip === 'unknown') return false;

  const lastVisit = ipRecords[ip];
  if (!lastVisit) return true;

  const now = Date.now();
  const hoursSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60);

  return hoursSinceLastVisit >= 24;
}

async function recordVisitWithFile(ip: string): Promise<VisitData> {
  const data = await readFileData();

  const isNewVisitor = shouldCountIp(data.ipRecords, ip);

  if (isNewVisitor) {
    data.totalVisits += 1;
    data.uniqueVisitors += 1;
    data.ipRecords[ip] = Date.now();
    data.lastUpdated = Date.now();

    await writeFileData(data);
  }

  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueVisitors,
    lastUpdated: data.lastUpdated,
  };
}

async function getStatsWithFile(): Promise<VisitData> {
  const data = await readFileData();
  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueVisitors,
    lastUpdated: data.lastUpdated,
  };
}

// ============================================================================
// 公开接口（自动选择存储方式）
// ============================================================================

let kvAvailable: boolean | null = null;

/**
 * 记录访问并返回更新后的统计数据
 * 自动选择 KV 或文件存储
 */
export async function recordVisit(ip: string): Promise<VisitData> {
  // 首次检测 KV 可用性
  if (kvAvailable === null) {
    kvAvailable = await isKvAvailable();
  }

  if (kvAvailable) {
    return await recordVisitWithKV(ip);
  } else {
    return await recordVisitWithFile(ip);
  }
}

/**
 * 获取当前访问统计数据（不记录）
 * 自动选择 KV 或文件存储
 */
export async function getVisitStats(): Promise<VisitData> {
  // 首次检测 KV 可用性
  if (kvAvailable === null) {
    kvAvailable = await isKvAvailable();
  }

  if (kvAvailable) {
    return await getStatsWithKV();
  } else {
    return await getStatsWithFile();
  }
}
