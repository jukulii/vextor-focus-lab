
import { useEffect } from 'react';
import SitemapsList from '@/components/SitemapsList';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const SitemapsPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isDark={false} />
        <main className="flex-grow p-6">
          <div className="w-full max-w-6xl mx-auto mt-8">
            <SitemapsList />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SitemapsPage;
