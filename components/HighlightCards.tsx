import Link from 'next/link';
import Image from 'next/image';

interface Highlight {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface HighlightCardsProps {
  highlights: Highlight[];
}

// 图片路径映射
const highlightImages: Record<string, string> = {
  'timeline': '/images/highlights/timeline.png',
  'design': '/images/highlights/design.png',
  'products': '/images/highlights/products.png',
  'quotes': '/images/highlights/quotes.png',
};

// 图片尺寸配置 (原始尺寸 2752x1536，按比例缩小)
const imageSizes: Record<string, { width: number; height: number }> = {
  'timeline': { width: 800, height: 446 },
  'design': { width: 800, height: 446 },
  'products': { width: 800, height: 446 },
  'quotes': { width: 800, height: 446 },
};

function getGradientForIndex(index: number): string {
  const gradients = [
    'from-blue-400 to-purple-500',
    'from-purple-400 to-pink-500',
    'from-pink-400 to-red-500',
    'from-indigo-400 to-blue-500',
  ];
  return gradients[index % gradients.length];
}

export default function HighlightCards({ highlights }: HighlightCardsProps) {
  return (
    <section id="highlights" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            开始探索
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            核心亮点
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            探索史蒂夫·乔布斯的人生轨迹、设计哲学和伟大成就
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {highlights.map((highlight, index) => {
            const imgSrc = highlightImages[highlight.id];
            const size = imageSizes[highlight.id] || { width: 800, height: 446 };

            return (
              <Link
                key={highlight.id}
                href={highlight.link}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
              >
                {/* 使用实际图片替代emoji图标 */}
                <div className={"relative h-56 sm:h-60 md:h-64 bg-gradient-to-br " + getGradientForIndex(index) + " overflow-hidden"}>
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={highlight.title}
                      width={size.width}
                      height={size.height}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      priority={index < 2}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-7xl relative z-10 transform group-hover:scale-125 group-hover:rotate-3 transition-all duration-500">
                        {getIconForHighlight(highlight.id)}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {highlight.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    <span>了解更多</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getIconForHighlight(id: string): string {
  const icons: Record<string, string> = {
    timeline: '📅',
    design: '💡',
    products: '📱',
    quotes: '💬',
  };
  return icons[id] || '✨';
}
