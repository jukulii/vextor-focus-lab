import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Check, AlertCircle, ExternalLink, X, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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

interface UrlResponse {
  url: string;
  sitemap_url?: string;
}

interface FilterCondition {
  id: string;
  field: 'url' | 'sitemap_url';
  operator: 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'regex';
  value: string;
  valid: boolean;
  logicalOperator: 'AND' | 'OR';
}

const SitemapsList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [showingUrls, setShowingUrls] = useState(false);
  const [responseUrls, setResponseUrls] = useState<UrlResponse[]>([]);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtering and pagination state
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State to track checked sitemaps
  const [checkedSitemaps, setCheckedSitemaps] = useState<Record<string, boolean>>({});

  // Odbierz dane przekazane przez state
  const apiData: ApiResponse = location.state?.sitemapData;

  // Jeśli dane nie są dostępne, wyświetl komunikat
  if (!apiData) {
    return <div>No data available</div>;
  }

  const { projectId, urls } = apiData;
  const { domain, sitemaps, sitemap_count, execution_time } = urls;

  // Initialize checked state for sitemaps if it's empty
  if (Object.keys(checkedSitemaps).length === 0 && sitemaps.length > 0 && !showingUrls) {
    const initialCheckedState: Record<string, boolean> = {};
    sitemaps.forEach(url => {
      initialCheckedState[url] = true; // All checkboxes are checked by default
    });
    setCheckedSitemaps(initialCheckedState);
  }

  // Handle checkbox change
  const handleCheckboxChange = (sitemapUrl: string) => {
    setCheckedSitemaps(prev => ({
      ...prev,
      [sitemapUrl]: !prev[sitemapUrl]
    }));
  };

  // Handle select/deselect all
  const handleSelectAll = () => {
    // Check if all items are currently selected
    const allSelected = sitemaps.every(url => checkedSitemaps[url]);

    // Create new state object with all items selected or deselected
    const newState: Record<string, boolean> = {};
    sitemaps.forEach(url => {
      newState[url] = !allSelected;
    });

    setCheckedSitemaps(newState);
  };

  // Check if all items are selected
  const areAllSelected = sitemaps.length > 0 && sitemaps.every(url => checkedSitemaps[url]);

  // Przygotuj dane do wysłania - only include checked sitemaps
  const sitemapsToSave = sitemaps
    .filter(sitemapUrl => checkedSitemaps[sitemapUrl])
    .map(sitemapUrl => ({
      url: sitemapUrl,
    }));

  const handleSaveSitemaps = async () => {
    // Check if there are any sitemaps selected
    if (sitemapsToSave.length === 0) {
      alert(t('select_at_least_one_sitemap') || 'Please select at least one sitemap');
      return;
    }

    setIsSaving(true);
    setResponseError(null);
    console.log('Saving selected sitemaps:', sitemapsToSave);

    try {
      const token = localStorage.getItem('vextor-token');

      if (!token) {
        throw new Error('No token found');
      }

      // Prepare request data with only the checked sitemaps
      const requestData = {
        projectId,
        sitemaps: sitemapsToSave,
      };

      console.log('Sending request with data:', requestData);

      // Wyślij dane na endpoint /save-sitemaps
      const response = await axios.post<UrlResponse[]>(
        `${import.meta.env.VITE_API_URL}/save-sitemaps`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Sitemaps saved successfully:', response.data);

      // Show the URLs in the response
      setResponseUrls(response.data);
      setShowingUrls(true);
    } catch (error) {
      console.error('Error saving sitemaps:', error);
      setResponseError(error instanceof Error ? error.message : 'Failed to save sitemaps');
    } finally {
      setIsSaving(false);
    }
  };

  // Count checked sitemaps
  const checkedCount = sitemaps.filter(url => checkedSitemaps[url]).length;

  // Go back to sitemap selection
  const handleBackToSitemaps = () => {
    setShowingUrls(false);
  };

  // Custom checkbox component
  const CustomCheckbox = ({ checked, onChange, id }: { checked: boolean; onChange: () => void; id?: string }) => (
    <div
      className={`flex items-center justify-center w-5 h-5 rounded border cursor-pointer transition-all duration-200 
        ${checked
          ? 'bg-blue-500 border-blue-500 text-white'
          : 'border-gray-300 bg-white hover:border-blue-400'}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering the row click handler
        onChange();
      }}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
      {id && <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />}
    </div>
  );

  // Add a new filter condition
  const addFilterCondition = () => {
    const newId = `filter-${Date.now()}`;
    setFilterConditions([
      ...filterConditions,
      {
        id: newId,
        field: 'url',
        operator: 'contains',
        value: '',
        valid: false,
        logicalOperator: filterConditions.length > 0 ? 'AND' : 'OR' // Default to AND for second+ conditions
      }
    ]);
  };

  // Remove a filter condition
  const removeFilterCondition = (id: string) => {
    setFilterConditions(filterConditions.filter(condition => condition.id !== id));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Update a filter condition
  const updateFilterCondition = (id: string, updates: Partial<FilterCondition>) => {
    setFilterConditions(
      filterConditions.map(condition =>
        condition.id === id
          ? {
            ...condition,
            ...updates,
            // Set validity based on having a non-empty value
            valid: updates.value !== undefined
              ? updates.value.trim().length > 0
              : condition.value.trim().length > 0
          }
          : condition
      )
    );
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Apply filter to the URLs
  const filteredUrls = useMemo(() => {
    if (!responseUrls.length || !filterConditions.length) return responseUrls;

    return responseUrls.filter(urlItem => {
      // Apply each filter condition with the appropriate logical operator
      return filterConditions.reduce((passes, condition, index) => {
        if (!condition.valid) return passes;

        const fieldValue = condition.field === 'url' ? urlItem.url : urlItem.sitemap_url || '';
        let conditionResult = false;

        try {
          switch (condition.operator) {
            case 'contains':
              conditionResult = fieldValue.includes(condition.value);
              break;
            case 'not_contains':
              conditionResult = !fieldValue.includes(condition.value);
              break;
            case 'starts_with':
              conditionResult = fieldValue.startsWith(condition.value);
              break;
            case 'ends_with':
              conditionResult = fieldValue.endsWith(condition.value);
              break;
            case 'regex':
              {
                const regex = new RegExp(condition.value);
                conditionResult = regex.test(fieldValue);
              }
              break;
          }
        } catch (error) {
          // If regex is invalid, consider condition as not met
          conditionResult = false;
        }

        // First condition doesn't have a logical operator
        if (index === 0) return conditionResult;

        // Apply the logical operator (AND/OR)
        if (condition.logicalOperator === 'AND') {
          return passes && conditionResult;
        } else {
          return passes || conditionResult;
        }
      }, true); // Start with true for first condition check
    });
  }, [responseUrls, filterConditions]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const paginatedUrls = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUrls.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUrls, currentPage, itemsPerPage]);

  // Page navigation
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page
  };

  // Render filter UI
  const renderFilterUI = () => {
    if (!showingUrls) return null;

    return (
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center">
            <Filter size={16} className="mr-1" />
            {t('url_filters') || 'URL Filters'}
          </h3>

          <Button
            variant="outline"
            size="sm"
            onClick={addFilterCondition}
            className="h-8 text-xs"
          >
            <Plus size={14} className="mr-1" /> {t('add_filter') || 'Add Filter'}
          </Button>
        </div>

        {filterConditions.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            {t('no_filters') || 'No filters applied. Click "Add Filter" to create one.'}
          </div>
        )}

        {filterConditions.map((condition, index) => (
          <div key={condition.id} className="flex flex-wrap gap-2 items-center p-2 bg-gray-50 rounded border">
            {index > 0 && (
              <Select
                value={condition.logicalOperator}
                onValueChange={(value) =>
                  updateFilterCondition(condition.id, { logicalOperator: value as 'AND' | 'OR' })
                }
              >
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select
              value={condition.field}
              onValueChange={(value) =>
                updateFilterCondition(condition.id, { field: value as 'url' | 'sitemap_url' })
              }
            >
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="sitemap_url">Sitemap</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={condition.operator}
              onValueChange={(value) =>
                updateFilterCondition(condition.id, {
                  operator: value as FilterCondition['operator']
                })
              }
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">{t('contains') || 'Contains'}</SelectItem>
                <SelectItem value="not_contains">{t('not_contains') || 'Does not contain'}</SelectItem>
                <SelectItem value="starts_with">{t('starts_with') || 'Starts with'}</SelectItem>
                <SelectItem value="ends_with">{t('ends_with') || 'Ends with'}</SelectItem>
                <SelectItem value="regex">{t('regex') || 'RegEx match'}</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={condition.value}
              onChange={(e) => updateFilterCondition(condition.id, { value: e.target.value })}
              placeholder={condition.operator === 'regex' ? '/pattern/' : 'Filter value...'}
              className="flex-1 h-8 text-xs"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilterCondition(condition.id)}
              className="w-8 h-8 p-0"
            >
              <X size={14} />
            </Button>
          </div>
        ))}

        {filterConditions.length > 0 && (
          <div className="flex items-center text-sm mt-2">
            <Badge variant="secondary" className="mr-2">
              {filteredUrls.length} of {responseUrls.length} {t('urls_matching') || 'URLs matching'}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Render pagination controls
  const renderPagination = () => {
    if (!showingUrls || filteredUrls.length === 0) return null;

    return (
      <div className="flex items-center justify-between py-2 border-t mt-4">
        <div className="flex items-center gap-2 text-sm">
          <span>{t('show') || 'Show'}</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>{t('per_page') || 'per page'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">
            {t('page_of_total') || 'Page'} {currentPage} {t('of') || 'of'} {totalPages}
          </span>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none border-l-0"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Handle continue to processing
  const handleContinueToProcessing = async () => {
    // Check if there are any URLs to process
    if (filteredUrls.length === 0) {
      alert(t('no_urls_to_process') || 'There are no URLs to process');
      return;
    }

    setIsProcessing(true);
    setResponseError(null);

    try {
      const token = localStorage.getItem('vextor-token');

      if (!token) {
        throw new Error('No token found');
      }

      // Reset URLs count before sending batches
      console.log('Resetting URLs count for project ID:', projectId);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-urls-count`,
        { projectId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('URLs count reset successfully');

      const batchSize = 500;
      const batches = [];
      let allResponseData = [];

      // Split URLs into batches of 500
      for (let i = 0; i < filteredUrls.length; i += batchSize) {
        batches.push(filteredUrls.slice(i, i + batchSize));
      }

      console.log(`Splitting ${filteredUrls.length} URLs into ${batches.length} batches of max ${batchSize}`);

      // Process each batch sequentially
      for (let i = 0; i < batches.length; i++) {
        const batchUrls = batches[i];
        console.log(`Processing batch ${i + 1}/${batches.length} with ${batchUrls.length} URLs`);

        // Prepare request data with the current batch of URLs
        const requestData = {
          projectId,
          urls: batchUrls
        };

        // Send data to the create-urls endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-urls`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`Batch ${i + 1} processed successfully:`, response.data);

        // Collect response data from each batch
        if (Array.isArray(response.data)) {
          allResponseData = [...allResponseData, ...response.data];
        } else {
          // If response is not an array, still add it to our results
          allResponseData.push(response.data);
        }
      }

      console.log('All URL batches processed successfully, total URLs:', allResponseData.length);

      // Navigate to processing page with combined response data
      navigate('/processing', { state: { processingData: allResponseData } });
    } catch (error) {
      console.error('Error processing URLs:', error);
      setResponseError(error instanceof Error ? error.message : 'Failed to process URLs');
      // Stay on current page to show the error
    } finally {
      setIsProcessing(false);
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
                      {showingUrls
                        ? t('found_urls').replace('%count%', responseUrls.length.toString()) || `Found ${responseUrls.length} URLs`
                        : t('found_sitemaps').replace('%count%', sitemap_count.toString())}
                    </p>
                    <p className="mt-2 text-green-700">
                      Domain: {domain} | Execution time: {execution_time}
                    </p>
                  </div>
                </div>

                {responseError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm flex items-start">
                    <div className="flex-shrink-0 text-red-500 mt-0.5">
                      <AlertCircle size={20} />
                    </div>
                    <div className="ml-3">
                      <p className="text-red-800">
                        Error: {responseError}
                      </p>
                    </div>
                  </div>
                )}

                {showingUrls && renderFilterUI()}

                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {!showingUrls ? (
                          <>
                            <TableHead className="w-16 text-center">
                              <div className="flex justify-center">
                                <CustomCheckbox checked={areAllSelected} onChange={handleSelectAll} />
                              </div>
                            </TableHead>
                            <TableHead>{t('site_map')}</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead className="w-1/3">Sitemap</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead className="w-10"></TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!showingUrls ? (
                        sitemaps.map((sitemapUrl, index) => (
                          <TableRow
                            key={index}
                            className="group transition-colors hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleCheckboxChange(sitemapUrl)}
                          >
                            <TableCell className="w-16">
                              <div className="flex justify-center">
                                <CustomCheckbox
                                  id={`sitemap-${index}`}
                                  checked={checkedSitemaps[sitemapUrl] || false}
                                  onChange={() => handleCheckboxChange(sitemapUrl)}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium truncate group-hover:text-blue-600">
                              <label htmlFor={`sitemap-${index}`} className="cursor-pointer block w-full">
                                {sitemapUrl}
                              </label>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        paginatedUrls.length > 0 ? (
                          paginatedUrls.map((urlItem, index) => {
                            const rowIndex = (currentPage - 1) * itemsPerPage + index + 1;
                            return (
                              <TableRow key={rowIndex} className="hover:bg-gray-50">
                                <TableCell className="font-medium w-10">{rowIndex}</TableCell>
                                <TableCell className="truncate text-gray-600 text-sm w-1/3">
                                  {urlItem.sitemap_url || '-'}
                                </TableCell>
                                <TableCell className="truncate">
                                  {urlItem.url}
                                </TableCell>
                                <TableCell className="w-10 text-right">
                                  <a
                                    href={urlItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              {filterConditions.length > 0
                                ? t('no_matching_urls') || 'No URLs match your filters'
                                : responseError
                                  ? 'No URLs available due to an error'
                                  : 'No URLs found'
                              }
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>

                {showingUrls && renderPagination()}

                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm">
                  <p className="text-green-800">
                    {!showingUrls ? (
                      <>
                        {t('found_sitemaps').replace('%count%', sitemap_count.toString())}
                        {sitemap_count > 0 && ` (${checkedCount} selected)`}
                      </>
                    ) : (
                      <>Found {responseUrls.length} URLs from sitemaps</>
                    )}
                  </p>
                </div>

                <div className="flex justify-center mt-4">
                  {!showingUrls ? (
                    <Button
                      onClick={handleSaveSitemaps}
                      disabled={isSaving || checkedCount === 0}
                      className="bg-blue-500 hover:bg-blue-600 px-8"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        t('next')
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-4">
                      <Button
                        onClick={handleBackToSitemaps}
                        variant="outline"
                        className="px-6"
                      >
                        Back to Sitemaps
                      </Button>
                      <Button
                        onClick={handleContinueToProcessing}
                        className="bg-blue-500 hover:bg-blue-600 px-8"
                        disabled={isProcessing || filteredUrls.length === 0}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Continue to Processing'
                        )}
                      </Button>
                    </div>
                  )}
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
                    <CustomCheckbox checked={true} onChange={() => { }} />
                    <label htmlFor="blog" className="cursor-pointer">Blog posts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox checked={true} onChange={() => { }} />
                    <label htmlFor="product" className="cursor-pointer">Product pages</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox checked={true} onChange={() => { }} />
                    <label htmlFor="category" className="cursor-pointer">Category pages</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox checked={true} onChange={() => { }} />
                    <label htmlFor="landing" className="cursor-pointer">Landing pages</label>
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