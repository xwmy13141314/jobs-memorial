'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 临时文章列表（后续可以从文件系统读取）
const articles = [
  {
    id: 'think-different',
    title: 'Think Different：乔布斯的核心设计哲学',
    summary: 'Think Different 不仅仅是一句广告语，它代表了乔布斯的核心价值观和设计哲学。',
    date: '2025-01-24',
    tags: ['哲学', '创新', '设计'],
    image: '💡'
  },
  {
    id: 'simplicity',
    title: '简约至上：Apple 的设计原则',
    summary: '简单是终极的复杂。乔布斯相信简约是设计的最高境界。',
    date: '2025-01-24',
    tags: ['设计', '简约'],
    image: '✨'
  },
  {
    id: 'user-experience',
    title: '用户体验为王：从用户角度出发',
    summary: '设计不仅仅是它看起来是什么，它是如何工作。',
    date: '2025-01-24',
    tags: ['体验', '用户'],
    image: '👤'
  },
  {
    id: 'attention-to-detail',
    title: '注重细节：完美主义的体现',
    summary: '细节很重要，值得等待值得做好。乔布斯的完美主义。',
    date: '2025-01-24',
    tags: ['细节', '完美'],
    image: '🎯'
  },
  {
    id: 'innovation',
    title: '创新思维：挑战现状',
    summary: '领袖和跟风者的区别就在于创新。',
    date: '2025-01-24',
    tags: ['创新', '思维'],
    image: '💡'
  },
  {
    id: 'product-first',
    title: '产品至上：打造伟大产品',
    summary: '专注产品，而不是营销。让产品自己说话。',
    date: '2025-01-24',
    tags: ['产品', '专注'],
    image: '📱'
  },
  {
    id: 'design-driven',
    title: '设计驱动：设计不仅是外观',
    summary: '设计是产品功能的核心，而不仅仅是装饰。',
    date: '2025-01-24',
    tags: ['设计', '驱动'],
    image: '🎨'
  },
  {
    id: 'perfectionism',
    title: '完美主义：追求卓越',
    summary: '不满足于"足够好"，只追求"最好的"。',
    date: '2025-01-24',
    tags: ['完美', '卓越'],
    image: '⭐'
  },
  {
    id: 'minimalism',
    title: '极简之美：少即是多',
    summary: '去除一切不必要的元素，只保留核心功能。',
    date: '2025-01-24',
    tags: ['极简', '美学'],
    image: '🎨'
  },
  {
    id: 'change-world',
    title: '改变世界：使命感驱动',
    summary: '我们在这里是为了在宇宙中留下痕迹。',
    date: '2025-01-24',
    tags: ['使命', '愿景'],
    image: '🌍'
  }
];

// 解析 Markdown frontmatter 和内容
function parseMarkdown(content: string) {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterLines = match[1].split('\n');
  const frontmatter: any = {};

  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value: string | string[] = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Parse arrays
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/['"]/g, ''));
      }
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: match[2] };
}

// 将 Markdown 转换为 HTML（简化版）
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-8">$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-800 mb-3 mt-6">$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-800 mb-2 mt-4">$1</h3>');

  // Blockquotes
  html = html.replace(/^> "(.+)" —— (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 italic"><span class="text-gray-700">$1</span><br/><span class="text-sm text-gray-500">—— $2</span></blockquote>');
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-700">$1</blockquote>');

  // Bold and Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code
  html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 my-1">$1</li>');
  html = html.replace(/(<li.+<\/li>\n?)+/g, '<ul class="list-disc my-4 ml-6">$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 my-1">$1</li>');

  // Tables
  const tableRegex = /\|(.+)\|\n\|[-|\s]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, body) => {
    const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th class="border border-gray-300 px-4 py-2 bg-gray-100">${h.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="border border-gray-300 px-4 py-2">${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse">${headers}${rows}</table></div>`;
  });

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-200" />');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="my-4 leading-relaxed text-gray-700">');
  html = `<p class="my-4 leading-relaxed text-gray-700">${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p class="[^"]*"><\/p>/g, '');
  html = html.replace(/<p class="my-4 leading-relaxed text-gray-700">(<(h[1-3]|ul|blockquote|hr|div))/g, '$1');

  return html;
}

export default function Design() {
  const [selectedId, setSelectedId] = useState<string | null>('think-different');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articleContent, setArticleContent] = useState<string>('');

  const selectedArticle = articles.find(a => a.id === selectedId) || articles[0];

  // 获取文章内容
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/design?id=${selectedId}`);
        if (response.ok) {
          const data = await response.json();
          const { frontmatter, content } = parseMarkdown(data.content);
          setArticleContent(markdownToHtml(content));
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
    };

    fetchArticle();
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            设计理念
          </h1>
          <p className="text-xl text-gray-300">
            学习史蒂夫·乔布斯的产品设计哲学与思维方法
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  文章目录
                </h2>
                <nav className="space-y-1">
                  {articles.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedId(article.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedId === article.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-gray-400 mr-2">{String(index + 1).padStart(2, '0')}.</span>
                      {article.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow"
              >
                <span className="font-medium text-gray-900">文章目录</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="mt-2 bg-white rounded-lg shadow p-2">
                  {articles.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => {
                        setSelectedId(article.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedId === article.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                        {String(index + 1).padStart(2, '0')}. {article.title}
                      </button>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="flex-1">
              <article className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                {/* Article Header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="text-6xl mb-4">{selectedArticle.image}</div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {selectedArticle.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span>发布于 {selectedArticle.date}</span>
                    <span>•</span>
                    <div className="flex gap-2">
                      {selectedArticle.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Article Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 italic">
                    {selectedArticle.summary}
                  </p>
                </div>

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                />

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => {
                      const currentIndex = articles.findIndex(a => a.id === selectedId);
                      if (currentIndex > 0) {
                        setSelectedId(articles[currentIndex - 1].id);
                      }
                    }}
                    disabled={articles.findIndex(a => a.id === selectedId) === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← 上一篇
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = articles.findIndex(a => a.id === selectedId);
                      if (currentIndex < articles.length - 1) {
                        setSelectedId(articles[currentIndex + 1].id);
                      }
                    }}
                    disabled={articles.findIndex(a => a.id === selectedId) === articles.length - 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一篇 →
                  </button>
                </div>

                {/* Share Button */}
                <div className="mt-4">
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    分享这篇文章
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
