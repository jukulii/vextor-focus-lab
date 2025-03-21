
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, Search, Copy, GanttChart, Compass } from 'lucide-react';

const AnalysisResults = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
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

  const renderGauge = (value: number) => {
    // Colors for the gauge
    const colors = ["#FF5252", "#FFA726", "#66BB6A"]; // Red, orange, green
    
    // Calculate the color based on the value
    let fillColor;
    if (value < 40) fillColor = colors[0];
    else if (value < 70) fillColor = colors[1];
    else fillColor = colors[2];

    return (
      <div className="relative w-44 h-44 mx-auto">
        {/* Background circle */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50,50 m 0,-40 a 40,40 0 1 1 0,80 a 40,40 0 1 1 0,-80"
            stroke="#E0E0E0"
            strokeWidth="8"
            fillOpacity="0"
          />
          {/* Value arc */}
          <path
            d="M 50,50 m 0,-40 a 40,40 0 1 1 0,80 a 40,40 0 1 1 0,-80"
            stroke={fillColor}
            strokeWidth="8"
            fillOpacity="0"
            strokeDasharray={`${value * 2.51}, 251`}
            transform="rotate(-90, 50, 50)"
          />
        </svg>
        {/* Value text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{value}</span>
        </div>
      </div>
    );
  };

  // Custom tooltip component for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{`${label || ''}`}</p>
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
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
              <Copy className="h-4 w-4" />
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
                Analysis of individual URLs and their content focus.
              </p>
              
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
                Identification of duplicate or similar content across the site.
              </p>
              
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
                Content clusters and their relationships.
              </p>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentTypesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
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
        </TabsContent>
        
        <TabsContent value="exploration">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">{t('exploration')}</h3>
              <p className="text-gray-600 mb-6">
                Interactive exploration of content relationships.
              </p>
              
              <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center h-96">
                <p className="text-gray-500 text-center">
                  {t('exploration')} - {t('summary')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
