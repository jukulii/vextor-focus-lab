
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, Loader2 } from 'lucide-react';

const SitemapSearch = () => {
  const { t } = useLanguage();
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState('search');

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setStep('results');
    }, 2000);
  };

  const handleAutomaticSearch = () => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setStep('results');
    }, 2000);
  };

  const handleNext = () => {
    // This would normally go to the next steps of processing
    // For now it's just a placeholder
    console.log("Moving to next step");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">
        {t('check_domain_focus')}
      </h1>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="url">{t('site_url')}</TabsTrigger>
          <TabsTrigger value="filters">{t('filters')}</TabsTrigger>
          <TabsTrigger value="generate">{t('processing')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <Card>
            <CardContent className="pt-6">
              {step === 'search' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder={t('enter_sitemap_url')}
                      value={sitemapUrl}
                      onChange={(e) => setSitemapUrl(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={handleSearch} 
                      disabled={isSearching || !sitemapUrl}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('checking_sitemap')}
                        </>
                      ) : (
                        <>
                          <SearchIcon className="mr-2 h-4 w-4" />
                          {t('next')}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={handleAutomaticSearch}
                      disabled={isSearching}
                      className="bg-pink-100 text-pink-800 hover:bg-pink-200"
                    >
                      {isSearching ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SearchIcon className="mr-2 h-4 w-4" />
                      )}
                      {t('check_for_me')}
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 'results' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">
                          {t('found_urls').replace('%count%', '13')}
                        </p>
                        <p className="mt-2 text-sm text-green-700">
                          {t('filtering_note')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <Input
                        placeholder="Filter URLs..."
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={handleNext}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {t('next')}
                    </Button>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4 text-sm">
                    <p className="text-green-800">
                      {t('after_filtering').replace('%count%', '300')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="filters">
          <Card>
            <CardContent>
              <div className="flex flex-col space-y-4 py-4">
                <h3 className="text-lg font-medium">Content Filtering Options</h3>
                <p className="text-gray-600 text-sm">
                  Select which types of content to include in your analysis.
                </p>
                
                {/* Filter options would go here */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="blog" className="rounded border-gray-300" checked />
                    <label htmlFor="blog">Blog posts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="product" className="rounded border-gray-300" checked />
                    <label htmlFor="product">Product pages</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="category" className="rounded border-gray-300" checked />
                    <label htmlFor="category">Category pages</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="landing" className="rounded border-gray-300" checked />
                    <label htmlFor="landing">Landing pages</label>
                  </div>
                </div>
                
                <Button className="bg-blue-500 hover:bg-blue-600 w-full mt-4">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-blue-500 h-4 rounded-full w-3/5"></div>
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
