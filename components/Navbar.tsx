'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '首页', href: '/' },
    { name: '生平', href: '/timeline' },
    { name: '设计', href: '/design' },
    { name: '产品', href: '/products' },
    { name: '语录', href: '/quotes' },
    { name: '资源', href: '/resources' },
    { name: '关于', href: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 shadow-sm' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Link href="/" className="flex items-center group">
            <div className={`text-xl font-bold transition-colors ${isScrolled || isOpen ? 'text-gray-900' : 'text-white'}`}>
              <span className={`${isScrolled || isOpen ? 'text-gray-600' : 'text-gray-300'} group-hover:text-current`}>史蒂夫·</span>乔布斯
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-200 hover:text-white'}`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://github.com/yunshu0909/steve-jobs-tribute"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-200 hover:text-white'}`}
            >
              GitHub
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors ${isScrolled || isOpen ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'}`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://github.com/yunshu0909/steve-jobs-tribute"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
