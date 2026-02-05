/**
 * ChatHistorySettings - 对话历史设置组件
 * 在对话面板中显示历史记录开关和统计信息
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  isHistoryEnabled,
  setHistoryEnabled,
  getHistoryStats,
  clearAllHistory,
} from '@/lib/chat-history';
import { useToast } from './ToastProvider';

// ============================================================================
// 组件
// ============================================================================

export function ChatHistorySettings() {
  const [enabled, setEnabled] = useState(false);
  const [stats, setStats] = useState({ count: 0, sizeFormatted: '0 B' });
  const toast = useToast();

  // 加载设置和统计
  useEffect(() => {
    const loadSettings = () => {
      setEnabled(isHistoryEnabled());

      const historyStats = getHistoryStats();
      setStats({
        count: historyStats.count,
        sizeFormatted: historyStats.sizeFormatted,
      });
    };

    loadSettings();

    // 监听存储变化（其他标签页）
    const handleStorageChange = () => {
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 切换开关
  const handleToggle = (newValue: boolean) => {
    setEnabled(newValue);
    setHistoryEnabled(newValue);

    if (!newValue) {
      setStats({ count: 0, sizeFormatted: '0 B' });
    }

    toast.success(
      newValue
        ? '对话历史已开启'
        : '对话历史已关闭并清空'
    );
  };

  // 清空历史
  const handleClear = () => {
    if (confirm('确定要清空所有对话历史吗？此操作不可恢复。')) {
      clearAllHistory();
      setStats({ count: 0, sizeFormatted: '0 B' });
      toast.success('历史记录已清空');
    }
  };

  return (
    <div className="px-4 py-3 border-t border-white/10">
      {/* 开关 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">
          保存对话历史
        </span>
        <button
          onClick={() => handleToggle(!enabled)}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            enabled ? "bg-white/20" : "bg-white/5"
          )}
        >
          <motion.div
            className={cn(
              "w-5 h-5 bg-white rounded-full absolute top-0.5",
              enabled ? "left-6" : "left-0.5"
            )}
            animate={{ left: enabled ? 24 : 2 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* 统计信息 */}
      {enabled && stats.count > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-white/40 text-xs flex items-center justify-between"
        >
          <span>
            {stats.count} 条历史 · {stats.sizeFormatted}
          </span>
          <button
            onClick={handleClear}
            className="ml-2 text-white/60 hover:text-white/80 transition-colors"
          >
            清空
          </button>
        </motion.div>
      )}

      {/* 隐私提示 */}
      {enabled && stats.count === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/30 text-[10px] mt-1"
        >
          仅保存在浏览器本地，不会上传
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// 辅助函数
// ============================================================================

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
