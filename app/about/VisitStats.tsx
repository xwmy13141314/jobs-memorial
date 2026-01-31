'use client';

import { useState, useEffect } from 'react';

interface VisitData {
  total: number;
  today: number;
  lastUpdated: string;
}

export default function VisitStats() {
  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/visit');
        const data = await response.json();
        setVisitData(data);
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 格式化最后更新时间
  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} 小时前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} 天前`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-3xl">📊</span>
        网站统计
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : visitData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 总访问量 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">👁️</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {visitData.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">总访问量</div>
          </div>

          {/* 今日访问 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📈</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {visitData.today.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">今日访问</div>
          </div>

          {/* 最后更新 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🕐</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {formatLastUpdate(visitData.lastUpdated)}
            </div>
            <div className="text-sm text-gray-600">最后更新</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          暂无统计数据
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        感谢您的访问与支持！
      </div>
    </div>
  );
}
