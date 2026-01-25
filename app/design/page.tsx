import { Metadata } from 'next';
import DesignClient from './DesignClient';

export const metadata: Metadata = {
  title: '设计理念',
  description: '史蒂夫·乔布斯的设计理念与产品哲学——Think Different、简约至上、用户体验为王、注重细节等10篇设计哲学文章深度解析。',
  keywords: ['史蒂夫·乔布斯', '设计理念', '产品哲学', 'Think Different', '简约设计', '用户体验', '创新思维'],
  openGraph: {
    title: '设计理念 - 史蒂夫·乔布斯致敬网站',
    description: '学习史蒂夫·乔布斯的产品设计哲学与思维方法',
    type: 'website',
  },
};

export default function Design() {
  return <DesignClient />;
}
