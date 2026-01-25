'use client';

import { useState } from 'react';
import resourcesData from '@/data/resources.json';

interface Resource {
  id: string;
  type: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  links: {
    purchase: string;
    official: string;
  };
}

const resourceTypes = ['全部', '书籍', '纪录片', '电影', '演讲', '文章'];

function getResourceIcon(type: string): string {
  const icons: Record<string, string> = {
    '书籍': '📚',
    '纪录片': '🎬',
    '电影': '🎥',
    '演讲': '🎤',
    '文章': '📝',
  };
  return icons[type] || '📄';
}

export default function ResourcesClient() {
  const resources = resourcesData.resources as Resource[];
  const [selectedType, setSelectedType] = useState('全部');
  const [sortByRating, setSortByRating] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // 筛选和排序
  const filteredResources = resources
    .filter(r => selectedType === '全部' || r.type === selectedType)
    .sort((a, b) => sortByRating ? b.rating - a.rating : 0);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="min-h-[32vh] flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            推荐资源
          </h1>
          <p className="text-xl text-gray-300">
            深入了解史蒂夫·乔布斯的相关书籍、纪录片和演讲
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 mr-2">筛选:</span>
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortByRating(!sortByRating)}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                sortByRating
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 4l4-4m0 0l-4 4m4-4v12" />
              </svg>
              按评分排序
            </button>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
              >
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={resource.cover.replace('.jpg', '.svg')}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-medium">
                    {resource.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title & Author */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{resource.author}</p>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(resource.rating)}
                    <span className="text-sm text-gray-500">({resource.rating}/5)</span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center text-green-600 font-medium text-sm">
                    查看详情 →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedResource(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-2 inline-block">
                    {selectedResource.type}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {selectedResource.title}
                  </h2>
                  <p className="text-gray-600">{selectedResource.author}</p>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cover */}
              <div className="h-56 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                <img
                  src={selectedResource.cover.replace('.jpg', '.svg')}
                  alt={selectedResource.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">评分:</span>
                {renderStars(selectedResource.rating)}
                <span className="text-gray-600">({selectedResource.rating}/5)</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">简介</h3>
                <p className="text-gray-700 leading-relaxed">{selectedResource.description}</p>
              </div>

              {/* Links */}
              <div className="flex gap-3">
                {selectedResource.links.purchase && (
                  <a
                    href={selectedResource.links.purchase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-center hover:bg-green-700 transition-colors"
                  >
                    📖 购买链接
                  </a>
                )}
                {selectedResource.links.official && (
                  <a
                    href={selectedResource.links.official}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
                  >
                    🌐 官网链接
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
