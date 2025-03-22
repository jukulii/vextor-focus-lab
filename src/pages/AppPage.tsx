
import { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import SitemapSearch from '@/components/SitemapSearch';
import VantaBackground from '@/components/VantaBackground';
import Footer from '@/components/Footer';

const AppPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen">
      <VantaBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow p-6">
          <div className="w-full max-w-6xl mx-auto mt-8">
            <SitemapSearch />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppPage;
