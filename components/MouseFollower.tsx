'use client';

import { useEffect, useRef } from 'react';

export default function MouseFollower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRippleTime = useRef<number>(0);
  const rippleCooldown = 50; // 涟漪冷却时间（毫秒），避免过于频繁

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 创建涟漪元素
    const createRipple = (x: number, y: number) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';

      // 随机大小变化，增加自然感
      const size = 100 + Math.random() * 100;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      container.appendChild(ripple);

      // 动画结束后移除元素
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    };

    // 鼠标移动处理
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastRippleTime.current < rippleCooldown) return;

      lastRippleTime.current = now;
      createRipple(e.clientX, e.clientY);
    };

    // 触摸设备支持
    const handleTouchMove = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastRippleTime.current < rippleCooldown) return;

      lastRippleTime.current = now;
      const touch = e.touches[0];
      createRipple(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />
      <style jsx global>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(100, 150, 255, 0.3) 0%,
            rgba(150, 100, 255, 0.2) 30%,
            rgba(200, 150, 255, 0.1) 60%,
            transparent 70%
          );
          pointer-events: none;
          animation: rippleEffect 1.2s ease-out forwards;
          transform: scale(0);
        }

        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
