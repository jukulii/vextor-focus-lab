
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import AppHeader from '@/components/AppHeader';
import AnalysisResults from '@/components/AnalysisResults';

const ResultsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if we have a tab specified in the URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/results?tab=${tab}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <main className="flex-grow p-6">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            {t('check_domain_focus')}
          </h1>
          <AnalysisResults />
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
