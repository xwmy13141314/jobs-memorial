import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-50 border-t border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
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
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-gray-200'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            {/* Copyright */}
            <div className='text-gray-600 text-sm'>
              © {currentYear} 史蒂夫·乔布斯纪念. 保留所有权利.
            </div>

            {/* Quote */}
            <div className='text-gray-500 text-sm italic text-center md:text-right'>
              "Stay hungry, stay foolish."
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
