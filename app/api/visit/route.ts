import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 数据文件路径
const dataFilePath = path.join(process.cwd(), 'data', 'visits.json');

// 初始化数据文件
async function initDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    // 文件不存在，创建初始数据
    const initialData = {
      total: 0,
      daily: {},
      lastUpdated: new Date().toISOString()
    };
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2));
  }
}

// 读取访问数据
async function getVisitData() {
  await initDataFile();
  const content = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(content);
}

// 写入访问数据
async function saveVisitData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// 获取今天的日期字符串 (YYYY-MM-DD)
function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 清理超过30天的旧数据
function cleanupOldData(daily: Record<string, number>): Record<string, number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const cleaned: Record<string, number> = {};
  for (const [date, count] of Object.entries(daily)) {
    const recordDate = new Date(date);
    if (recordDate >= thirtyDaysAgo) {
      cleaned[date] = count;
    }
  }
  return cleaned;
}

// GET - 获取访问统计
export async function GET(request: NextRequest) {
  try {
    const data = await getVisitData();
    const today = getTodayDate();

    // 清理旧数据
    data.daily = cleanupOldData(data.daily);

    const todayVisits = data.daily[today] || 0;

    return NextResponse.json({
      total: data.total,
      today: todayVisits,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('获取访问统计失败:', error);
    return NextResponse.json(
      { error: '获取统计失败', total: 0, today: 0 },
      { status: 500 }
    );
  }
}

// POST - 增加访问量
export async function POST(request: NextRequest) {
  try {
    const data = await getVisitData();
    const today = getTodayDate();

    // 增加总访问量
    data.total = (data.total || 0) + 1;

    // 增加今日访问量
    if (!data.daily[today]) {
      data.daily[today] = 0;
    }
    data.daily[today]++;

    // 清理旧数据
    data.daily = cleanupOldData(data.daily);

    // 更新时间戳
    data.lastUpdated = new Date().toISOString();

    await saveVisitData(data);

    const todayVisits = data.daily[today];

    return NextResponse.json({
      total: data.total,
      today: todayVisits,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('更新访问统计失败:', error);
    return NextResponse.json(
      { error: '更新统计失败', total: 0, today: 0 },
      { status: 500 }
    );
  }
}
