import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

// Define the shape of a URL record fetched from Supabase
interface ProcessedUrl {
  url: string;
}

// Hook to handle real-time project progress updates
const useProjectProgress = (projectId: string | null) => {
  const [progress, setProgress] = useState(0);
  const [urlsCount, setUrlsCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processedUrls, setProcessedUrls] = useState<string[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState<boolean>(false);
  const [hasFetchedUrls, setHasFetchedUrls] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId) {
      console.error('ProcessingPage: Project ID is missing!');
      return;
    }
    console.log('ProcessingPage: Using projectId:', projectId);

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
        'postgres_changes', // Listen to database changes
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}` // Filter for the specific project
        },
        (payload) => {
          console.log('ProcessingPage: Received realtime payload:', payload); // Log received payload
          // Safely access properties from the payload
          const updatedProject = payload.new as { processed_urls_count?: number; urls_count?: number };

          // Ensure the necessary fields exist and are numbers before calculating progress
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
            setProgress(0); // Reset progress if urls_count is 0
          }
        }
      )
      .subscribe((status) => {
        // Log subscription status changes
        console.log(`ProcessingPage: Supabase channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('ProcessingPage: Successfully subscribed to project updates!');
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('ProcessingPage: Supabase channel subscription error or timed out.');
        }
      });

    // Clean up subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel); // Use removeChannel
      }
    };
  }, [projectId]);

  // Effect to fetch processed URLs when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && projectId && !hasFetchedUrls && !isLoadingUrls) {
      const fetchProcessedUrls = async () => {
        setIsLoadingUrls(true);
        console.log('ProcessingPage: Progress reached 100%. Fetching processed URLs using join...');
        try {
          // Fetch URLs with non-null embedding using an inner join to filter by project_id
          const { data: urlData, error: urlError } = await supabase
            .from('urls')
            .select('url, sitemaps!inner(project_id)') // Select URL, use join for filtering
            .not('embedding_title_desc', 'is', null)  // Check for non-null embedding
            .eq('sitemaps.project_id', projectId);    // Filter by project_id via join

          if (urlError) {
            console.error('Error fetching processed URLs with join:', urlError);
            setProcessedUrls([]); // Clear or handle error state appropriately
          } else if (urlData) {
            // urlData might contain duplicates if a URL belongs to multiple sitemaps in the project.
            // Create a Set to store unique URLs.
            const uniqueUrls = new Set(urlData.map((item: ProcessedUrl) => item.url));
            console.log('ProcessingPage: Fetched unique processed URLs:', Array.from(uniqueUrls));
            setProcessedUrls(Array.from(uniqueUrls)); // Convert Set back to array
          } else {
            setProcessedUrls([]); // Handle case where no data is returned
          }
        } catch (err) {
          console.error('Unexpected error fetching processed URLs with join:', err);
          setProcessedUrls([]);
        } finally {
          setIsLoadingUrls(false);
          setHasFetchedUrls(true); // Mark as fetched regardless of success/failure
        }
      };

      fetchProcessedUrls();
    }
    // Reset URLs and fetch flag if progress drops below 100
    else if (progress < 100) {
      setProcessedUrls([]);
      setHasFetchedUrls(false);
    }
  }, [progress, projectId, hasFetchedUrls, isLoadingUrls]);

  return { progress, urlsCount, processedCount, processedUrls, isLoadingUrls };
};

const ProcessingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract projectId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('projectId');

  // Use the real-time progress hook
  const { progress, urlsCount, processedCount, processedUrls, isLoadingUrls } = useProjectProgress(projectId);

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    // // Redirect when progress reaches 100% - DISABLED
    // if (progress >= 100) {
    //   const timer = setTimeout(() => {
    //     // TODO: Navigate to the results page, potentially passing projectId
    //     navigate(`/results?projectId=${projectId}`);
    //   }, 500); // Short delay before redirecting
    //   return () => clearTimeout(timer);
    // }
  }, []); // Changed dependencies to empty array for mount-only execution

  // Display loading or error if projectId is missing
  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error: Project ID is missing.</p>
        {/* Optionally add a link back or redirect logic */}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isDark={false} />
        <main className="flex-grow p-6">
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
                      {/* Display different message based on progress */}
                      {progress < 100 ? t('converting_content') : t('processing_complete')}
                    </p>
                  </div>
                  {/* Section to display processed URLs */}
                  {progress >= 100 && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                        {t('processed_urls_list_title')}
                      </h3>
                      {isLoadingUrls ? (
                        <p className="text-center text-gray-600 dark:text-gray-400">{t('loading_urls')}</p>
                      ) : processedUrls.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 px-4">
                          {processedUrls.map((url, index) => (
                            <li key={index}>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-center text-gray-600 dark:text-gray-400">{t('no_processed_urls_found')}</p>
                      )}
                    </div>
                  )}
                  {/* Button to navigate to results page when complete */}
                  {progress >= 100 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => navigate(`/results?projectId=${projectId}`)}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={isLoadingUrls} // Disable button while URLs are loading initially
                      >
                        {t('view_results_button')}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcessingPage;
