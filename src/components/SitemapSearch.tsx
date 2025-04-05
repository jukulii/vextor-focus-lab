
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, Loader2, InfoIcon, Sparkles } from 'lucide-react';
import axios from 'axios';

const SitemapSearch = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    setIsSearching(true);

    // Simulate search delay then navigate to sitemaps page
    setTimeout(() => {
      setIsSearching(false);
      navigate('/sitemaps');
    }, 1500);
  };
  
  const handleAutomaticSearch = async () => {
    setIsSearching(true);
    try {
      const token = localStorage.getItem('vextor-token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sitemaps`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          domain: sitemapUrl
        }
      });
      console.log('Data from API:', response.data);
      setTimeout(() => {
        setIsSearching(false);
        navigate('/sitemaps', {
          state: {
            sitemapData: response.data
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Error during search:', error);
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
        {t('check_domain_focus')}
      </h1>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-[#ff6b6b]/30 rounded-xl shadow-md overflow-hidden">
          <TabsTrigger 
            value="url" 
            className="bg-white text-pink-700 font-medium py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/10 data-[state=active]:to-violet-500/10 data-[state=active]:text-pink-600 data-[state=active]:shadow-sm transition-all"
          >
            {t('site_url')}
          </TabsTrigger>
          <TabsTrigger 
            value="filters" 
            disabled 
            className="text-gray-400 py-3"
          >
            {t('filters')}
          </TabsTrigger>
          <TabsTrigger 
            value="generate" 
            disabled 
            className="text-gray-400 py-3"
          >
            {t('processing')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url">
          <Card className="bg-white border border-[#ff6b6b]/20 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="pt-8 pb-6 px-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center mb-2 text-pink-800 text-sm">
                    <InfoIcon size={16} className="mr-2 text-pink-600" />
                    <span>{t('enter_sitemap_url_hint') || 'Enter your website URL to check its sitemap'}</span>
                  </div>
                  
                  <Input 
                    placeholder={t('enter_sitemap_url')} 
                    value={sitemapUrl} 
                    onChange={e => setSitemapUrl(e.target.value)} 
                    className="w-full h-14 bg-white border-gray-200 rounded-lg px-4 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-base"
                  />
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handleAutomaticSearch} 
                    disabled={isSearching || !sitemapUrl.trim()} 
                    className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-md h-14 text-base font-medium rounded-lg transition-all duration-300"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t('checking_sitemap')}
                      </>
                    ) : (
                      <>
                        <SearchIcon className="mr-2 h-5 w-5" />
                        {t('check_for_me')}
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center mt-4">
                    <div className="bg-[#ff6b6b]/20 text-[#ff6b6b] px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center border border-[#ff6b6b]/30">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('privacy_note') || 'Your search data is kept private and secure'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <Card className="bg-white border border-[#ff6b6b]/20 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                    <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.7" />
                    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    <path d="M18 18v3" />
                    <path d="M18 15v.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Funkcja filtrowania wkrótce będzie dostępna
                </h3>
                <p className="text-gray-600 max-w-md leading-relaxed">
                  Pracujemy nad dodaniem zaawansowanych opcji filtrowania, aby pomóc Ci lepiej analizować zawartość Twojej strony. Ta funkcjonalność będzie dostępna w następnej aktualizacji.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card className="bg-white border border-[#ff6b6b]/20 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full bg-gray-100 rounded-full h-4 mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-violet-500 h-4 rounded-full w-3/5 animate-pulse-subtle"></div>
                </div>
                <p className="text-gray-700 mb-3 font-medium">
                  {t('step')} 3/5, {t('progress')} 10 {t('next')} 26 sec
                </p>
                <p className="text-gray-600 text-sm">
                  {t('converting_content')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SitemapSearch;
