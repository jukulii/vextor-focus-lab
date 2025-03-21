
import { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import SitemapSearch from '@/components/SitemapSearch';
import VantaBackground from '@/components/VantaBackground';

const AppPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <VantaBackground className="min-h-screen">
      <div className="flex flex-col min-h-screen bg-black/80 text-white">
        <AppHeader />
        <main className="flex-grow p-6">
          <SitemapSearch />
        </main>
      </div>
    </VantaBackground>
  );
};

export default AppPage;
