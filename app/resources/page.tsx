import { Metadata } from 'next';
import ResourcesClient from './ResourcesClient';

export const metadata: Metadata = {
  title: '学习资源',
  description: '史蒂夫·乔布斯学习资源推荐——相关书籍（史蒂夫·乔布斯传等）、纪录片、电影、演讲视频和文章，帮助你更深入了解乔布斯。',
  keywords: ['史蒂夫·乔布斯', '资源', '书籍', '纪录片', '电影', '演讲', '传记', '学习资料'],
  openGraph: {
    title: '学习资源 - 史蒂夫·乔布斯致敬网站',
    description: '推荐书籍、纪录片、演讲等学习资源',
    type: 'website',
  },
};

export default function Resources() {
  return <ResourcesClient />;
}
