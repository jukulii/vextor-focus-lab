
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, Loader2, Globe } from 'lucide-react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";

const SitemapSearch = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate search delay then navigate to sitemaps page
    setTimeout(() => {
      setIsSearching(false);
      navigate('/sitemaps');
    }, 1500);
  };

  const handleAutomaticSearch = async () => {
    if (!websiteUrl) {
      toast({
        title: t('Error'),
        description: t('Please enter a website URL'),
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('vextor-token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Format URL if needed
      let formattedUrl = websiteUrl;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sitemaps`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          domain: formattedUrl
        }
      });
      console.log('Data from API:', response.data);
      
      // Store the response data in localStorage for later use
      localStorage.setItem('sitemapData', JSON.stringify(response.data));
      
      // Redirect to processing page instead of sitemaps
      navigate('/processing');
    } catch (error) {
      console.error('Error during search:', error);
      setIsSearching(false);
      toast({
        title: t('Error'),
        description: t('Could not search the website. Please try again.'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white font-sans">
        Check Your Domain Focus
      </h1>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-[#ff6b6b]/20 dark:border-[#ff6b6b]/10 rounded-md shadow-sm">
          <TabsTrigger 
            value="url" 
            className="w-full rounded-md py-2 text-gray-900 dark:text-gray-200 data-[state=active]:bg-[#ff6b6b]/10 data-[state=active]:text-[#ff6b6b] dark:data-[state=active]:text-[#ff8a8a] font-sans"
          >
            {t('site_url')}
          </TabsTrigger>
          <TabsTrigger 
            value="filters" 
            className="w-full rounded-md py-2 text-gray-900 dark:text-gray-200 data-[state=active]:bg-[#ff6b6b]/10 data-[state=active]:text-[#ff6b6b] dark:data-[state=active]:text-[#ff8a8a] font-sans relative"
            onClick={() => navigate('/app')}
          >
            {t('filters')}
            <span className="absolute -top-2 -right-2 bg-[#ff6b6b] text-white text-xs px-2 py-0.5 rounded-full">
              {t('coming_soon')}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="generate" 
            className="w-full rounded-md py-2 text-gray-900 dark:text-gray-200 data-[state=active]:bg-[#ff6b6b]/10 data-[state=active]:text-[#ff6b6b] dark:data-[state=active]:text-[#ff8a8a] font-sans"
            onClick={() => navigate('/app')}
          >
            {t('processing')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-[#ff6b6b]/20 dark:border-[#ff6b6b]/10 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2 relative">
                  <div className="flex items-center relative">
                    <Globe className="absolute left-3 text-gray-400 dark:text-gray-500" size={18} />
                    <Input 
                      placeholder={t('enter_website_url')} 
                      value={websiteUrl} 
                      onChange={e => setWebsiteUrl(e.target.value)}
                      className="w-full h-12 bg-transparent border-gray-300 dark:border-gray-600 font-sans pl-10 text-gray-800 dark:text-gray-200 font-medium focus:ring-[#ff6b6b]/20 focus:border-[#ff6b6b] dark:focus:ring-[#ff6b6b]/30 dark:focus:border-[#ff6b6b]/70 dark:bg-gray-800/50"
                      type="url"
                      autoComplete="url"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAutomaticSearch();
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="accent" 
                    onClick={handleAutomaticSearch} 
                    disabled={isSearching} 
                    className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-md h-12 text-base font-medium font-sans dark:bg-[#ff6b6b]/90 dark:hover:bg-[#ff5252]/90 dark:shadow-lg dark:shadow-[#ff6b6b]/10"
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
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-[#ff6b6b]/20 dark:border-[#ff6b6b]/10 shadow-sm">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                    <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.7" />
                    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    <path d="M18 18v3" />
                    <path d="M18 15v.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100 font-sans">Funkcja filtrowania wkrótce będzie dostępna</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md font-sans">
                  Pracujemy nad dodaniem zaawansowanych opcji filtrowania, aby pomóc Ci lepiej analizować zawartość Twojej strony. Ta funkcjonalność będzie dostępna w następnej aktualizacji.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-[#ff6b6b]/20 dark:border-[#ff6b6b]/10 shadow-sm">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                  <div className="bg-[#ff6b6b] dark:bg-[#ff7a7a] h-4 rounded-full w-3/5"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2 font-sans">
                  {t('step')} 3/5, {t('progress')} 10 {t('next')} 26 sec
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-sans">
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
