import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HighlightCards from '@/components/HighlightCards';
import homeData from '@/data/home.json';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative">
      {/* 统一背景层 - 格子纹 */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* 统一背景层 - 渐变光晕 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-[60%] right-[10%] w-80 h-80 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-8 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-8 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10">
        <Hero />
        <HighlightCards highlights={homeData.highlights} />
      </main>
      <Footer />
    </div>
  );
}
