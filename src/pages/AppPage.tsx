
import { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import SitemapSearch from '@/components/SitemapSearch';
import Footer from '@/components/Footer';
import VantaBackground from '@/components/VantaBackground';

const AppPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      <VantaBackground />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <AppHeader />
        <main className="flex-grow flex items-center justify-center py-32 px-4">
          <div className="w-full max-w-6xl mx-auto">
            <div className="shadow-lg border border-[#ff6b6b]/30 bg-white/70 backdrop-blur-sm rounded-lg p-6">
              <SitemapSearch />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppPage;
