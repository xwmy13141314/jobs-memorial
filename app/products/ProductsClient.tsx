'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import productsData from '@/data/products.json';

interface Product {
  id: string;
  name: string;
  year: number;
  category: string;
  description: string;
  images: string[];
  significance: string;
  tags: string[];
}

// 图片尺寸配置（基于实际图片尺寸优化）
const imageSizes: Record<string, { width: number; height: number }> = {
  'apple-ii': { width: 800, height: 534 },
  'macintosh': { width: 600, height: 513 },
  'imac': { width: 800, height: 746 },
  'ipod': { width: 653, height: 466 },
  'iphone': { width: 1000, height: 1000 },
  'ipad': { width: 800, height: 450 },
  'macbook-air': { width: 892, height: 820 },
  'airpods': { width: 900, height: 525 },
  'apple-watch': { width: 600, height: 315 },
  'homepod': { width: 470, height: 556 },
};

// 获取产品图片
function getProductImage(product: Product): string {
  return product.images?.[0] || '/images/placeholder.svg';
}

// 获取图片尺寸
function getImageSize(productId: string): { width: number; height: number } {
  return imageSizes[productId] || { width: 800, height: 600 };
}

// 产品链接配置
const productLinks: Record<string, { wiki: string; official: string }> = {
  'apple-ii': {
    wiki: 'https://zh.wikipedia.org/wiki/Apple_II',
    official: 'https://www.apple.com/'
  },
  'macintosh': {
    wiki: 'https://zh.wikipedia.org/wiki/Macintosh',
    official: 'https://www.apple.com/mac/'
  },
  'imac': {
    wiki: 'https://zh.wikipedia.org/wiki/IMac',
    official: 'https://www.apple.com/imac'
  },
  'ipod': {
    wiki: 'https://zh.wikipedia.org/wiki/IPod',
    official: 'https://www.apple.com/ipod'
  },
  'iphone': {
    wiki: 'https://zh.wikipedia.org/wiki/IPhone',
    official: 'https://www.apple.com/iphone'
  },
  'ipad': {
    wiki: 'https://zh.wikipedia.org/wiki/IPad',
    official: 'https://www.apple.com/ipad'
  },
  'macbook-air': {
    wiki: 'https://zh.wikipedia.org/wiki/MacBook_Air',
    official: 'https://www.apple.com/macbook-air'
  },
  'airpods': {
    wiki: 'https://zh.wikipedia.org/wiki/AirPods',
    official: 'https://www.apple.com/airpods'
  },
  'apple-watch': {
    wiki: 'https://zh.wikipedia.org/wiki/Apple_Watch',
    official: 'https://www.apple.com/watch'
  },
  'homepod': {
    wiki: 'https://zh.wikipedia.org/wiki/HomePod',
    official: 'https://www.apple.com/homepod'
  }
};

// 获取产品链接
function getProductLinks(productId: string) {
  return productLinks[productId] || { wiki: '#', official: 'https://www.apple.com' };
}

const categories = ['全部', '电脑', '手机', '音乐', '平板', '配件'];

export default function ProductsClient() {
  const products = productsData.products as Product[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 按年份降序排序并筛选
  const filteredProducts = products
    .filter(p => selectedCategory === '全部' || p.category === selectedCategory)
    .sort((a, b) => b.year - a.year);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [filteredProducts.length]);

  const currentProduct = filteredProducts[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="min-h-[32vh] flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            伟大产品
          </h1>
          <p className="text-xl text-gray-300">
            探索史蒂夫·乔布斯创造的改变世界的产品
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Carousel */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentProduct && (
            <div className="max-w-4xl mx-auto relative">
              {/* Left Arrow Button - 隐藏在手机端 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide((currentIndex - 1 + filteredProducts.length) % filteredProducts.length);
                }}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-20 w-14 h-14 bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl rounded-full items-center justify-center transition-all duration-300 group"
                aria-label="上一个产品"
                style={{ marginTop: '-8rem' }}
              >
                <svg
                  className="w-9 h-9 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Main Product Card */}
              <div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
                onClick={() => openModal(currentProduct)}
              >
                {/* Product Image */}
                <div className="h-72 sm:h-80 md:h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden relative">
                  <Image
                    src={getProductImage(currentProduct)}
                    alt={currentProduct.name}
                    width={getImageSize(currentProduct.id).width}
                    height={getImageSize(currentProduct.id).height}
                    className="h-full w-full object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold">
                    {currentProduct.year}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {currentProduct.category}
                    </span>
                    {currentProduct.tags.includes('革命性') && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                        革命性
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {currentProduct.name}
                  </h2>

                  <p className="text-gray-600 text-lg mb-4">
                    {currentProduct.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentProduct.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                    查看详情 →
                  </button>
                </div>
              </div>

              {/* Right Arrow Button - 隐藏在手机端 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide((currentIndex + 1) % filteredProducts.length);
                }}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20 w-14 h-14 bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl rounded-full items-center justify-center transition-all duration-300 group"
                aria-label="下一个产品"
                style={{ marginTop: '-8rem' }}
              >
                <svg
                  className="w-9 h-9 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Product Counter */}
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-md">
                  <span className="text-sm text-gray-600">
                    {currentIndex + 1} / {filteredProducts.length}
                  </span>
                </div>
              </div>

              {/* Mobile Navigation Buttons - 只在手机端显示 */}
              <div className="md:hidden flex justify-center gap-4 mt-6">
                <button
                  onClick={() => goToSlide((currentIndex - 1 + filteredProducts.length) % filteredProducts.length)}
                  className="flex-1 max-w-[180px] py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  上一个
                </button>
                <button
                  onClick={() => goToSlide((currentIndex + 1) % filteredProducts.length)}
                  className="flex-1 max-w-[180px] py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  下一个
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2 inline-block">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-500">{selectedProduct.year}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div className="h-52 sm:h-56 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden mb-6">
                <Image
                  src={getProductImage(selectedProduct)}
                  alt={selectedProduct.name}
                  width={getImageSize(selectedProduct.id).width}
                  height={getImageSize(selectedProduct.id).height}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">产品描述</h3>
                <p className="text-gray-700">{selectedProduct.description}</p>
              </div>

              {/* Significance */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">历史意义</h3>
                <p className="text-gray-700">{selectedProduct.significance}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProduct.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3">
                <a
                  href={getProductLinks(selectedProduct.id).wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  了解更多
                </a>
                <a
                  href={getProductLinks(selectedProduct.id).official}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  官方网站
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
