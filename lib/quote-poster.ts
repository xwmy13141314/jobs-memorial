/**
 * Quote Poster Generator - 金句海报生成器
 * 使用 html2canvas 将金句渲染为精美海报
 */

import html2canvas from 'html2canvas';

// ============================================================================
// 类型定义
// ============================================================================

export interface PosterOptions {
  text: string;
  author?: string;
  size?: 'square' | 'portrait';
  theme?: 'dark' | 'light';
}

export interface QuoteResult {
  text: string;
  startIndex: number;
  endIndex: number;
}

// ============================================================================
// 配置
// ============================================================================

const POSTER_CONFIG = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1920 },
};

const FONTS = {
  primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
};

// ============================================================================
// 金句提取算法（增强版）
// ============================================================================

/**
 * 从消息中提取最有"金句感"的句子
 */
export function extractQuote(message: string): QuoteResult | null {
  if (!message || message.length < 20) {
    return null;
  }

  // 关键词权重表
  const powerWords = [
    // 英文关键词
    'Simplicity', 'Focus', 'Great', 'Insanely', 'Art', 'Taste',
    'Design', 'Think', 'Different', 'Innovation', 'Perfect',
    // 中文关键词
    '简单', '极致', '专注', '不', '艺术', '品味',
    '设计', '创新', '完美', '平庸', '砍掉',
  ];

  // 英文引语模式
  const englishQuotePattern = /"([A-Z][^"]{20,})"/g;
  const englishQuotes = message.match(englishQuotePattern);

  // 策略1: 优先使用英文引语
  if (englishQuotes && englishQuotes.length > 0) {
    const quote = englishQuotes[0].replace(/"/g, '');
    const startIndex = message.indexOf(englishQuotes[0]);
    return {
      text: quote.trim(),
      startIndex,
      endIndex: startIndex + englishQuotes[0].length,
    };
  }

  // 策略2: 按标点分割句子
  const sentences = message
    .split(/[。！？.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  if (sentences.length === 0) {
    // 没有合适句子，取前100字符
    return {
      text: message.slice(0, 100),
      startIndex: 0,
      endIndex: Math.min(100, message.length),
    };
  }

  // 策略3: 评分系统
  let bestSentence = '';
  let maxScore = -1;

  for (const sentence of sentences) {
    let score = 0;

    // 长度分（适中的长度优先）
    const length = sentence.length;
    if (length >= 20 && length <= 80) {
      score += 30;
    } else if (length > 80) {
      score += 10;
    }

    // 关键词加分
    for (const word of powerWords) {
      if (sentence.includes(word)) {
        score += 25;
      }
    }

    // 英文内容加分
    if (/[a-zA-Z]{10,}/.test(sentence)) {
      score += 15;
    }

    // 包含数字加分（引用数据）
    if (/\d+%|\d+倍|\d+次/.test(sentence)) {
      score += 10;
    }

    // 简短有力加分
    if (length < 50) {
      score += 10;
    }

    if (score > maxScore) {
      maxScore = score;
      bestSentence = sentence;
    }
  }

  const startIndex = message.indexOf(bestSentence);

  return {
    text: bestSentence.trim(),
    startIndex,
    endIndex: startIndex + bestSentence.length,
  };
}

// ============================================================================
// 海报生成
// ============================================================================

/**
 * 创建海报 DOM 元素
 */
function createPosterElement(options: PosterOptions): HTMLElement {
  const { text, author = 'Steve Jobs', size = 'square', theme = 'dark' } = options;
  const config = POSTER_CONFIG[size];

  // 创建容器
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: ${config.width}px;
    height: ${config.height}px;
    background: ${theme === 'dark' ? '#000000' : '#FFFFFF'};
    font-family: ${FONTS.primary};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px;
    box-sizing: border-box;
  `;

  // 创建内容区域
  const content = document.createElement('div');
  content.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  `;

  // 边框装饰
  const border = document.createElement('div');
  border.style.cssText = `
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
    pointer-events: none;
  `;
  content.appendChild(border);

  // 金句内容
  const quote = document.createElement('div');
  quote.style.cssText = `
    font-size: 48px;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
    color: ${theme === 'dark' ? '#FFFFFF' : '#000000'};
    max-width: 900px;
    margin-bottom: 60px;
    font-family: ${FONTS.primary};
  `;
  quote.textContent = `"${text}"`;
  content.appendChild(quote);

  // 署名
  const signature = document.createElement('div');
  signature.style.cssText = `
    font-size: 24px;
    font-weight: 400;
    color: ${theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
    text-align: center;
  `;
  signature.textContent = `— ${author}`;
  content.appendChild(signature);

  // 水印（乔布斯剪影简化版）
  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-size: 120px;
    opacity: 0.03;
    color: ${theme === 'dark' ? '#FFFFFF' : '#000000'};
    pointer-events: none;
    user-select: none;
  `;
  watermark.textContent = '';
  content.appendChild(watermark);

  // 底部标识
  const footer = document.createElement('div');
  footer.style.cssText = `
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: ${theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
    text-align: center;
  `;
  footer.textContent = 'jobs-memorial.vercel.app';
  content.appendChild(footer);

  container.appendChild(content);
  document.body.appendChild(container);

  return container;
}

/**
 * 生成金句海报
 */
export async function generateQuotePoster(
  options: PosterOptions
): Promise<Blob> {
  // 创建 DOM 元素
  const container = createPosterElement(options);

  try {
    // 使用 html2canvas 渲染
    const canvas = await html2canvas(container, {
      scale: 2, // 2x 分辨率，保证清晰度
      backgroundColor: options.theme === 'dark' ? '#000000' : '#FFFFFF',
      logging: false,
      useCORS: true,
      allowTaint: true,
    } as any);

    // 转换为 Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } finally {
    // 清理 DOM
    document.body.removeChild(container);
  }
}

/**
 * 下载图片
 */
export function downloadImage(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `steve-jobs-quote-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 复制图片到剪贴板
 */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  try {
    // 尝试使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } else {
      throw new Error('Clipboard API not supported');
    }
  } catch (error) {
    // 降级方案：转换为 Data URL 后复制
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // 这种方式在大多数浏览器中不工作，但至少不会报错
      console.warn('Clipboard write failed, fallback not available');
    };
    reader.readAsDataURL(blob);
    throw error;
  }
}

/**
 * 将 Blob 转换为 Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
