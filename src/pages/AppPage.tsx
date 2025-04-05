
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SitemapSearch from '@/components/SitemapSearch';
import Footer from '@/components/Footer';
import VantaBackground from '@/components/VantaBackground';

const AppPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <VantaBackground />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar isDark={false} />
        <main className="flex-grow flex items-center justify-center py-32 px-4">
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-[#ff6b6b]/30 dark:border-[#ff6b6b]/20 rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 overflow-hidden transition-all duration-300">
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
