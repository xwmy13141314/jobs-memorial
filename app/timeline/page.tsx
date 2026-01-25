import { Metadata } from 'next';
import TimelineClient from './TimelineClient';

export const metadata: Metadata = {
  title: '生平时间线',
  description: '史蒂夫·乔布斯生平时间线——从1955年出生到2011年逝世，记录他的一生中的重要时刻：Apple创立、被解雇、NeXT、Pixar、回归Apple、发布iPhone等伟大产品。',
  keywords: ['史蒂夫·乔布斯', '时间线', '生平', '传记', 'Apple历史', 'NeXT', 'Pixar', 'iPhone发布'],
  openGraph: {
    title: '生平时间线 - 史蒂夫·乔布斯致敬网站',
    description: '回顾史蒂夫·乔布斯的人生轨迹与重要转折点',
    type: 'website',
  },
};

export default function Timeline() {
  return <TimelineClient />;
}
