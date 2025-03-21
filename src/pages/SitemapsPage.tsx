
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import SitemapsList from '@/components/SitemapsList';

const SitemapsPage = () => {
  const navigate = useNavigate();
  
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AppHeader />
      <main className="flex-grow p-6">
        <SitemapsList />
      </main>
    </div>
  );
};

export default SitemapsPage;
