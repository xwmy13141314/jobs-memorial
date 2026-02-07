/**
 * QuotePoster - 金句海报预览和操作组件
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractQuote, generateQuotePoster, downloadImage, blobToDataUrl } from '@/lib/quote-poster';
import { useToast } from './ToastProvider';

// ============================================================================
// 类型定义
// ============================================================================

interface QuotePosterProps {
  message: string;
  onClose: () => void;
}

interface PosterPreview {
  dataUrl: string;
  blob: Blob;
}

// ============================================================================
// 组件
// ============================================================================

export function QuotePosterModal({ message, onClose }: QuotePosterProps) {
  const [preview, setPreview] = useState<PosterPreview | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  // 生成海报
  const generatePoster = useCallback(async () => {
    setIsGenerating(true);
    try {
      // 提取金句
      const quoteResult = extractQuote(message);
      const text = quoteResult?.text || message.slice(0, 100);

      // 生成海报
      const blob = await generateQuotePoster({
        text,
        author: 'Steve Jobs',
        size: 'square',
        theme: 'dark',
      });

      // 转换为 Data URL 用于预览
      const dataUrl = await blobToDataUrl(blob);

      setPreview({ dataUrl, blob });
    } catch (error) {
      console.error('生成海报失败:', error);
      toast.error('生成海报失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [message, toast]);

  // 下载图片
  const handleDownload = useCallback(() => {
    if (preview) {
      downloadImage(preview.blob, `steve-jobs-quote-${Date.now()}.png`);
      toast.success('海报已下载');
    }
  }, [preview, toast]);

  // 复制到剪贴板
  const handleCopy = useCallback(async () => {
    if (preview) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [preview.blob.type]: preview.blob,
          }),
        ]);
        toast.success('海报已复制到剪贴板');
      } catch (error) {
        console.error('复制失败:', error);
        toast.error('复制失败，请尝试下载');
      }
    }
  }, [preview, toast]);

  // 打开时自动生成
  useEffect(() => {
    generatePoster();
  }, [generatePoster]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">金句海报</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 预览区域 */}
        <div className="mb-6">
          {isGenerating ? (
            <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60 text-sm">正在生成海报...</p>
              </div>
            </div>
          ) : preview ? (
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={preview.dataUrl}
                alt="金句海报预览"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center">
              <p className="text-white/60 text-sm">生成失败</p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={!preview || isGenerating}
            className="flex-1 py-3 px-4 bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed rounded-xl font-medium text-black transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载图片
          </button>
          <button
            onClick={handleCopy}
            disabled={!preview || isGenerating}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            复制
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// 分享按钮组件
// ============================================================================

interface ShareButtonProps {
  message: string;
}

export function ShareButton({ message }: ShareButtonProps) {
  const [showPoster, setShowPoster] = useState(false);

  if (message.length < 20) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowPoster(true)}
        className="mt-2 flex items-center gap-1 text-white/40 hover:text-white/60 text-[10px] transition-colors group"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>生成海报</span>
      </button>

      <AnimatePresence>
        {showPoster && (
          <QuotePosterModal
            message={message}
            onClose={() => setShowPoster(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
