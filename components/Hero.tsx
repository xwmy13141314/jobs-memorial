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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
        style={{
          transform: 'translate(' + mousePosition.x + 'px, ' + mousePosition.y + 'px)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        <svg className="w-[500px] h-[500px] md:w-[700px] md:h-[700px]" viewBox="0 0 200 200" fill="white">
          <ellipse cx="100" cy="70" rx="35" ry="42" fill="currentColor" opacity="0.9" />
          <circle cx="80" cy="65" r="18" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8" />
          <circle cx="120" cy="65" r="18" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8" />
          <line x1="98" y1="65" x2="102" y2="65" stroke="currentColor" strokeWidth="3" opacity="0.8" />
          <path d="M 65 112 Q 100 105 135 112 L 140 180 Q 100 185 60 180 Z" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ top: '10%', left: '5%', transform: 'translateY(' + (scrollY * 0.15) + 'px)' }}
      />
      <div
        className="absolute w-80 h-80 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-15 animate-pulse"
        style={{ animationDelay: '1s', top: '60%', right: '10%', transform: 'translateY(' + (scrollY * -0.12) + 'px)' }}
      />
      <div
        className="absolute w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: '2s', bottom: '15%', left: '20%', transform: 'translateY(' + (scrollY * 0.08) + 'px)' }}
      />

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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}

