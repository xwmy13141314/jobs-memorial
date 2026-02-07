'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToHighlights = () => {
    const element = document.getElementById('highlights');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* 乔布斯经典轮廓 - 白色轮廓 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: 0.2,
          transform: 'translate(' + mousePosition.x * 0.5 + 'px, ' + mousePosition.y * 0.5 + 'px)',
          transition: 'transform 0.5s ease-out',
        }}
      >
        <svg
          className="w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
          viewBox="0 0 200 220"
          fill="white"
        >
          {/* 头部轮廓 */}
          <ellipse cx="100" cy="55" rx="38" ry="45" fill="currentColor" opacity="0.7" />

          {/* 头发 - 自然分界 */}
          <path d="M 62 55 Q 60 30 75 20 Q 100 12 125 20 Q 140 30 138 55" fill="currentColor" opacity="0.6" />
          <path d="M 75 20 Q 100 28 100 45" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none" />

          {/* 左眼镜框 - 经典圆框眼镜 */}
          <circle cx="80" cy="52" r="16" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.9" />
          <circle cx="80" cy="52" r="13" fill="currentColor" opacity="0.25" />

          {/* 右眼镜框 */}
          <circle cx="120" cy="52" r="16" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.9" />
          <circle cx="120" cy="52" r="13" fill="currentColor" opacity="0.25" />

          {/* 鼻梁架 */}
          <path d="M 96 52 Q 100 48 104 52" stroke="currentColor" strokeWidth="2.5" opacity="0.8" fill="none" />

          {/* 镜腿 */}
          <line x1="64" y1="52" x2="55" y2="50" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
          <line x1="136" y1="52" x2="145" y2="50" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />

          {/* 鼻子阴影 */}
          <path d="M 100 58 L 98 72 L 102 72 Z" fill="currentColor" opacity="0.5" />

          {/* 嘴部 */}
          <path d="M 88 80 Q 100 84 112 80" stroke="currentColor" strokeWidth="2.5" opacity="0.7" fill="none" />

          {/* 下巴轮廓 */}
          <path d="M 70 95 Q 100 102 130 95" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none" />

          {/* 脖子 */}
          <rect x="90" y="95" width="20" height="15" fill="currentColor" opacity="0.6" />

          {/* 黑色高领毛衣 - 经典造型 */}
          <path d="M 60 110 Q 100 100 140 110 L 150 190 Q 100 195 50 190 Z" fill="currentColor" opacity="0.7" />

          {/* 高领衣领线条 */}
          <path d="M 70 112 Q 100 108 130 112" stroke="white" strokeWidth="2" opacity="0.35" fill="none" />
          <path d="M 85 112 L 85 125" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <path d="M 115 112 L 115 125" stroke="white" strokeWidth="1.5" opacity="0.3" />

          {/* 肩膀轮廓 */}
          <ellipse cx="100" cy="185" rx="55" ry="15" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">史蒂夫·乔布斯</h1>
        <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light tracking-wide">1955 — 2011</p>
        <div className="mb-12">
          <p className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Think Different</p>
        </div>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">产品教父</span>
          <span className="mx-2">·</span>
          改变世界的创新者、Apple 公司联合创始人
          <br className="hidden md:block" />
          <span className="hidden md:inline mx-2"></span>
          用科技与设计重新定义了现代生活
        </p>
        <button onClick={scrollToHighlights} className="mt-20 group relative px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg overflow-hidden transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
          <span className="relative z-10 flex items-center gap-2">
            开始探索
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </section>
  );
}

