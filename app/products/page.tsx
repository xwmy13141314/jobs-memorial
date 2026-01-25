import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: '伟大产品',
  description: '史蒂夫·乔布斯创造的伟大产品——Apple II、Macintosh、iPod、iPhone、iPad等改变世界的产品展示，了解产品背后的创新故事和历史意义。',
  keywords: ['史蒂夫·乔布斯', '产品', 'Apple II', 'Macintosh', 'iPod', 'iPhone', 'iPad', '创新产品', 'Apple产品'],
  openGraph: {
    title: '伟大产品 - 史蒂夫·乔布斯致敬网站',
    description: '探索史蒂夫·乔布斯创造的改变世界的产品',
    type: 'website',
  },
};

export default function Products() {
  return <ProductsClient />;
}
