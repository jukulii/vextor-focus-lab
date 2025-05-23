import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, Loader2, Globe, Layout, Check, ExternalLink, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Type for project_source_type enum
type ProjectSourceType = 'domain_url' | 'sitemap_url';

// --- Add URL interface ---
interface ProcessedUrl {
  url: string;
}

// Define Project type based on your database schema
interface Project {
  id: string; // Assuming project ID is a string (UUID)
  user_id: string;
  name: string;
  source_type: ProjectSourceType;
  urls_count: number;
  processed_urls_count: number;
  // Add other project fields if necessary
}

interface SitemapData {
  domain: string;
  sitemaps: string[];
  sitemap_count: number;
  execution_time: string;
}

// Zaktualizowany interfejs Filter
interface Filter {
  id: number;
  type: 'contains' | 'not-contains' | 'regex'; // Dodano typy
  value: string;
  operator?: 'AND' | 'OR';
}

// --- Hook for real-time progress (copied and adapted from ProcessingPage) ---
const useProjectProgress = (projectId: string | null) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [urlsCount, setUrlsCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processedUrls, setProcessedUrls] = useState<string[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState<boolean>(false);
  const [hasFetchedUrls, setHasFetchedUrls] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId) return;

    // Reset state when projectId changes
    setProgress(0);
    setUrlsCount(0);
    setProcessedCount(0);

    // Fetch initial project data
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('urls_count, processed_urls_count')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching initial project data:', error);
        return;
      }

      if (data) {
        setUrlsCount(data.urls_count);
        setProcessedCount(data.processed_urls_count);
        if (data.urls_count > 0) {
          setProgress((data.processed_urls_count / data.urls_count) * 100);
        }
      }
    };

    fetchInitialData();

    // Set up real-time subscription using channel
    const channel = supabase
      .channel(`project-progress-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          const updatedProject = payload.new as { processed_urls_count?: number; urls_count?: number };
          const processed_urls_count = typeof updatedProject?.processed_urls_count === 'number' ? updatedProject.processed_urls_count : null;
          const urls_count = typeof updatedProject?.urls_count === 'number' ? updatedProject.urls_count : null;

          if (urls_count !== null) {
            setUrlsCount(urls_count);
          }
          if (processed_urls_count !== null) {
            setProcessedCount(processed_urls_count);
          }

          if (urls_count !== null && processed_urls_count !== null && urls_count > 0) {
            const newProgress = (processed_urls_count / urls_count) * 100;
            setProgress(newProgress);
          } else if (urls_count === 0) {
            setProgress(0);
          }
        }
      )
      .subscribe((status) => {
        console.log(`SitemapSearch: Supabase channel status for ${projectId}: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log(`SitemapSearch: Successfully subscribed to project ${projectId} updates!`);
        }
      });

    // Clean up subscription on unmount or projectId change
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`SitemapSearch: Unsubscribed from project ${projectId} updates.`);
      }
    };
  }, [projectId]);

  // --- Add effect to fetch processed URLs at 100% ---
  useEffect(() => {
    // Fetch only if progress is 100, we have a project ID, and haven't fetched yet
    if (progress >= 100 && projectId && !hasFetchedUrls && !isLoadingUrls) {
      const fetchProcessedUrls = async () => {
        setIsLoadingUrls(true);
        console.log('SitemapSearch/ProcessingDisplay: Progress reached 100%. Waiting 1 second before fetching processed URLs...');

        // Add 1 second delay before fetching
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('SitemapSearch/ProcessingDisplay: Fetching processed URLs using join...');
        try {
          // Get current user session
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          const currentUserId = currentSession?.user?.id;

          if (!currentUserId) {
            console.error('SitemapSearch/ProcessingDisplay: No user ID found in session');
            setProcessedUrls([]);
            setIsLoadingUrls(false);
            setHasFetchedUrls(true);
            return;
          }

          console.log(`SitemapSearch/ProcessingDisplay: Fetching URLs for project ${projectId} as user ${currentUserId}`);

          // First verify the project belongs to the current user
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', currentUserId)
            .single();

          if (projectError || !projectData) {
            console.error('SitemapSearch/ProcessingDisplay: Project not found or not owned by current user:', projectError);
            setProcessedUrls([]);
            setIsLoadingUrls(false);
            setHasFetchedUrls(true);
            return;
          }

          // Then fetch URLs with non-null embedding using join
          const { data: urlData, error: urlError } = await supabase
            .from('urls')
            .select(`
              url,
              embedding_title_desc,
              sitemaps!inner(
                project_id,
                projects!inner(id)
              )
            `)
            .eq('sitemaps.project_id', projectId)
            .eq('sitemaps.projects.user_id', currentUserId);

          if (urlError) {
            console.error('SitemapSearch/ProcessingDisplay: Error fetching processed URLs with join:', urlError);
            setProcessedUrls([]);
          } else if (urlData) {
            // Filter out URLs without embeddings
            const urlsWithEmbeddings = urlData.filter(item => item.embedding_title_desc !== null);

            // Process in batches of 10k
            const BATCH_SIZE = 10000;
            const apiUrl = import.meta.env.VITE_SITE_FOCUS_RADIUS_METRIC_API_URL;
            const apiKey = import.meta.env.VITE_APP_API_KEY;

            if (!apiUrl || !apiKey) {
              console.error('Missing API configuration:', { apiUrl, apiKey });
              return;
            }

            console.log('Processing all URLs with embeddings:', urlsWithEmbeddings.length);

            const payload = {
              embeddings: urlsWithEmbeddings.map(item => {
                // Convert string to array of numbers
                if (typeof item.embedding_title_desc === 'string') {
                  try {
                    return JSON.parse(item.embedding_title_desc);
                  } catch (e) {
                    console.error('Error parsing embedding:', e);
                    return null;
                  }
                }
                return item.embedding_title_desc;
              }).filter(embedding => embedding !== null),
              urls: urlsWithEmbeddings.map(item => item.url)
            };

            console.log('Sending all URLs to API:', {
              totalUrls: urlsWithEmbeddings.length,
              firstUrl: urlsWithEmbeddings[0]?.url,
              lastUrl: urlsWithEmbeddings[urlsWithEmbeddings.length - 1]?.url,
              apiUrl
            });

            try {
              const response = await axios.post(apiUrl, payload, {
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': apiKey
                }
              });
              console.log('Successfully sent all URLs to API. Response:', response.status);

              navigate(`/results?projectId=${projectId}`, {
                state: { apiData: response.data }
              });
            } catch (error) {
              console.error('Error sending URLs to API:', error);
              toast({
                title: 'API Error',
                description: 'Failed to send URLs to API.',
                variant: 'destructive'
              });
            }
          }
        } catch (error) {
          console.error('SitemapSearch/ProcessingDisplay: Error in fetchProcessedUrls:', error);
          setProcessedUrls([]);
        } finally {
          setIsLoadingUrls(false);
          setHasFetchedUrls(true);
        }
      };

      fetchProcessedUrls();
    }
  }, [progress, projectId, hasFetchedUrls, isLoadingUrls, navigate, toast]);

  return { progress, urlsCount, processedCount, processedUrls, isLoadingUrls };
};
// --- End of useProjectProgress hook ---

// --- Component to display processing progress ---
interface ProcessingDisplayProps {
  projectId: string;
}

const ProcessingDisplay: React.FC<ProcessingDisplayProps> = ({ projectId }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { progress, urlsCount, processedCount, processedUrls, isLoadingUrls } = useProjectProgress(projectId);

  // Show toast for auth error only once
  useEffect(() => {
    if (isLoadingUrls) {
      toast({
        title: 'Processing',
        description: 'Processing in progress...',
        variant: 'default'
      });
    }
  }, [isLoadingUrls, toast]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {t('check_domain_focus')}
      </h1>

      <Tabs value="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="url" disabled className="text-gray-600 dark:text-gray-400">
            {t('site_url')}
          </TabsTrigger>
          <TabsTrigger value="filters" disabled className="text-gray-600 dark:text-gray-400">
            {t('filters')}
          </TabsTrigger>
          <TabsTrigger value="generate" className="text-gray-800 dark:text-white">
            {t('processing')}
          </TabsTrigger>
        </TabsList>

        <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-lg border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-lg dark:shadow-black/30 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Progress value={progress} className="w-full h-8 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {t('progress')}: {progress.toFixed(1)}% ({processedCount} / {urlsCount})
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                {progress < 100 ? t('converting_content') : t('processing_complete')}
              </p>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};
// --- End of ProcessingDisplay component ---

const SitemapSearch = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuth();
  const [url, setUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [inputType, setInputType] = useState<ProjectSourceType>('domain_url');
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null);
  const [selectedSitemaps, setSelectedSitemaps] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [fetchedUrlItems, setFetchedUrlItems] = useState<Array<{ sitemapUrl: string; pageUrl: string }>>([]);
  const [totalFetchedUrlsCount, setTotalFetchedUrlsCount] = useState<number>(0);
  const [initialTotalUrlCountFromAllSitemaps, setInitialTotalUrlCountFromAllSitemaps] = useState<number>(0);

  // Nowe stany do przechowywania danych wejściowych dla późniejszego tworzenia projektu
  const [initialUrl, setInitialUrl] = useState('');
  const [initialInputType, setInitialInputType] = useState<ProjectSourceType>('domain_url');

  // Stan aktywnej zakładki
  const [activeTab, setActiveTab] = useState<string>("url");

  // Stany filtrów
  const [filters, setFilters] = useState<Filter[]>([]);
  const [newFilterType, setNewFilterType] = useState<'contains' | 'not-contains' | 'regex'>('contains');
  const [newFilterValue, setNewFilterValue] = useState<string>('');
  const [nextOperator, setNextOperator] = useState<'AND' | 'OR'>('AND');

  // Stany paginacji
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);

  // State to hold the ID of the project being processed
  const [processingProjectId, setProcessingProjectId] = useState<string | null>(null);

  const { toast } = useToast();

  const createProject = async (url: string, type: ProjectSourceType) => {
    if (!session?.user?.id) {
      throw new Error('No user session');
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: session.user.id,
            name: url,
            source_type: type,
            urls_count: 0,
            processed_urls_count: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data.id; // Return the project ID
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  // Zaktualizowana funkcja resetująca stan
  const resetStateForNewSearch = () => {
    setUrl('');
    setSitemapData(null);
    setSelectedSitemaps(new Set());
    setFetchedUrlItems([]);
    setTotalFetchedUrlsCount(0);
    setInitialTotalUrlCountFromAllSitemaps(0);
    setFilters([]);
    setNewFilterValue('');
    setNewFilterType('contains');
    setNextOperator('AND');
    setCurrentPage(1);
    setActiveTab("url");
    setInitialUrl('');
    setInitialInputType('domain_url');
  };

  // Zaktualizowana funkcja powrotu do wyboru sitemap
  const handleBackToSitemaps = () => {
    setFetchedUrlItems([]);
    setTotalFetchedUrlsCount(0);
    setFilters([]);
    setNewFilterValue('');
    setNewFilterType('contains');
    setNextOperator('AND');
    setCurrentPage(1);
  };

  const handleAutomaticSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSearching) {
      // Reset części stanu, ale zachowaj URL wpisany przez użytkownika
      setSitemapData(null);
      setSelectedSitemaps(new Set());
      setFetchedUrlItems([]);
      setTotalFetchedUrlsCount(0);
      setInitialTotalUrlCountFromAllSitemaps(0);
      setFilters([]);
      setNewFilterValue('');
      setNewFilterType('contains');
      setNextOperator('AND');
      setCurrentPage(1);
      setActiveTab("url");
      setInitialUrl(url); // Zapisz wpisany URL
      setInitialInputType(inputType); // Zapisz typ
    }

    if (!url) { /* toast */ return; }
    if (!isAuthenticated || !session?.access_token) { /* toast + navigate */ return; }

    setIsSearching(true);
    setInitialTotalUrlCountFromAllSitemaps(0);

    try {
      const parserApiUrl = import.meta.env.VITE_SITEMAP_PARSER_API_URL;
      if (!parserApiUrl) {
        throw new Error('Sitemap parser API URL is not defined');
      }
      const apiKey = import.meta.env.VITE_APP_API_KEY;
      if (!apiKey) {
        throw new Error('API Key is not defined');
      }

      if (inputType === 'domain_url') {
        const domainCrawlApiUrl = import.meta.env.VITE_DOMAIN_CRAWL_API_URL;
        if (!domainCrawlApiUrl) {
          throw new Error('Domain Crawl API URL is not defined');
        }

        const response = await axios.get(domainCrawlApiUrl, {
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          params: { domain: url }
        });
        const sitemapDataFromApi = response.data;
        setSitemapData(sitemapDataFromApi);
        const allFoundSitemaps = sitemapDataFromApi.sitemaps || [];
        setSelectedSitemaps(new Set(allFoundSitemaps)); // Auto-select all found

        // Fetch total URL count from ALL found sitemaps
        if (allFoundSitemaps.length > 0) {
          console.log('Fetching total URL count for all found sitemaps:', allFoundSitemaps);
          const parserResponse = await axios.post(parserApiUrl, {
            sitemap_urls: allFoundSitemaps
          }, {
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
          });

          let totalCount = 0;
          if (parserResponse.data && typeof parserResponse.data.results === 'object') {
            for (const sitemapUrl in parserResponse.data.results) {
              const result = parserResponse.data.results[sitemapUrl];
              if (result && !result.error) {
                totalCount += result.urls_count || (Array.isArray(result.urls) ? result.urls.length : 0);
              } else if (result && result.error) {
                console.warn(`Error parsing sitemap ${sitemapUrl} for total count:`, result.error);
                // Optionally show a toast, but don't fail the whole process
              }
            }
          }
          console.log('Calculated initial total URL count from all sitemaps:', totalCount);
          setInitialTotalUrlCountFromAllSitemaps(totalCount);
        } else {
          console.log('No sitemaps found for the domain.');
          setInitialTotalUrlCountFromAllSitemaps(0);
        }


      } else { // inputType === 'sitemap_url'
        const response = await axios.post(parserApiUrl, {
          sitemap_urls: [url] // Szukamy tylko dla podanego URL sitemapy
        }, {
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
        });

        const parserResponseData = response.data;
        console.log('Successfully received response from parser API for single sitemap:', url);

        let allUrlItems: Array<{ sitemapUrl: string; pageUrl: string }> = [];
        let count = 0; // This will be both totalFetched and initialTotal for single sitemap
        if (parserResponseData && typeof parserResponseData.results === 'object') {
          const result = parserResponseData.results[url];
          if (result && !result.error && Array.isArray(result.urls)) {
            const itemsFromSitemap = result.urls.map((pageUrl: string) => ({ sitemapUrl: url, pageUrl: pageUrl }));
            allUrlItems = allUrlItems.concat(itemsFromSitemap);
            count = result.urls_count || result.urls.length; // Get count from response
          } else if (result && result.error) {
            console.error(`Error parsing sitemap ${url}:`, result.error);
            toast({ title: 'Parsing Error', description: `Could not parse sitemap ${url}: ${result.error}`, variant: 'destructive' });
          }
        }
        setFetchedUrlItems(allUrlItems);
        setTotalFetchedUrlsCount(count); // Set count for selected (the only one) sitemap
        setInitialTotalUrlCountFromAllSitemaps(count); // Set total initial count
        setSitemapData({ domain: '(Direct Sitemap)', sitemaps: [url], sitemap_count: 1, execution_time: 'N/A' });
        setSelectedSitemaps(new Set([url]));
      }

    } catch (error) {
      console.error('Error during automatic search:', error);
      toast({ title: t('Error'), description: (error instanceof Error ? error.message : t('could_not_search_website')) || 'Search failed', variant: "destructive" });
      resetStateForNewSearch(); // Całkowity reset w razie błędu
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSitemaps(new Set(sitemapData?.sitemaps || []));
    } else {
      setSelectedSitemaps(new Set());
    }
  };

  const handleSitemapToggle = (sitemap: string, checked: boolean) => {
    const newSelected = new Set(selectedSitemaps);
    if (checked) {
      newSelected.add(sitemap);
    } else {
      newSelected.delete(sitemap);
    }
    setSelectedSitemaps(newSelected);
  };

  const handleFetchUrls = async () => {
    if (selectedSitemaps.size === 0) {
      toast({ title: t('Error'), description: t('please_select_at_least_one_sitemap'), variant: "destructive" });
      return;
    }

    setFetchedUrlItems([]);
    setTotalFetchedUrlsCount(0);
    setFilters([]);
    setNewFilterValue('');
    setNewFilterType('contains');
    setNextOperator('AND');
    setCurrentPage(1);

    setIsProcessing(true);
    try {
      let parserResponseData;
      try {
        const parserApiUrl = import.meta.env.VITE_SITEMAP_PARSER_API_URL;
        if (!parserApiUrl) {
          throw new Error('Sitemap parser API URL is not defined in environment variables.');
        }
        const response = await axios.post(parserApiUrl, {
          sitemap_urls: Array.from(selectedSitemaps)
        }, {
          headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_APP_API_KEY }
        });
        parserResponseData = response.data;
        console.log('Successfully received response from parser API for sitemaps:', Array.from(selectedSitemaps));
      } catch (apiError) {
        console.error('Error sending sitemaps to parser API or receiving response:', apiError);
        throw new Error('Failed to get URL list from parser API.');
      }

      let allUrlItems: Array<{ sitemapUrl: string; pageUrl: string }> = [];
      let count = 0;
      if (parserResponseData && typeof parserResponseData.results === 'object') {
        for (const sitemapUrl in parserResponseData.results) {
          if (selectedSitemaps.has(sitemapUrl)) {
            const result = parserResponseData.results[sitemapUrl];
            if (result && !result.error && Array.isArray(result.urls)) {
              const itemsFromSitemap = result.urls.map((pageUrl: string) => ({ sitemapUrl: sitemapUrl, pageUrl: pageUrl }));
              allUrlItems = allUrlItems.concat(itemsFromSitemap);
              count += result.urls_count || result.urls.length;
            } else if (result && result.error) {
              console.error(`Error parsing sitemap ${sitemapUrl}:`, result.error);
              toast({ title: 'Parsing Error', description: `Could not parse sitemap ${sitemapUrl}: ${result.error}`, variant: 'destructive' });
            }
          }
        }
      }

      setFetchedUrlItems(allUrlItems);
      setTotalFetchedUrlsCount(count);

    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast({ title: t('Error'), description: (error instanceof Error ? error.message : 'Failed to fetch URLs.'), variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFilter = () => {
    if (!newFilterValue.trim()) return;

    const newFilter: Filter = {
      id: Date.now(),
      type: newFilterType,
      value: newFilterValue.trim(),
      operator: filters.length > 0 ? nextOperator : undefined,
    };
    setFilters([...filters, newFilter]);
    setNewFilterValue('');
    setNewFilterType('contains');
    setNextOperator('AND');
  };

  const handleRemoveFilter = (idToRemove: number) => {
    const newFilters = filters.filter(filter => filter.id !== idToRemove);
    if (filters.length > 0 && filters[0].id === idToRemove && newFilters.length > 0) {
      newFilters[0] = { ...newFilters[0], operator: undefined };
    }
    setFilters(newFilters);
    if (newFilters.length === 0) {
      setNextOperator('AND');
    }
  };

  const filteredUrlItems = useMemo(() => {
    if (filters.length === 0) {
      return fetchedUrlItems;
    }

    return fetchedUrlItems.filter(item => {
      let currentMatch = true;

      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        let matchesCurrentFilter = false;
        const lowerUrl = item.pageUrl.toLowerCase();
        const filterValue = filter.value;
        const lowerFilterValue = filterValue.toLowerCase();

        try {
          switch (filter.type) {
            case 'contains':
              matchesCurrentFilter = lowerUrl.includes(lowerFilterValue);
              break;
            case 'not-contains':
              matchesCurrentFilter = !lowerUrl.includes(lowerFilterValue);
              break;
            case 'regex':
              const regex = new RegExp(filterValue, 'i');
              matchesCurrentFilter = regex.test(item.pageUrl);
              break;
          }
        } catch (e) {
          if (filter.type === 'regex') {
            console.error(`Invalid regex pattern "${filterValue}":`, e);
          }
          matchesCurrentFilter = false;
        }

        if (i === 0) {
          currentMatch = matchesCurrentFilter;
        } else {
          const operator = filter.operator || 'AND';
          if (operator === 'AND') {
            currentMatch = currentMatch && matchesCurrentFilter;
          } else {
            currentMatch = currentMatch || matchesCurrentFilter;
          }
        }
      }
      return currentMatch;
    });
  }, [fetchedUrlItems, filters]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUrlItems.length / itemsPerPage);
  }, [filteredUrlItems.length, itemsPerPage]);

  const displayedUrlItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUrlItems.slice(startIndex, endIndex);
  }, [filteredUrlItems, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  const handleProcessFilteredUrls = async () => {
    if (!isAuthenticated || !session?.user?.id) {
      toast({ title: t('Error'), description: t('auth.pleaseLogin'), variant: "destructive" });
      navigate('/login');
      return;
    }
    if (filteredUrlItems.length === 0 && totalFetchedUrlsCount > 0) {
      toast({ title: t('Info'), description: 'No URLs match the current filters. Please adjust filters or clear them to proceed.', variant: "default" });
      return;
    } else if (totalFetchedUrlsCount === 0 && filters.length === 0) {
      toast({ title: t('Error'), description: t('no_urls_to_process'), variant: "destructive" });
      return;
    }

    // Add validation for maximum URLs
    if (filteredUrlItems.length > 10000) {
      toast({
        title: t('Error'),
        description: tInterpolate('max_urls_exceeded', { max: 10000 }),
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    let projectId: string | null = null;
    const sitemapUrlToIdMap = new Map<string, string>();

    try {
      console.log(`Creating project for URL: ${initialUrl}, Type: ${initialInputType}`);
      const projectId = await createProject(initialUrl, initialInputType); // Capture the returned ID
      if (!projectId) { // Check if projectId is valid
        throw new Error('Project creation failed or did not return an ID');
      }
      console.log(`Project created successfully with ID: ${projectId}`);

      const sitemapFilteredCounts = new Map<string, number>();
      filteredUrlItems.forEach(item => {
        if (selectedSitemaps.has(item.sitemapUrl)) {
          sitemapFilteredCounts.set(item.sitemapUrl, (sitemapFilteredCounts.get(item.sitemapUrl) || 0) + 1);
        }
      });
      console.log('Filtered URL counts per selected sitemaps:', sitemapFilteredCounts);

      const sitemapsToInsert = Array.from(selectedSitemaps).map(sitemapUrl => ({
        project_id: projectId,
        url: sitemapUrl,
        urls_count: sitemapFilteredCounts.get(sitemapUrl) || 0
      }));

      if (sitemapsToInsert.length > 0) {
        console.log('Inserting selected sitemaps:', sitemapsToInsert);
        const { data: insertedSitemaps, error: sitemapInsertError } = await supabase
          .from('sitemaps')
          .insert(sitemapsToInsert)
          .select('id, url');

        if (sitemapInsertError) {
          console.error('Supabase sitemap insert error:', sitemapInsertError);
          throw new Error('Failed to save sitemaps to database.');
        }

        if (insertedSitemaps) {
          insertedSitemaps.forEach(sitemap => {
            sitemapUrlToIdMap.set(sitemap.url, sitemap.id);
          });
          console.log('Sitemaps inserted successfully. URL to ID map:', sitemapUrlToIdMap);
        } else {
          console.warn('Sitemap insert operation returned no data');
          throw new Error('Failed to retrieve IDs for inserted sitemaps.');
        }
      } else {
        console.log('No selected sitemaps to insert.');
      }

      const urlsToInsert = filteredUrlItems
        .filter(item => selectedSitemaps.has(item.sitemapUrl))
        .map(item => {
          const sitemapId = sitemapUrlToIdMap.get(item.sitemapUrl);
          if (!sitemapId) {
            console.warn(`Could not find sitemap ID for URL: ${item.pageUrl} from sitemap: ${item.sitemapUrl}. Skipping.`);
            return null;
          }
          return {
            sitemap_id: sitemapId,
            url: item.pageUrl
          };
        })
        .filter(item => item !== null);

      if (urlsToInsert.length > 0) {
        console.log(`Inserting ${urlsToInsert.length} filtered URLs...`);
        const BATCH_SIZE = 10000;
        for (let i = 0; i < urlsToInsert.length; i += BATCH_SIZE) {
          const batch = urlsToInsert.slice(i, i + BATCH_SIZE);
          console.log(`Inserting URL batch ${i / BATCH_SIZE + 1}...`);
          const { data: insertedUrls, error: urlInsertError } = await supabase
            .from('urls')
            .insert(batch as any)
            .select('id, url');

          if (urlInsertError) {
            console.error('Supabase URL insert error:', urlInsertError);
            throw new Error('Failed to save URLs to database.');
          }

          if (insertedUrls && insertedUrls.length > 0) {
            console.log(`Successfully inserted batch ${i / BATCH_SIZE + 1}, got ${insertedUrls.length} IDs back.`);
            const apiPayload = {
              items: insertedUrls.map(item => ({ id: item.id, url: item.url }))
            };
            const apiKey = import.meta.env.VITE_APP_API_KEY;
            const crawlApiUrl = import.meta.env.VITE_CRAWL_URL_API_URL;
            const brightDataApiUrl = import.meta.env.VITE_CRAWLER_URL_BRIGHTDATA_TITLE_DESCRIPTION_API_URL;

            if (!apiKey) {
              console.warn('VITE_APP_API_KEY is not defined. Skipping API calls.');
            } else {
              // Send to Crawl API
              // if (crawlApiUrl) {
              //   try {
              //     console.log(`Sending batch ${i / BATCH_SIZE + 1} to Crawl API: ${crawlApiUrl}`);
              //     axios.post(crawlApiUrl, apiPayload, {
              //       headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
              //     }).catch(crawlError => {
              //       console.error(`Error sending batch ${i / BATCH_SIZE + 1} to Crawl API:`, crawlError);
              //       // Decide if you want to throw or just log the error
              //       // throw new Error('Failed to send data to Crawl API.');
              //       toast({ title: 'API Error', description: `Failed to send batch ${i / BATCH_SIZE + 1} to Crawl API.`, variant: 'default' });
              //     });
              //   } catch (syncError) {
              //     // Catch potential synchronous errors during request setup
              //     console.error(`Synchronous error setting up Crawl API request for batch ${i / BATCH_SIZE + 1}:`, syncError);
              //     toast({ title: 'API Setup Error', description: `Failed to setup request for batch ${i / BATCH_SIZE + 1} to Crawl API.`, variant: 'destructive' });
              //   }
              // } else {
              //   console.warn('VITE_CRAWL_URL_API_URL is not defined. Skipping Crawl API call.');
              // }

              // Send to BrightData API
              if (brightDataApiUrl) {
                try {
                  console.log(`Sending batch ${i / BATCH_SIZE + 1} to BrightData API: ${brightDataApiUrl}`);
                  axios.post(brightDataApiUrl, apiPayload, {
                    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
                  }).catch(brightDataError => {
                    console.error(`Error sending batch ${i / BATCH_SIZE + 1} to BrightData API:`, brightDataError);
                    // Decide if you want to throw or just log the error
                    // throw new Error('Failed to send data to BrightData API.');
                    toast({ title: 'API Error', description: `Failed to send batch ${i / BATCH_SIZE + 1} to BrightData API.`, variant: 'default' });
                  });
                } catch (syncError) {
                  // Catch potential synchronous errors during request setup
                  console.error(`Synchronous error setting up BrightData API request for batch ${i / BATCH_SIZE + 1}:`, syncError);
                  toast({ title: 'API Setup Error', description: `Failed to setup request for batch ${i / BATCH_SIZE + 1} to BrightData API.`, variant: 'destructive' });
                }
              } else {
                console.warn('VITE_CRAWLER_URL_BRIGHTDATA_TITLE_DESCRIPTION_API_URL is not defined. Skipping BrightData API call.');
              }
            }
          } else {
            console.warn(`Batch ${i / BATCH_SIZE + 1} insertion returned no data or an empty array.`);
          }
        }
        console.log('Filtered URLs inserted and sent to APIs successfully.');

        // Update project count to the number of URLs actually inserted
        const { error: projectUpdateError } = await supabase
          .from('projects')
          .update({
            urls_count: urlsToInsert.length, // Use the length of the array of URLs to be inserted
          })
          .eq('id', projectId);

        if (projectUpdateError) {
          console.error('Error updating project counts:', projectUpdateError);
        } else {
          // Update log message
          console.log(`Project ${projectId} updated with urls_count=${urlsToInsert.length}`);
        }

        // --- CHANGE: Instead of navigating, set state and switch tab ---
        console.log(`Starting processing for project ID: ${projectId}`);
        setProcessingProjectId(projectId);
        setActiveTab("generate"); // Switch to the processing tab
        // navigate(`/processing?projectId=${projectId}`); // Removed navigation

      } else {
        console.log('No filtered URLs to insert (after filtering by selected sitemaps).');
        // Update project count to 0 since no URLs were inserted
        const { error: projectUpdateError } = await supabase
          .from('projects')
          .update({
            urls_count: 0, // Set count to 0 as urlsToInsert.length is 0 here
          })
          .eq('id', projectId);

        if (projectUpdateError) {
          console.error('Error updating project count when no URLs inserted:', projectUpdateError);
        } else {
          // Update log message
          console.log(`Project ${projectId} updated with urls_count=0 (no URLs inserted).`);
        }
        // --- CHANGE: Instead of navigating, set state and switch tab ---
        console.log(`Starting processing (with 0 URLs) for project ID: ${projectId}`);
        setProcessingProjectId(projectId);
        setActiveTab("generate"); // Switch to the processing tab
        // navigate(`/processing?projectId=${projectId}`); // Removed navigation
      }

    } catch (error) {
      console.error('Error processing filtered URLs:', error);
      toast({ title: t('Error'), description: (error instanceof Error ? error.message : 'Failed to process URLs and save data.'), variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const tInterpolate = (key: string, params: Record<string, string | number>): string => {
    let translation = t(key);
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`%${paramKey}%`, String(paramValue));
    });
    return translation;
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans text-gray-100 dark:text-gray-100 transition-colors px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 bg-[#13131a]">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-white dark:text-white font-sans">
        {t('check_domain_focus')}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 sm:mb-10 bg-[#1e1e2d] border-none rounded-lg shadow-sm overflow-hidden p-0">
          <TabsTrigger value="url" className="py-3 text-center text-sm font-sans data-[state=active]:bg-[#ff6b6b] data-[state=active]:text-white transition-colors rounded-l-lg text-gray-300 hover:bg-gray-700/30">{t('url_source_tab') || 'URL Source'}</TabsTrigger>
          <TabsTrigger value="filters" className="py-3 text-center text-sm font-sans relative data-[state=active]:bg-[#ff6b6b] data-[state=active]:text-white transition-colors text-gray-400 border-x border-gray-700/30" disabled>{t('filters')}</TabsTrigger>
          <TabsTrigger
            value="generate"
            className="py-3 text-center text-sm font-sans data-[state=active]:bg-[#ff6b6b] data-[state=active]:text-white transition-colors rounded-r-lg text-gray-300 hover:bg-gray-700/30"
            disabled={!processingProjectId}
          >
            {t('processing_tab_title') || 'Processing'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="w-full">
          <Card className="bg-[#13131a]/70 dark:bg-[#13131a]/70 backdrop-blur-sm border-none shadow-md rounded-xl w-full">
            <CardContent className="p-6 sm:p-8">

              {/* === Logika renderowania warunkowego w zakładce "url" === */}

              {/* 1. Widok wyników URL (jeśli są fetchedUrlItems i sitemapData) */}
              {fetchedUrlItems.length > 0 && sitemapData ? (
                <div className="sm:mt-12">
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold">Discovered URLs ({filteredUrlItems.length} / {totalFetchedUrlsCount})</h2>
                    {/* Przyciski Back to Sitemaps i New Search dla wyników URL */}
                    <div className="flex items-center gap-2">
                      {/* Ukryj "Back to Sitemaps" jeśli przyszliśmy z direct sitemap */}
                      {sitemapData.domain !== '(Direct Sitemap)' && (
                        <Button onClick={handleBackToSitemaps} variant="outline" className="h-10 px-6 rounded-lg text-gray-300 border-gray-700 hover:bg-gray-700/50">
                          Back to Sitemaps
                        </Button>
                      )}
                      <Button onClick={resetStateForNewSearch} variant="outline" className="h-10 px-6 rounded-lg text-gray-300 border-gray-700 hover:bg-gray-700/50">
                        New Search
                      </Button>
                    </div>
                  </div>
                  {/* UI Filtrów */}
                  <div className="bg-[#1e1e2d] p-4 sm:p-6 rounded-lg mb-6 border border-gray-700">
                    <h3 className="text-lg font-medium text-gray-100 mb-4">Filters</h3>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-4">
                      {/* ... UI dodawania filtrów ... */}
                      {filters.length > 0 && (
                        <div className="flex-shrink-0">
                          <Label htmlFor="next-operator" className="text-xs text-gray-400 block mb-1">Operator</Label>
                          <Select value={nextOperator} onValueChange={(v) => setNextOperator(v as 'AND' | 'OR')}>
                            <SelectTrigger id="next-operator" className="w-full sm:w-[80px] h-10 bg-[#13131a] border-gray-600 text-gray-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#13131a] border-gray-600 text-gray-100">
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex-shrink-0">
                        <Label htmlFor="filter-type" className="text-xs text-gray-400 block mb-1">Type</Label>
                        <Select value={newFilterType} onValueChange={(v) => setNewFilterType(v as any)}>
                          <SelectTrigger id="filter-type" className="w-full sm:w-[150px] h-10 bg-[#13131a] border-gray-600 text-gray-100">
                            <SelectValue placeholder="Filter type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#13131a] border-gray-600 text-gray-100">
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="not-contains">Not Contains</SelectItem>
                            <SelectItem value="regex">RegEx</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-grow">
                        <Label htmlFor="filter-value" className="text-xs text-gray-400 block mb-1">Value</Label>
                        <Input id="filter-value" placeholder={newFilterType === 'regex' ? "Enter RegEx pattern (case-insensitive)" : "Enter text to filter by"} value={newFilterValue} onChange={(e) => setNewFilterValue(e.target.value)} className="h-10 bg-[#13131a] border-gray-600 text-gray-100 placeholder-gray-500" />
                      </div>
                      <Button onClick={handleAddFilter} size="sm" className="h-10 px-4 bg-[#ff6b6b] hover:bg-[#ff5252] text-white mt-auto">Add Filter</Button>
                    </div>
                    {filters.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                        <p className="text-sm text-gray-400 mb-2">Active filters:</p>
                        {filters.map((filter, index) => (
                          <div key={filter.id} className="flex items-center justify-between bg-[#13131a] p-2 rounded">
                            <span className="text-xs text-gray-300 flex items-center gap-2 flex-wrap">
                              {index > 0 && filter.operator && <Badge variant="outline" className="border-gray-600 text-gray-400">{filter.operator}</Badge>}
                              <Badge variant="secondary" className="capitalize">{filter.type.replace('-', ' ')}</Badge>
                              <span className={`break-all ${filter.type === 'regex' ? 'font-mono' : ''}`}>{filter.value}</span>
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveFilter(filter.id)} className="text-gray-400 hover:text-red-500 hover:bg-transparent p-1 h-auto ml-2 flex-shrink-0"><Trash2 size={14} /></Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Tabela URL */}
                  <div className="overflow-hidden border border-gray-700 dark:border-gray-700 rounded-xl shadow-sm">
                    <div className="overflow-x-auto">
                      <Table>
                        {/* Poprawiony nagłówek tabeli URL bez spacji między tagami */}
                        <TableHeader className="bg-[#1e1e2d] dark:bg-[#1e1e2d]"><TableRow className="border-b border-gray-700 dark:border-gray-700"><TableHead className="w-1/3 font-semibold text-gray-100 dark:text-gray-100 text-sm sm:text-base px-6 py-4">Sitemap URL</TableHead><TableHead className="w-2/3 font-semibold text-gray-100 dark:text-gray-100 text-sm sm:text-base px-6 py-4">Page URL</TableHead></TableRow></TableHeader>
                        <TableBody className="bg-[#13131a] dark:bg-[#13131a]">
                          {displayedUrlItems.length > 0 ? (displayedUrlItems.map((item, index) => (
                            <TableRow key={`${item.sitemapUrl}-${item.pageUrl}-${index}`} className="hover:bg-[#1e1e2d] dark:hover:bg-[#1e1e2d] border-b border-gray-700 dark:border-gray-700 last:border-b-0">
                              <TableCell className="text-gray-400 dark:text-gray-400 px-6 py-3 text-xs break-all align-top">{item.sitemapUrl}</TableCell>
                              <TableCell className="text-gray-300 dark:text-gray-300 px-6 py-3 text-sm break-all align-top">
                                <a
                                  href={item.pageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-[#ff6b6b] hover:underline"
                                >
                                  {item.pageUrl}
                                </a>
                              </TableCell>
                            </TableRow>
                          ))) : (<TableRow> <TableCell colSpan={2} className="text-center text-gray-500 py-10"> {filters.length > 0 ? "No URLs found matching the current filters." : "No URLs were found for the selected sitemaps."} </TableCell> </TableRow>)}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  {/* Paginacja */}
                  <div className="flex items-center justify-end mt-6 flex-wrap gap-4"> {/* Zmieniono justify-between na justify-end */}
                    {/* Usunięto przyciski nawigacyjne z paginacji */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Rows per page:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-[70px] h-8 bg-[#1e1e2d] border-gray-700 text-gray-100">
                          <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e2d] border-gray-700 text-gray-100">
                          {[10, 25, 50, 100].map(size => (<SelectItem key={size} value={size.toString()} className="hover:bg-[#2a2a3a]">{size}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1} className="h-8 px-3 bg-[#1e1e2d] border-gray-700 hover:bg-[#2a2a3a] disabled:opacity-50">Previous</Button>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="h-8 px-3 bg-[#1e1e2d] border-gray-700 hover:bg-[#2a2a3a] disabled:opacity-50">Next</Button>
                      </div>
                    </div>
                  </div>

                  {/* Przycisk Process */}
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleProcessFilteredUrls}
                      disabled={isProcessing || (filteredUrlItems.length === 0 && totalFetchedUrlsCount > 0 && filters.length > 0) || totalFetchedUrlsCount === 0}
                      className="bg-green-600 hover:bg-green-700 text-white h-10 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={(filteredUrlItems.length === 0 && totalFetchedUrlsCount > 0 && filters.length > 0) ? "No URLs match filters" : ""}
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isProcessing ? t('processing_state') : tInterpolate('process_filtered_urls', { count: filteredUrlItems.length })}
                    </Button>
                  </div>
                </div>

                /* 2. Widok wyboru sitemap (jeśli nie ma URLi, ale jest sitemapData) */
              ) : sitemapData ? (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <div> <h3 className="text-lg font-medium text-gray-100">Select Sitemaps</h3> <p className="text-sm text-gray-400">Found {sitemapData.sitemap_count} sitemaps for <span className="font-medium text-gray-200">{sitemapData.domain}</span>.</p> </div>
                    {/* Przycisk New Search dla widoku sitemap */}
                    <Button onClick={resetStateForNewSearch} variant="outline" className="h-10 px-6 rounded-lg text-gray-300 border-gray-700 hover:bg-gray-700/50">
                      New Search
                    </Button>
                  </div>
                  {/* ... (Switch Select All) ... */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="select-all" checked={selectedSitemaps.size === sitemapData.sitemaps.length && sitemapData.sitemaps.length > 0} onCheckedChange={handleSelectAll} disabled={sitemapData.sitemaps.length === 0} />
                      <Label htmlFor="select-all" className="text-sm font-medium text-gray-300 dark:text-gray-300">{t('select_all')}</Label>
                    </div>
                  </div>
                  {/* ... (Tabela sitemap) ... */}
                  <div className="overflow-hidden border border-gray-700 dark:border-gray-700 rounded-xl shadow-sm">
                    <div className="overflow-x-auto max-h-[400px]">
                      <Table>
                        <TableHeader className="bg-[#1e1e2d] dark:bg-[#1e1e2d] sticky top-0 z-10">
                          <TableRow className="border-b border-gray-700 dark:border-gray-700">
                            <TableHead className="w-[60px] px-4 py-3"></TableHead>
                            <TableHead className="font-semibold text-gray-100 dark:text-gray-100 text-sm px-4 py-3">{t('sitemap_url_header')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-[#13131a] dark:bg-[#13131a]">
                          {sitemapData.sitemaps.length > 0 ? (
                            sitemapData.sitemaps.map((sitemap) => (
                              <TableRow key={sitemap} className="hover:bg-[#1e1e2d] dark:hover:bg-[#1e1e2d] border-b border-gray-700 dark:border-gray-700 last:border-b-0">
                                <TableCell className="px-4 py-2"><Switch checked={selectedSitemaps.has(sitemap)} onCheckedChange={(checked) => handleSitemapToggle(sitemap, checked)} /></TableCell>
                                <TableCell className="text-gray-300 dark:text-gray-300 px-4 py-2 text-sm break-all"><a href={sitemap} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6b6b] hover:underline flex items-center">{sitemap} <ExternalLink size={12} className="ml-1.5" /></a></TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow><TableCell colSpan={2} className="text-center text-gray-500 py-10">No sitemaps found for this domain.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  {/* Przycisk Fetch URLs */}
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleFetchUrls}
                      disabled={isProcessing || selectedSitemaps.size === 0}
                      className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white h-10 px-6 rounded-lg"
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isProcessing ? t('processing_state') : t('fetch_urls_for_selected_sitemaps')}
                    </Button>
                  </div>
                </div>
                /* 3. Widok formularza wprowadzania (jeśli nie ma sitemapData) */
              ) : (
                <form onSubmit={handleAutomaticSearch} className="space-y-6 sm:space-y-8 max-w-2xl mx-auto flex flex-col items-center">
                  {/* ... Formularz wprowadzania URL ... */}
                  <div className="flex items-center justify-center gap-3 mb-6"> <Button type="button" onClick={() => setInputType('domain_url')} variant={inputType === 'domain_url' ? "default" : "outline"} className={`px-4 py-2 rounded-md transition-colors ${inputType === 'domain_url' ? 'bg-[#ff6b6b] text-white border-[#ff6b6b]' : 'text-gray-400 border-gray-700 hover:bg-gray-700/50'}`}><Globe className="mr-2 h-4 w-4" />{t('domain')}</Button> <Button type="button" onClick={() => setInputType('sitemap_url')} variant={inputType === 'sitemap_url' ? "default" : "outline"} className={`px-4 py-2 rounded-md transition-colors ${inputType === 'sitemap_url' ? 'bg-[#ff6b6b] text-white border-[#ff6b6b]' : 'text-gray-400 border-gray-700 hover:bg-gray-700/50'}`}><Layout className="mr-2 h-4 w-4" />{t('sitemap')}</Button> </div>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      id="url"
                      name="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={inputType === 'domain_url' ? t('enter_domain_url') : t('enter_sitemap_url')}
                      className="w-full h-12 px-4 text-gray-100 bg-[#13131a] border-gray-700 rounded-lg focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="mt-4 h-10 px-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-100 bg-[#ff6b6b] rounded-lg hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <SearchIcon className="w-5 h-5" />
                        <span>{t('check_for_me')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="w-full">
          <Card className="bg-[#13131a]/70 dark:bg-[#13131a]/70 backdrop-blur-sm border-none shadow-md rounded-xl w-full">
            <CardContent className="p-6 sm:p-8">
              {processingProjectId ? (
                <ProcessingDisplay projectId={processingProjectId} />
              ) : (
                <p className="text-gray-500 text-center py-10">
                  {t('processing_tab_placeholder') || 'Start a project from the URL Source tab to see processing progress here.'}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SitemapSearch;
