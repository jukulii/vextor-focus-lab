
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import AppHeader from '@/components/AppHeader';
import AnalysisResults from '@/components/AnalysisResults';
import AgChartDemo from '@/components/AgChartDemo';

const ResultsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if we have a tab specified in the URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const pageParam = searchParams.get('page');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10) || 1);
    }
  }, [location]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Reset page to 1 when changing tabs
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);
    searchParams.set('page', '1');
    
    navigate(`/results?${searchParams.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page.toString());
    
    navigate(`/results?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AppHeader />
      <main className="flex-grow p-6">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            {t('check_domain_focus')}
          </h1>
          
          {/* AG Charts Demo Section */}
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">AG Charts Demo</h2>
            <AgChartDemo className="h-96 w-full" />
          </div>
          
          <AnalysisResults />
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
