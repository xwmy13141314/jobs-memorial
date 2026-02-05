/**
 * Toast 工具函数
 * 可在组件外部使用，需要先初始化
 */

import type { ToastType } from './Toast';

let showToast: ((type: ToastType, message: string, duration?: number) => void) | null = null;

/**
 * 初始化 toast 函数（由 ToastProvider 调用）
 */
export function initToast(fn: (type: ToastType, message: string, duration?: number) => void) {
  showToast = fn;
}

/**
 * Toast 工具对象
 */
export const toast = {
  success: (message: string, duration?: number) => {
    showToast?.('success', message, duration);
  },
  error: (message: string, duration?: number) => {
    showToast?.('error', message, duration);
  },
  info: (message: string, duration?: number) => {
    showToast?.('info', message, duration);
  },
  warning: (message: string, duration?: number) => {
    showToast?.('warning', message, duration);
  },
};
