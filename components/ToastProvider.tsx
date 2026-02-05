/**
 * ToastProvider - 全局 Toast 上下文和容器
 * 提供 useToast hook 来在任意位置显示提示
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastType } from './Toast';

// ============================================================================
// 类型定义
// ============================================================================

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

// ============================================================================
// Provider 组件
// ============================================================================

interface ToastProviderProps {
  children: ReactNode;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  defaultDuration = 3000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  /**
   * 显示 Toast
   */
  const toast = useCallback((type: ToastType, message: string, duration = defaultDuration) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast: ToastItem = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, [defaultDuration]);

  /**
   * 便捷方法
   */
  const success = useCallback(
    (message: string, duration?: number) => toast('success', message, duration),
    [toast]
  );

  const error = useCallback(
    (message: string, duration?: number) => toast('error', message, duration),
    [toast]
  );

  const info = useCallback(
    (message: string, duration?: number) => toast('info', message, duration),
    [toast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => toast('warning', message, duration),
    [toast]
  );

  const value: ToastContextValue = {
    toast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast 容器 */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] space-y-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toastItem) => (
            <div key={toastItem.id} className="pointer-events-auto">
              <Toast
                {...toastItem}
                onClose={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toastItem.id))
                }
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export const useToast = () => useContext(ToastContext);

// ============================================================================
// 默认导出（用于独立使用）
// ============================================================================

/**
 * 导出 toast 工具对象（可以在组件外使用）
 * 注意：需要在 ToastProvider 包裹的组件树中使用
 */
export { toast } from './toast-utils';
