/**
 * Rate Limiter - 限流控制
 * 支持 IP 级别和会话级别的限流
 */

// ============================================================================
// 类型定义
// ============================================================================

export interface RateLimitResult {
  allowed: boolean;
  message?: string;
  resetAt?: number;
  remaining?: number;
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

// ============================================================================
// 内存存储（生产环境建议使用 Redis/Vercel KV）
// ============================================================================

const ipStore = new Map<string, RateLimitEntry>();
const sessionStore = new Map<string, RateLimitEntry>();

// 清理过期数据的定时器（每小时执行一次）
setInterval(() => {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (const [key, entry] of ipStore.entries()) {
    if (now - entry.firstRequest > dayInMs) {
      ipStore.delete(key);
    }
  }

  for (const [key, entry] of sessionStore.entries()) {
    if (now - entry.firstRequest > dayInMs) {
      sessionStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

// ============================================================================
// 配置
// ============================================================================

const CONFIG = {
  // IP 级别限流：每分钟最多 5 次请求
  ip: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_MINUTE || '5'),
    windowMs: 60 * 1000,
  },
  // 会话级别限流：每天最多 30 轮对话
  session: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_DAY || '30'),
    windowMs: 24 * 60 * 60 * 1000,
  },
};

// ============================================================================
// 限流检查
// ============================================================================

/**
 * IP 级别限流检查
 */
export async function rateLimitCheck(
  identifier: string,
  type: 'ip' | 'session' = 'ip'
): Promise<RateLimitResult> {
  const now = Date.now();
  const store = type === 'ip' ? ipStore : sessionStore;
  const config = type === 'ip' ? CONFIG.ip : CONFIG.session;

  const entry = store.get(identifier);

  // 如果没有记录，创建新条目
  if (!entry) {
    store.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  // 检查是否在时间窗口内
  const timeSinceFirstRequest = now - entry.firstRequest;

  if (timeSinceFirstRequest > config.windowMs) {
    // 时间窗口已过期，重置计数
    store.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  // 在时间窗口内，检查是否超过限制
  if (entry.count >= config.maxRequests) {
    const resetAt = entry.firstRequest + config.windowMs;
    return {
      allowed: false,
      message: getLimitMessage(type),
      resetAt,
      remaining: 0,
    };
  }

  // 增加计数
  entry.count += 1;
  entry.lastRequest = now;

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
  };
}

/**
 * 组合限流检查（同时检查 IP 和会话级别）
 */
export async function combinedRateLimitCheck(
  ip: string,
  sessionId?: string
): Promise<RateLimitResult> {
  // IP 级别检查
  const ipResult = await rateLimitCheck(ip, 'ip');
  if (!ipResult.allowed) {
    return ipResult;
  }

  // 如果提供了 sessionId，进行会话级别检查
  if (sessionId) {
    const sessionResult = await rateLimitCheck(sessionId, 'session');
    if (!sessionResult.allowed) {
      return sessionResult;
    }
  }

  return { allowed: true };
}

// ============================================================================
// 辅助函数
// ============================================================================

function getLimitMessage(type: 'ip' | 'session'): string {
  const messages = {
    ip: '休息一下，思考需要时间。请稍后再试。',
    session: '今日灵感额度已用完，明天再来吧！Stay hungry, stay foolish.',
  };

  return messages[type];
}

/**
 * 获取当前限流状态（用于调试）
 */
export function getRateLimitStatus(identifier: string, type: 'ip' | 'session' = 'ip') {
  const store = type === 'ip' ? ipStore : sessionStore;
  const entry = store.get(identifier);

  if (!entry) {
    return {
      count: 0,
      remaining: type === 'ip' ? CONFIG.ip.maxRequests : CONFIG.session.maxRequests,
      resetAt: Date.now() + (type === 'ip' ? CONFIG.ip.windowMs : CONFIG.session.windowMs),
    };
  }

  const config = type === 'ip' ? CONFIG.ip : CONFIG.session;
  const resetAt = entry.firstRequest + config.windowMs;

  return {
    count: entry.count,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt,
  };
}

/**
 * 重置限流（管理员功能）
 */
export function resetRateLimit(identifier: string, type: 'ip' | 'session' = 'ip') {
  const store = type === 'ip' ? ipStore : sessionStore;
  store.delete(identifier);
  return { success: true };
}

/**
 * 清理所有过期数据
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  let ipCleaned = 0;
  let sessionCleaned = 0;

  for (const [key, entry] of ipStore.entries()) {
    if (now - entry.firstRequest > CONFIG.ip.windowMs) {
      ipStore.delete(key);
      ipCleaned++;
    }
  }

  for (const [key, entry] of sessionStore.entries()) {
    if (now - entry.firstRequest > CONFIG.session.windowMs) {
      sessionStore.delete(key);
      sessionCleaned++;
    }
  }

  return { ipCleaned, sessionCleaned };
}
