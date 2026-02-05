/**
 * Toast - 优雅的提示组件
 * 支持 success/error/info/warning 四种类型
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// 类型定义
// ============================================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose?: () => void;
}

// ============================================================================
// 配置
// ============================================================================

const TOAST_CONFIG: Record<ToastType, { icon: string; bgColor: string; iconColor: string }> = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-500/90',
    iconColor: 'text-white',
  },
  error: {
    icon: '✕',
    bgColor: 'bg-red-500/90',
    iconColor: 'text-white',
  },
  info: {
    icon: 'i',
    bgColor: 'bg-blue-500/90',
    iconColor: 'text-white',
  },
  warning: {
    icon: '!',
    bgColor: 'bg-yellow-500/90',
    iconColor: 'text-white',
  },
};

// ============================================================================
// 组件
// ============================================================================

export default function Toast({ id, type, message, onClose }: ToastProps) {
  const config = TOAST_CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl min-w-[300px] max-w-[400px]",
        "border border-white/20",
        config.bgColor
      )}
    >
      {/* 图标 */}
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
          config.iconColor
        )}
      >
        {config.icon}
      </div>

      {/* 消息内容 */}
      <p className="flex-1 text-white text-sm font-medium leading-snug">
        {message}
      </p>

      {/* 关闭按钮 */}
      {onClose && (
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label="关闭"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

// ============================================================================
// 子组件: Toast 容器（用于独立使用）
// ============================================================================

export function ToastContainer({ toasts }: { toasts: Array<ToastProps> }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
