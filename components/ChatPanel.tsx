/**
 * ChatPanel - AI 对话面板组件
 * 玻璃拟态风格，支持预设问题、打字机效果
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { PRESET_QUESTIONS } from '@/lib/ai';

// ============================================================================
// 类型定义
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (content: string, presetId?: string) => void;
  onClearChat: () => void;
  onClose: () => void;
}

// ============================================================================
// 组件
// ============================================================================

export default function ChatPanel({
  messages,
  isTyping,
  onSendMessage,
  onClearChat,
  onClose,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 处理发送
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim(), selectedPreset || undefined);
      setInput('');
      setSelectedPreset(null);
    }
  };

  // 处理预设问题点击
  const handlePresetClick = (preset: typeof PRESET_QUESTIONS[0]) => {
    setInput(preset.question);
    setSelectedPreset(preset.id);
    textareaRef.current?.focus();
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed top-1/2 right-24 -translate-y-1/2 max-w-[calc(100vw-7rem)] max-h-[80vh] sm:max-w-[400px] sm:max-h-[550px] bg-black/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col z-50"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Ask Steve</h3>
            <p className="text-white/50 text-xs">Think Different</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* 清空按钮 */}
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="清空对话"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[300px]">
        {messages.length === 0 ? (
          // 初始状态 - 显示预设问题
          <div className="space-y-3">
            <p className="text-white/60 text-sm text-center">
              在荒野中也要保持优雅和品味
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_QUESTIONS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors"
                >
                  <div className="text-white text-xs font-medium">{preset.label}</div>
                  <div className="text-white/50 text-[10px] mt-0.5 truncate">
                    {preset.question}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // 消息列表
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* 正在输入 */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex-shrink-0" />
                <div className="px-3 py-2 bg-white/10 rounded-2xl rounded-tl-none">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            rows={1}
            className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm placeholder-white/40 resize-none outline-none transition-colors"
            style={{ minHeight: '36px', maxHeight: '100px' }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* 预设标签 - 快速选择 */}
        {messages.length > 0 && (
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1 scrollbar-hide">
            {PRESET_QUESTIONS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white text-[10px] whitespace-nowrap transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// 子组件: 消息气泡
// ============================================================================

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* 头像 */}
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-700'
            : 'bg-gradient-to-br from-gray-700 to-gray-900'
        }`}
      >
        {isUser ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        )}
      </div>

      {/* 消息内容 */}
      <div
        className={`px-3 py-2 rounded-2xl max-w-[280px] ${
          isUser
            ? 'bg-blue-600 rounded-tr-none text-white'
            : 'bg-white/10 rounded-tl-none text-white'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

        {/* 分享按钮 (仅 AI 消息) */}
        {!isUser && message.content.length > 20 && (
          <button
            onClick={() => shareQuote(message.content)}
            className="mt-2 flex items-center gap-1 text-white/40 hover:text-white/60 text-[10px] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享金句
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// 子组件: 打字指示器
// ============================================================================

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-white/60 rounded-full"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 辅助函数: 分享金句
// ============================================================================

function shareQuote(content: string) {
  // 提取金句
  const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
  const quote = sentences[0]?.trim() || content.slice(0, 100);

  // 复制到剪贴板
  navigator.clipboard.writeText(`"${quote}" — Steve Jobs`);

  // 显示提示
  alert('金句已复制到剪贴板！');
}
