
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
        {t('check_domain_focus')}
      </h1>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-gray-100 rounded-md">
          <TabsTrigger value="url">{t('site_url')}</TabsTrigger>
          <TabsTrigger value="filters" disabled className="text-gray-400">
            {t('filters')}
          </TabsTrigger>
          <TabsTrigger value="generate" disabled className="text-gray-400">
            {t('processing')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url">
          <Card className="bg-white border border-gray-100">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="sitemap-url" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('enter_sitemap_url')}
                  </label>
                  <Input 
                    id="sitemap-url"
                    placeholder="https://example.com" 
                    value={sitemapUrl} 
                    onChange={e => setSitemapUrl(e.target.value)} 
                    className="w-full h-12 bg-white border-gray-200" 
                  />
                </div>

                <div>
                  <Button 
                    onClick={handleAutomaticSearch} 
                    disabled={isSearching} 
                    className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white h-12 text-base font-medium"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('checking_sitemap')}
                      </>
                    ) : (
                      <>
                        <SearchIcon className="mr-2 h-4 w-4" />
                        {t('check_for_me')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <Card className="bg-white border border-gray-100">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.7" />
                    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    <path d="M18 18v3" />
                    <path d="M18 15v.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">Funkcja filtrowania wkrótce będzie dostępna</h3>
                <p className="text-gray-600 text-sm max-w-md">
                  Pracujemy nad dodaniem zaawansowanych opcji filtrowania, aby pomóc Ci lepiej analizować zawartość Twojej strony. Ta funkcjonalność będzie dostępna w następnej aktualizacji.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card className="bg-white border border-gray-100">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-[#ff6b6b] h-4 rounded-full w-3/5"></div>
                </div>
                <p className="text-gray-700 mb-2">
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
