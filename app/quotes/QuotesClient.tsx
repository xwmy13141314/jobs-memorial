'use client';

import { useState, useEffect } from 'react';
import quotesData from '@/data/quotes.json';

interface Quote {
  cn: string;
  en: string;
  source: string;
  year: string;
}

// 根据名言索引获取对应的图片
function getQuoteImage(quoteIndex: number): string {
  const imageNum = (quoteIndex % 20) + 1;
  return `/images/quotes/quote-${String(imageNum).padStart(2, '0')}.svg`;
}

export default function QuotesClient() {
  const quotes = quotesData.quotes as Quote[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentQuote = quotes[currentIndex];

  // 随机切换语录
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
  };

  // 自动切换（10秒）
  useEffect(() => {
    const timer = setInterval(() => {
      getRandomQuote();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 复制功能
  const handleCopy = async () => {
    const text = `${currentQuote.cn}\n\n${currentQuote.en}\n— 史蒂夫·乔布斯 ${currentQuote.year}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 分享功能
  const handleShare = () => {
    const text = `"${currentQuote.cn}" — 史蒂夫·乔布斯`;
    const url = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-32">
        <div className="max-w-4xl w-full text-center">
          {/* Quote Content */}
          <div className="mb-12">
            {/* Quote Image with Navigation */}
            <div className="mb-8 relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Left Navigation Button */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all flex items-center justify-center group"
                aria-label="上一条"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Quote Image */}
              <img
                src={getQuoteImage(currentIndex)}
                alt={currentQuote.cn}
                className="w-full h-auto"
              />

              {/* Right Navigation Button */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % quotes.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all flex items-center justify-center group"
                aria-label="下一条"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Quote Counter Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                {currentIndex + 1} / {quotes.length}
              </div>
            </div>

            {/* English Quote */}
            <p className="text-2xl md:text-4xl font-light text-gray-400 italic mb-8 font-serif">
              "{currentQuote.en}"
            </p>

            {/* Chinese Quote */}
            <p className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              "{currentQuote.cn}"
            </p>

            {/* Source */}
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>—</span>
              <span className="font-medium">史蒂夫·乔布斯</span>
              <span className="text-gray-500">{currentQuote.year}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">{currentQuote.source}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            {/* Random Button */}
            <button
              onClick={getRandomQuote}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
            >
              🔄 随机切换
            </button>

            {/* Secondary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2zm0 0V2a2 2 0 012 2h6a2 2 0 012-2V9a2 2 0 012-2zm0 0V2a2 2 0 012 2h6a2 2 0 012-2V9a2 2 0 01-2-2zm0 0V2a2 2 0 012 2h6a2 2 0 012-2V9a2 2 0 01-2-2z"
                  />
                </svg>
                {copied ? '已复制!' : '复制'}
              </button>

              {/* Poster Button */}
              <button
                onClick={() => alert('海报生成功能开发中...')}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                海报
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632 3.16m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                分享
              </button>
            </div>
          </div>

          {/* Quote Counter */}
          <div className="mt-16 text-gray-500 text-sm">
            共 {quotes.length} 条语录
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
