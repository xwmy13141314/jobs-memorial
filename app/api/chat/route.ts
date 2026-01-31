/**
 * AI Chat API - 处理与乔布斯人格的对话
 * 直接调用智谱 AI API
 */

import { NextRequest } from 'next/server';
import {
  checkContentSafety,
  sanitizeMessage,
  buildSystemPrompt,
  PRESET_QUESTIONS,
  type ChatMessage,
} from '@/lib/ai';
import { rateLimitCheck } from '@/lib/rate-limit';

// ============================================================================
// API 配置
// ============================================================================

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// ============================================================================
// 类型定义
// ============================================================================

interface ZhipuChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZhipuChatRequest {
  model: string;
  messages: ZhipuChatMessage[];
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

interface ZhipuChatResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

// ============================================================================
// POST 处理器
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    // 1. 解析请求
    const body = await req.json();
    const { messages, presetId } = body as {
      messages?: ChatMessage[];
      presetId?: string;
    };

    // 2. 验证请求
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'invalid_request', message: '消息格式不正确' },
        { status: 400 }
      );
    }

    // 获取最新的用户消息
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return Response.json(
        { error: 'invalid_request', message: '最后一条消息必须是用户消息' },
        { status: 400 }
      );
    }

    const userMessage = lastMessage.content;
    const userIp = req.headers.get('x-forwarded-for') ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

    // 3. 限流检查
    const rateLimitResult = await rateLimitCheck(userIp);
    if (!rateLimitResult.allowed) {
      return Response.json(
        {
          error: 'rate_limit_exceeded',
          message: rateLimitResult.message,
          resetAt: rateLimitResult.resetAt,
        },
        { status: 429 }
      );
    }

    // 4. 内容安全检查
    const safetyCheck = checkContentSafety(userMessage);
    if (!safetyCheck.safe) {
      return Response.json(
        {
          error: 'content_blocked',
          message: getBlockMessage(safetyCheck.reason || 'unknown'),
        },
        { status: 400 }
      );
    }

    // 5. 清理用户输入
    const sanitizedMessage = sanitizeMessage(userMessage);

    // 6. 获取 API Key
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'service_unavailable', message: 'AI 服务未配置' },
        { status: 503 }
      );
    }

    // 7. 构建 System Prompt
    let systemPrompt = buildSystemPrompt(sanitizedMessage);

    // 8. 构建消息列表
    let chatMessages: ZhipuChatMessage[] = [];

    if (presetId) {
      const preset = PRESET_QUESTIONS.find(p => p.id === presetId);
      if (preset) {
        systemPrompt += `\n\n[上下提示] 用户点击了预设问题："${preset.label}"，说明TA关注${preset.category}方面的问题。`;
      }
    }

    chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: sanitizedMessage },
    ];

    // 9. 调用智谱 AI API
    const requestBody: ZhipuChatRequest = {
      model: 'glm-4-flash',
      messages: chatMessages,
      temperature: 0.8,
      stream: true,
    };

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('智谱 AI API 错误:', response.status, errorText);
      return Response.json(
        {
          error: 'ai_service_error',
          message: 'AI 服务暂时不可用，请稍后再试',
        },
        { status: response.status }
      );
    }

    // 10. 返回流式响应
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    return Response.json(
      {
        error: 'internal_error',
        message: '服务暂时不可用，请稍后再试',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// 辅助函数
// ============================================================================

function getBlockMessage(reason: string): string {
  const messages: Record<string, string> = {
    contains_sensitive_word: '抱歉，这个问题我无法回答。',
    contains_ad_content: '请保持对话纯粹，避免广告引流。',
  };

  return messages[reason] || '抱歉，这条消息无法通过安全检查。';
}

// ============================================================================
// OPTIONS 处理器 (CORS)
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
