import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import MouseFollower from "@/components/MouseFollower";
import ChatWidget from "@/components/ChatWidget";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "史蒂夫·乔布斯致敬网站 | Steve Jobs Tribute",
    template: "%s | 史蒂夫·乔布斯致敬网站"
  },
  description: "致敬史蒂夫·乔布斯（1955-2011）——Apple公司联合创始人。展示他的生平时间线、伟大产品（Mac、iPod、iPhone、iPad）、经典名言、设计理念和学习资源。",
  keywords: ["史蒂夫·乔布斯", "Steve Jobs", "Apple", "苹果", "Mac", "iPhone", "iPad", "iPod", "Think Different", "创新", "设计理念", "产品", "名言", "语录", "时间线", "传记"],
  authors: [{ name: "Steve Jobs Tribute" }],
  creator: "Steve Jobs Tribute",
  publisher: "Steve Jobs Tribute",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://steve-jobs-tribute.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://steve-jobs-tribute.vercel.app',
    title: '史蒂夫·乔布斯致敬网站',
    description: '致敬史蒂夫·乔布斯——记录他的创新精神与设计理念',
    siteName: '史蒂夫·乔布斯致敬网站',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '史蒂夫·乔布斯致敬网站'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '史蒂夫·乔布斯致敬网站',
    description: '致敬史蒂夫·乔布斯——记录他的创新精神与设计理念',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 添加搜索引擎验证（根据需要配置）
    // google: 'verification-token',
    // yandex: 'verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        <Analytics />
        <MouseFollower />
        <Navbar />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
