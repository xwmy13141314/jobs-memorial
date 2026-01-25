'use client';

import { useState } from 'react';
import Image from 'next/image';
import timelineData from '@/data/timeline.json';

interface Event {
  id: string;
  year: string;
  title: string;
  description: string;
  detailedDescription?: string;
  image: string;
  isKeyEvent: boolean;
  tags: string[];
}

// 时间线事件图片尺寸配置
const timelineImageSizes: Record<string, { width: number; height: number }> = {
  '1955-birth': { width: 444, height: 369 },
  '1976-apple-founded': { width: 496, height: 286 },
  '1977-apple-ii': { width: 1024, height: 640 },
  '1980-ipo': { width: 704, height: 624 },
  '1984-mac': { width: 1200, height: 800 },
  '1985-leave': { width: 800, height: 533 },
  '1986-next': { width: 510, height: 286 },
  '1986-pixar': { width: 500, height: 309 },
  '1995-toy-story': { width: 800, height: 591 },
  '1997-return': { width: 800, height: 600 },
  '1998-imac': { width: 295, height: 246 },
  '2001-ipod': { width: 750, height: 605 },
  '2003-itunes': { width: 969, height: 643 },
  '2007-iphone': { width: 750, height: 414 },
  '2008-app-store': { width: 560, height: 511 },
  '2010-ipad': { width: 1280, height: 720 },
  '2011-icloud': { width: 550, height: 366 },
  '2011-resign': { width: 960, height: 300 },
  '2011-passing': { width: 500, height: 337 },
};

// 获取图片尺寸
function getImageSize(imagePath: string): { width: number; height: number } {
  const fileName = imagePath.split('/').pop()?.replace(/\.(jpg|png|jpeg)$/i, '') || '';
  return timelineImageSizes[fileName] || { width: 800, height: 600 };
}

export default function TimelineClient() {
  const [expandedId, setExpandedId] = useState<string | null>('birth');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const events = timelineData.events as Event[];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      {/* Page Header */}
      <section className="min-h-[32vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            生平时间线
          </h1>
          <p className="text-xl text-gray-300">
            回顾史蒂夫·乔布斯的人生轨迹与重要转折点
          </p>
        </div>
      </section>

      {/* Desktop Timeline - Horizontal */}
      <section className="hidden md:block py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="flex-shrink-0 w-80 snap-start"
              >
                <div
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    expandedId === event.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {event.image && (
                    <div className="h-44 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={getImageSize(event.image).width}
                        height={getImageSize(event.image).height}
                        className="h-full w-full object-cover"
                      />
                      {event.isKeyEvent && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                          关键
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-sm text-blue-600 font-bold mb-2">
                      {event.year}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    {expandedId === event.id ? (
                      <p className="text-gray-600 text-sm mb-4">
                        {event.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleExpand(event.id)}
                        className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        {expandedId === event.id ? '收起' : '展开'}
                      </button>
                      <button
                        onClick={() => openModal(event)}
                        className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Timeline - Vertical */}
      <section className="md:hidden py-8 bg-gray-50">
        <div className="max-w-md mx-auto px-4 space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {event.image && (
                <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={getImageSize(event.image).width}
                    height={getImageSize(event.image).height}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-bold">
                    {event.year}
                  </span>
                  {event.isKeyEvent && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      关键
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>
                <button
                  onClick={() => openModal(event)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  查看详情 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-blue-600 font-semibold mb-1">
                    {selectedEvent.year}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedEvent.title}
                  </h2>
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

              {selectedEvent.image && (
                <div className="h-56 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    width={getImageSize(selectedEvent.image).width}
                    height={getImageSize(selectedEvent.image).height}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedEvent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-sm max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">概要</h4>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>

                {selectedEvent.detailedDescription && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">详细内容</h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedEvent.detailedDescription}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
