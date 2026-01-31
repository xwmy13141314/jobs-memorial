'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);

  // 记录访问并获取统计数据
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // 检查是否已经记录过本次访问
        const sessionKey = 'visit_recorded';
        const recorded = sessionStorage.getItem(sessionKey);

        if (!recorded) {
          // 首次访问，调用 POST 记录
          await fetch('/api/visit', { method: 'POST' });
          sessionStorage.setItem(sessionKey, 'true');
        }

        // 获取最新统计数据
        const response = await fetch('/api/visit');
        const data = await response.json();
        setVisitCount(data.total);
      } catch (error) {
        console.error('获取访问统计失败:', error);
      }
    };

    trackVisit();
  }, []);

  return (
    <footer className='bg-gray-50 border-t border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Brand */}
          <div>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              <span className='text-gray-600'>史蒂夫·</span>乔布斯
            </h3>
            <p className='text-gray-600 text-sm leading-relaxed'>
              致敬史蒂夫·乔布斯（1955-2011）——Apple 公司联合创始人，改变世界的创新者。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider'>
              快速链接
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='text-gray-600 hover:text-gray-900 text-sm transition-colors'>
                  首页
                </Link>
              </li>
              <li>
                <Link href='/timeline' className='text-gray-600 hover:text-gray-900 text-sm transition-colors'>
                  生平
                </Link>
              </li>
              <li>
                <Link href='/design' className='text-gray-600 hover:text-gray-900 text-sm transition-colors'>
                  设计
                </Link>
              </li>
              <li>
                <Link href='/products' className='text-gray-600 hover:text-gray-900 text-sm transition-colors'>
                  产品
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Social */}
          <div>
            <h4 className='text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider'>
              更多
            </h4>
            <ul className='space-y-2 mb-4'>
              <li>
                <Link href='/quotes' className='text-gray-600 hover:text-gray-900 text-sm transition-colors'>
                  语录
                </Link>
              </li>
              <li>
                <Link href='/resources' className='text-gray-600 hover:text-gray-900 text-sm transition-colors'>
                  资源
                </Link>
              </li>
              <li>
                <a
                  href='https://github.com/yunshu0909/steve-jobs-tribute'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 text-sm transition-colors flex items-center gap-1'
                >
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path fillRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' clipRule='evenodd' />
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider'>
              联系方式
            </h4>
            <img
              src='/wechat-qr.png'
              alt='微信二维码'
              className='w-44 h-44'
              width={176}
              height={176}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-gray-200'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-4 text-gray-600 text-sm'>
              <span>© {currentYear} 史蒂夫·乔布斯纪念. 保留所有权利.</span>
              {visitCount !== null && (
                <span className='flex items-center gap-1 text-gray-500'>
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  <span className='font-medium'>{visitCount.toLocaleString()}</span> 次访问
                </span>
              )}
            </div>
            <div className='text-gray-500 text-sm italic text-center md:text-right'>
              "Stay hungry, stay foolish."
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
