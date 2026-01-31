import { Metadata } from 'next';
import VisitStats from './VisitStats';

export const metadata: Metadata = {
  title: '关于本站 - 史蒂夫·乔布斯致敬网站',
  description: '这是一个致敬史蒂夫·乔布斯的个人网站，旨在记录和分享他的生平、产品、名言和设计理念。',
  keywords: '史蒂夫·乔布斯, 关于, 网站介绍, 联系方式',
  openGraph: {
    title: '关于本站 - 史蒂夫·乔布斯致敬网站',
    description: '致敬乔布斯，记录他的创新精神与设计理念',
    type: 'website',
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <section className="min-h-[32vh] flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            关于本站
          </h1>
          <p className="text-xl text-gray-300">
            致敬史蒂夫·乔布斯的创新精神与设计理念
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission Statement */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4"></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                我们的使命
              </h2>
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-700 italic text-center leading-relaxed border-l-4 border-indigo-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
              &quot;致敬史蒂夫·乔布斯，记录他的创新精神与设计理念，激励更多人追求卓越、改变世界。&quot;
            </blockquote>
          </div>

          {/* Website Purpose */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              网站宗旨
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                这是一个非商业性的个人致敬网站，旨在全面记录史蒂夫·乔布斯的生平事迹、伟大产品、经典名言和设计理念。
              </p>
              <p>
                通过整理和展示乔布斯的创新思维与产品哲学，希望：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>让更多人了解乔布斯的创新精神和设计理念</li>
                <li>为创业者和产品设计师提供灵感和参考</li>
                <li>传播&quot;Think Different&quot的思维模式</li>
                <li>激励更多人追求卓越，改变世界</li>
              </ul>
            </div>
          </div>

          {/* Website Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">✨</span>
              网站内容
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">📅</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">生平时间线</h4>
                  <p className="text-gray-600 text-sm">记录乔布斯一生的重要时刻与转折点</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">📱</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">伟大产品</h4>
                  <p className="text-gray-600 text-sm">展示改变世界的产品与创新</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">💬</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">经典名言</h4>
                  <p className="text-gray-600 text-sm">汇集乔布斯的智慧语录</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">📚</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">学习资源</h4>
                  <p className="text-gray-600 text-sm">推荐相关书籍、纪录片和文章</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">🎨</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">设计理念</h4>
                  <p className="text-gray-600 text-sm">深入探讨产品设计与创新哲学</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">🔍</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">搜索浏览</h4>
                  <p className="text-gray-600 text-sm">便捷的内容查找与浏览体验</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              技术实现
            </h3>
            <p className="text-gray-700 mb-4">
              本网站使用现代化技术栈构建，追求简洁、优雅的用户体验，这与乔布斯的设计理念不谋而合：
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Next.js 16</div>
                <div className="text-sm text-gray-600">React 框架</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">TypeScript</div>
                <div className="text-sm text-gray-600">类型安全</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Tailwind CSS</div>
                <div className="text-sm text-gray-600">样式框架</div>
              </div>
            </div>
          </div>

          {/* Visit Statistics */}
          <VisitStats />

          {/* Contact & Acknowledgments */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🙏</span>
              致谢与声明
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                本网站内容整理自公开资料，包括：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>沃尔特·艾萨克森所著《史蒂夫·乔布斯传》</li>
                <li>Apple 官方资料和发布会视频</li>
                <li>公开访谈和演讲记录</li>
                <li>各类新闻报道和纪录片</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                本网站仅供学习交流使用，非官方授权。如有侵权或不当内容，请联系删除。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            &quot;Stay hungry, stay foolish&quot;
          </h2>
          <p className="text-gray-400 mb-8">
            保持饥饿，保持愚蠢 —— 永远保持学习和创新的心态
          </p>
          <a
            href="/quotes"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
          >
            浏览经典名言 →
          </a>
        </div>
      </section>
    </div>
  );
}
