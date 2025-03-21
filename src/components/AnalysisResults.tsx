import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { LayoutDashboard, Search, Copy, GanttChart, Compass, Link2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const AnalysisResults = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);

  const gaugeData = [
    { name: 'value', value: 55 }
  ];

  const focusedPagesData = [
    { id: 1, url: 'example.com/blog/post-1', proximity: 95 },
    { id: 2, url: 'example.com/blog/post-2', proximity: 92 },
    { id: 3, url: 'example.com/blog/post-3', proximity: 88 },
    { id: 4, url: 'example.com/blog/post-4', proximity: 85 },
    { id: 5, url: 'example.com/blog/post-5', proximity: 82 },
  ];

  const divergentPagesData = [
    { id: 1, url: 'example.com/about', proximity: 45 },
    { id: 2, url: 'example.com/contact', proximity: 48 },
    { id: 3, url: 'example.com/services', proximity: 52 },
    { id: 4, url: 'example.com/faq', proximity: 55 },
    { id: 5, url: 'example.com/terms', proximity: 58 },
  ];

  const contentTypesData = [
    { name: 'Blog', value: 45, color: '#4CAF50' },
    { name: 'Product', value: 25, color: '#2196F3' },
    { name: 'Category', value: 15, color: '#FF9800' },
    { name: 'Support', value: 10, color: '#E91E63' },
    { name: 'Landing', value: 5, color: '#8BC34A' },
  ];

  const distributionData = Array.from({ length: 20 }, (_, i) => ({
    name: i.toString(),
    value: Math.floor(Math.random() * 50) + 10
  }));

  const urlToCentroidData = [
    { id: 0, url: 'Senuto.com', proximity: 0.5 },
    { id: 1, url: 'Senuto.com', proximity: 0.5 },
    { id: 2, url: 'Senuto.com', proximity: 0.5 },
    { id: 3, url: 'Senuto.com', proximity: 0.5 },
    { id: 4, url: 'Senuto.com', proximity: 0.5 },
    { id: 5, url: 'Senuto.com/blog', proximity: 0.4 },
    { id: 6, url: 'Senuto.com/about', proximity: 0.3 },
    { id: 7, url: 'Senuto.com/contact', proximity: 0.2 },
    { id: 8, url: 'Senuto.com/pricing', proximity: 0.1 },
  ];

  const urlSimilarityData = [
    { id: 0, url1: 'Senuto.com/blog/seo-tips', url2: 'Senuto.com/blog/seo-guide', score: 0.9 },
    { id: 1, url1: 'Senuto.com/features', url2: 'Senuto.com/features-overview', score: 0.9 },
    { id: 2, url1: 'Senuto.com/pricing/monthly', url2: 'Senuto.com/pricing/annual', score: 0.9 },
    { id: 3, url1: 'Senuto.com/blog/content-marketing', url2: 'Senuto.com/blog/content-strategy', score: 0.9 },
    { id: 4, url1: 'Senuto.com/tools/keyword-research', url2: 'Senuto.com/tools/keyword-finder', score: 0.9 },
  ];

  const clusterData = Array.from({ length: 300 }, () => ({
    x: Math.random() * 160 - 80,
    y: Math.random() * 120 - 60,
    z: Math.random() * 0.4 + 0.5,
  }));

  const cluster1 = clusterData.slice(0, 100).map(item => ({
    ...item,
    x: item.x * 0.7,
    y: item.y * 0.7 + 15,
    z: item.z + 0.2,
    cluster: 1
  }));
  
  const cluster2 = clusterData.slice(100, 200).map(item => ({
    ...item,
    x: item.x * 0.6 - 10,
    y: item.y * 0.6 - 20,
    z: item.z + 0.1,
    cluster: 2
  }));
  
  const cluster3 = clusterData.slice(200, 300).map(item => ({
    ...item,
    x: item.x * 0.5 + 40,
    y: item.y * 0.5 + 5,
    z: item.z,
    cluster: 3
  }));
  
  const allClusterData = [...cluster1, ...cluster2, ...cluster3];

  const totalPages = 10;
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  const explorationPages = [
    { id: 1, title: "Homepage Exploration", createdAt: "2023-06-15" },
    { id: 2, title: "Blog Section Analysis", createdAt: "2023-06-16" },
    { id: 3, title: "Product Pages Overview", createdAt: "2023-06-17" },
    { id: 4, title: "Category Structure", createdAt: "2023-06-18" },
    { id: 5, title: "Navigation Path Analysis", createdAt: "2023-06-19" },
  ];

  const renderGauge = (value: number) => {
    const colors = ["#FF5252", "#FFA726", "#66BB6A"];
    let fillColor;
    if (value < 40) fillColor = colors[0];
    else if (value < 70) fillColor = colors[1];
    else fillColor = colors[2];

    return (
      <div className="relative w-44 h-44 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50,50 m 0,-40 a 40,40 0 1 1 0,80 a 40,40 0 1 1 0,-80"
            stroke="#E0E0E0"
            strokeWidth="8"
            fillOpacity="0"
          />
          <path
            d="M 50,50 m 0,-40 a 40,40 0 1 1 0,80 a 40,40 0 1 1 0,-80"
            stroke={fillColor}
            strokeWidth="8"
            fillOpacity="0"
            strokeDasharray={`${value * 2.51}, 251`}
            transform="rotate(-90, 50, 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{value}</span>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{`${payload[0].name || ''}`}</p>
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const ClusterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{`Cluster: ${data.cluster}`}</p>
          <p className="text-sm">{`Distance: ${data.z.toFixed(2)}`}</p>
          <p className="text-sm">{`Position: (${data.x.toFixed(1)}, ${data.y.toFixed(1)})`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t('site_map')}</span>
            <span className="font-medium">Semrush.com</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">{t('url_to_centroid')}</span>
          <span className="font-medium">550</span>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        className="w-full" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full border-b mb-6 bg-transparent p-0 h-auto">
          <div className="flex space-x-2 overflow-x-auto">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger 
              value="url-analysis" 
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2"
            >
              <Search className="h-4 w-4" />
              {t('url_analysis')}
            </TabsTrigger>
            <TabsTrigger 
              value="canonicalization" 
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2"
            >
              <Link2 className="h-4 w-4" />
              {t('canonicalization')}
            </TabsTrigger>
            <TabsTrigger 
              value="clusters" 
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2"
            >
              <GanttChart className="h-4 w-4" />
              {t('classes')}
            </TabsTrigger>
            <TabsTrigger 
              value="exploration" 
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2"
            >
              <Compass className="h-4 w-4" />
              {t('exploration')}
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                    {t('site_focus')}
                  </div>
                  {renderGauge(55)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                    {t('page_focus')}
                  </div>
                  {renderGauge(55)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-4">
                  {t('content_url')}
                </div>
                <p className="text-center font-medium mb-6">semrush.com/blog</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-4">{t('top_focused_pages')}</h3>
                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>{t('url')}</TableHead>
                        <TableHead className="text-right">{t('proximity')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {focusedPagesData.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>{page.id}</TableCell>
                          <TableCell className="font-medium truncate max-w-[200px]">
                            {page.url}
                          </TableCell>
                          <TableCell className="text-right">{page.proximity}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-4">{t('top_divergent_pages')}</h3>
                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>{t('url')}</TableHead>
                        <TableHead className="text-right">{t('proximity')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {divergentPagesData.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>{page.id}</TableCell>
                          <TableCell className="font-medium truncate max-w-[200px]">
                            {page.url}
                          </TableCell>
                          <TableCell className="text-right">{page.proximity}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-4">{t('content_types')}</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentTypesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {contentTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-4">{t('summary')}</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="url-analysis">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">{t('url_analysis')}</h3>
              <p className="text-gray-600 mb-6">
                {t('url_analysis_description')}
              </p>
              
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">{t('urls_to_centroid')}</h4>
                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>{t('url')}</TableHead>
                        <TableHead className="text-right">{t('proximity_to_centroid')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urlToCentroidData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-medium">{item.url}</TableCell>
                          <TableCell className="text-right">{item.proximity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="canonicalization">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">{t('canonicalization')}</h3>
              <p className="text-gray-600 mb-6">
                {t('canonicalization_description') || 'Identification of duplicate or similar content across the site.'}
              </p>
              
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">{t('urls_to_centroid') || "URL's to centroid"}</h4>
                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>{t('url')} 1</TableHead>
                        <TableHead>{t('url')} 2</TableHead>
                        <TableHead className="text-right">{t('similarity_score') || 'Similarity score'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urlSimilarityData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-medium">{item.url1}</TableCell>
                          <TableCell className="font-medium">{item.url2}</TableCell>
                          <TableCell className="text-right">{item.score}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionData.slice(0, 10)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionData.slice(10, 20)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clusters">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">{t('classes')}</h3>
              <p className="text-gray-600 mb-6">
                {t('cluster_description') || 'Visual representation of content clusters and their relationships.'}
              </p>
              
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">2D t-SNE Projection of Pages</h4>
                <div className="h-[600px] border rounded-lg p-4 bg-white">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 50, bottom: 20, left: 20 }}
                    >
                      <XAxis type="number" dataKey="x" name="X" domain={[-80, 80]} tickCount={9} />
                      <YAxis type="number" dataKey="y" name="Y" domain={[-60, 60]} tickCount={7} />
                      <ZAxis type="number" dataKey="z" range={[20, 500]} name="Distance" />
                      <Tooltip content={<ClusterTooltip />} />
                      <Scatter 
                        name="Cluster 1" 
                        data={cluster1} 
                        fill="#E57373"
                      />
                      <Scatter 
                        name="Cluster 2" 
                        data={cluster2} 
                        fill="#FFB74D"
                      />
                      <Scatter 
                        name="Cluster 3" 
                        data={cluster3} 
                        fill="#81C784"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-base font-medium mb-2">Cluster 1</h4>
                    <div className="h-4 w-16 bg-red-400 rounded mb-2"></div>
                    <p className="text-sm text-gray-600">
                      217 URLs (39.1%)
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Primary content pattern: Product pages
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-base font-medium mb-2">Cluster 2</h4>
                    <div className="h-4 w-16 bg-orange-400 rounded mb-2"></div>
                    <p className="text-sm text-gray-600">
                      193 URLs (34.8%)
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Primary content pattern: Blog posts
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-base font-medium mb-2">Cluster 3</h4>
                    <div className="h-4 w-16 bg-green-400 rounded mb-2"></div>
                    <p className="text-sm text-gray-600">
                      146 URLs (26.1%)
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Primary content pattern: Support pages
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exploration">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">{t('exploration')}</h3>
              <p className="text-gray-600 mb-6">
                Interactive exploration of content relationships.
              </p>
              
              <div className="relative border rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/64f106cc-ac24-48a4-8ed0-2f2374a623aa.png" 
                  alt="Graph visualization" 
                  className="w-full h-auto"
                />
                <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-75 p-2 rounded text-white text-xs">
                  {t('exploration')} {currentPage} / {totalPages}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-4">{t('exploration_details')}</h4>
                <div className="overflow-hidden border rounded-md mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>{t('title')}</TableHead>
                        <TableHead className="text-right">{t('date')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {explorationPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>{page.id}</TableCell>
                          <TableCell className="font-medium">{page.title}</TableCell>
                          <TableCell className="text-right">{page.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      let pageNumber = currentPage;
                      
                      if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }
                      
                      if (pageNumber < 1 || pageNumber > totalPages) {
                        return null;
                      }
                      
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === currentPage}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
