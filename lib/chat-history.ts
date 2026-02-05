/**
 * Chat History - 对话历史持久化管理
 * 将对话历史保存到浏览器本地存储
 */

import type { ChatMessage } from './ai';

// ============================================================================
// 类型定义
// ============================================================================

export interface ChatHistory {
  id: string;
  title: string; // 从第一条消息提取的标题
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatHistoryStats {
  count: number;
  totalMessages: number;
  size: number;
  sizeFormatted: string;
}

// ============================================================================
// 常量
// ============================================================================

const HISTORY_KEY = 'jobs_memorial_chat_history';
const MAX_HISTORY_DAYS = 30;
const MAX_HISTORY_COUNT = 50; // 最多保存 50 条历史
const MAX_MESSAGES_PER_HISTORY = 100; // 每条历史最多 100 条消息

// ============================================================================
// 存储操作
// ============================================================================

/**
 * 保存对话历史
 */
export function saveChatHistory(
  sessionId: string,
  messages: ChatMessage[],
  title?: string
): void {
  try {
    // 检查是否启用历史记录
    const enabled = isHistoryEnabled();
    if (!enabled) return;

    // 限制消息数量
    const trimmedMessages = messages.slice(-MAX_MESSAGES_PER_HISTORY);

    // 生成标题（如果未提供）
    const historyTitle = title || generateTitle(trimmedMessages);

    const history: ChatHistory = {
      id: sessionId,
      title: historyTitle,
      messages: trimmedMessages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // 获取现有历史
    const allHistory = getAllHistory();

    // 更新或添加
    allHistory[sessionId] = history;

    // 清理过期数据
    cleanupExpiredHistory(allHistory);

    // 限制总数量
    const entries = Object.entries(allHistory);
    if (entries.length > MAX_HISTORY_COUNT) {
      // 按更新时间排序，保留最近的
      entries.sort((a, b) => b[1].updatedAt - a[1].updatedAt);
      const trimmed = entries.slice(0, MAX_HISTORY_COUNT);
      trimmed.forEach(([id, item]) => {
        allHistory[id] = item;
      });
    }

    // 保存到 localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
}

/**
 * 获取对话历史
 */
export function getChatHistory(sessionId: string): ChatHistory | null {
  try {
    const allHistory = getAllHistory();
    return allHistory[sessionId] || null;
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return null;
  }
}

/**
 * 获取所有历史
 */
export function getAllHistory(): Record<string, ChatHistory> {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * 获取历史列表（按时间倒序）
 */
export function getHistoryList(): ChatHistory[] {
  const allHistory = getAllHistory();
  return Object.values(allHistory)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * 删除指定历史
 */
export function deleteChatHistory(sessionId: string): void {
  try {
    const allHistory = getAllHistory();
    delete allHistory[sessionId];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error('Failed to delete chat history:', error);
  }
}

/**
 * 清空所有历史
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
}

/**
 * 清理过期历史
 */
function cleanupExpiredHistory(history: Record<string, ChatHistory>): void {
  const now = Date.now();
  const maxAge = MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000;

  for (const [id, item] of Object.entries(history)) {
    if (now - item.updatedAt > maxAge) {
      delete history[id];
    }
  }
}

// ============================================================================
// 设置管理
// ============================================================================

const HISTORY_ENABLED_KEY = 'chat_history_enabled';

/**
 * 检查历史记录是否启用
 */
export function isHistoryEnabled(): boolean {
  try {
    return localStorage.getItem(HISTORY_ENABLED_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * 设置历史记录开关
 */
export function setHistoryEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(HISTORY_ENABLED_KEY, String(enabled));

    // 如果关闭，清空现有历史
    if (!enabled) {
      clearAllHistory();
    }
  } catch (error) {
    console.error('Failed to set history enabled:', error);
  }
}

/**
 * 切换历史记录开关
 */
export function toggleHistoryEnabled(): boolean {
  const current = isHistoryEnabled();
  const newValue = !current;
  setHistoryEnabled(newValue);
  return newValue;
}

// ============================================================================
// 统计信息
// ============================================================================

/**
 * 获取历史记录统计
 */
export function getHistoryStats(): ChatHistoryStats {
  try {
    const allHistory = getAllHistory();
    const count = Object.keys(allHistory).length;
    const totalMessages = Object.values(allHistory).reduce(
      (sum, h) => sum + h.messages.length,
      0
    );

    const data = localStorage.getItem(HISTORY_KEY);
    const size = data ? new Blob([data]).size : 0;

    return {
      count,
      totalMessages,
      size,
      sizeFormatted: formatSize(size),
    };
  } catch {
    return {
      count: 0,
      totalMessages: 0,
      size: 0,
      sizeFormatted: '0 B',
    };
  }
}

/**
 * 计算历史存储大小
 */
export function getHistorySize(): number {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? new Blob([data]).size : 0;
}

/**
 * 格式化文件大小
 */
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 从消息生成标题
 */
function generateTitle(messages: ChatMessage[]): string {
  if (messages.length === 0) {
    return '新对话';
  }

  // 从第一条用户消息生成标题
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content.trim();
    // 取前 30 个字符
    return content.length > 30
      ? content.slice(0, 30) + '...'
      : content;
  }

  return '新对话';
}

/**
 * 搜索历史记录
 */
export function searchHistory(query: string): ChatHistory[] {
  const allHistory = getHistoryList();
  const lowerQuery = query.toLowerCase();

  return allHistory.filter(history => {
    // 搜索标题
    if (history.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // 搜索消息内容
    return history.messages.some(msg =>
      msg.content.toLowerCase().includes(lowerQuery)
    );
  });
}
