import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HighlightCards from '@/components/HighlightCards';
import homeData from '@/data/home.json';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HighlightCards highlights={homeData.highlights} />
      </main>
      <Footer />
    </div>
  );
}
