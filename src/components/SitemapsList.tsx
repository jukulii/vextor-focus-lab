import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface ApiResponse {
  projectId: number;
  urls: {
    domain: string;
    sitemaps: string[];
    sitemap_count: number;
    execution_time: string;
  };
}

const SitemapsList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [filterQuery, setFilterQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Odbierz dane przekazane przez state
  const apiData: ApiResponse = location.state?.sitemapData;

  // Jeśli dane nie są dostępne, wyświetl komunikat
  if (!apiData) {
    return <div>No data available</div>;
  }

  const { projectId, urls } = apiData;
  const { domain, sitemaps, sitemap_count, execution_time } = urls;

  // Filtruj sitemapy na podstawie zapytania
  const filteredSitemaps = sitemaps.filter((sitemapUrl) =>
    sitemapUrl.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Przygotuj dane do wysłania
  const sitemapsToSave = filteredSitemaps.map((sitemapUrl) => ({
    url: sitemapUrl,
  }));

  const handleSaveSitemaps = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem('vextor-token');

      if (!token) {
        throw new Error('No token found');
      }

      // Wyślij dane na endpoint /save-sitemaps
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/save-sitemaps`,
        {
          projectId,
          sitemaps: sitemapsToSave,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Sitemaps saved successfully:', response.data);

      navigate('/processing');
    } catch (error) {
      console.error('Error saving sitemaps:', error);
      alert('Failed to save sitemaps');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
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
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm flex items-start">
                  <div className="flex-shrink-0 text-green-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-green-800">
                      {t('found_sitemaps').replace('%count%', sitemap_count.toString())}
                    </p>
                    <p className="mt-2 text-green-700">
                      Domain: {domain} | Execution time: {execution_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Input
                      placeholder={t('filter')}
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      className="pl-9"
                    />
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('site_map')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSitemaps.map((sitemapUrl, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium w-full truncate">
                            {sitemapUrl}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm">
                  <p className="text-green-800">
                    {t('after_filtering').replace('%count%', filteredSitemaps.length.toString())}
                  </p>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleSaveSitemaps}
                    disabled={isSaving}
                    className="bg-blue-500 hover:bg-blue-600 px-8"
                  >
                    {isSaving ? 'Saving...' : t('next')}
                  </Button>
                </div>
              </div>
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

export default SitemapsList;