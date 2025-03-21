
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AppHeader />
      <main className="flex-grow p-6">
        <SitemapSearch />
      </main>
    </div>
  );
};

export default AppPage;
