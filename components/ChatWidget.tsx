/**
 * ChatWidget - 悬浮 AI 对话组件
 * "Think Different" Portal
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatPanel from './ChatPanel';

// ============================================================================
// 类型定义
// ============================================================================

interface ChatWidgetProps {
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ============================================================================
// 组件
// ============================================================================

export default function ChatWidget({ className = '' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 处理发送消息
  const handleSendMessage = async (content: string, presetId?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          presetId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '发送失败');
      }

      // 流式读取响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应');
      }

      let assistantContent = '';
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

          const data = trimmedLine.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            // 智谱 AI 格式: choices[0].delta.content
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content;
              assistantContent += content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: assistantContent }
                    : msg
                )
              );
            }
            // 兼容其他格式
            else if (parsed.content) {
              assistantContent += parsed.content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: assistantContent }
                    : msg
                )
              );
            }
          } catch (e) {
            // 忽略解析错误
            console.debug('解析 SSE 数据失败:', e);
          }
        }
      }

    } catch (error) {
      console.error('发送消息失败:', error);

      // 添加错误提示消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答。请稍后再试。',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 清空对话
  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div ref={widgetRef} className={`fixed md:top-1/2 md:right-4 md:-translate-y-1/2 bottom-20 right-4 md:bottom-auto z-50 ${className}`}>
      {/* 悬浮按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-20 h-20 rounded-full backdrop-blur-md border shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden ${isOpen ? 'bg-black/90 border-white/20' : 'bg-white/10 border-white/30'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? '0 0 0 0 rgba(0, 0, 0, 0)'
            : isHovered
            ? '0 0 25px rgba(255, 255, 255, 0.4)'
            : '0 0 15px rgba(255, 255, 255, 0.2)',
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {/* 图标 - Steve Jobs 卡通形象 */}
        {isOpen ? (
          // 关闭图标
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Steve Jobs 卡通图片
          <img
            src="/steve-icon.png"
            alt="Steve Jobs"
            className="w-12 h-12 object-cover rounded-full"
          />
        )}

        {/* 呼吸动画效果 */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 提示文字 - 常驻显示 */}
        {!isOpen && (
          <div className="absolute -left-36 top-1/2 -translate-y-1/2 whitespace-nowrap">
            <motion.div
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium shadow-lg"
            >
              💬 和乔布斯对话
            </motion.div>
            {/* 小箭头 */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/20"></div>
          </div>
        )}
      </motion.button>

      {/* 对话面板 */}
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
