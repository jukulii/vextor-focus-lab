import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import HighchartsGauge from '@/components/HighchartsGauge';
import HighchartsDonut from '@/components/HighchartsDonut';
import HighchartsAreaChart from '@/components/HighchartsAreaChart';
import VantaBackground from '@/components/VantaBackground';
import HighchartsTreeMap from '@/components/HighchartsTreeMap';
import axios from 'axios';

interface TopUrl {
  url: string;
  proximity: number;
}

interface HistogramData {
  [key: string]: number;
}

interface PageTypeDistribution {
  core_content: { count: number; percentage: number };
  supporting_pages: { count: number; percentage: number };
  peripheral_pages: { count: number; percentage: number };
  total_pages: number;
}

interface ApiResponse {
  site_focus: number;
  site_radius: number;
  top_focused_urls: TopUrl[];
  top_divergent_urls: TopUrl[];
  histogram_data: HistogramData;
  page_type_distribution: PageTypeDistribution;
  processing_time: string;
}

const generateScatterData = (count = 400) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 2 - 1) * 60;
    const y = (Math.random() * 2 - 1) * 60;

    const distFromCenter = Math.sqrt(x * x + y * y) / 85;
    const proximity = Math.max(0.5, Math.min(0.9, 1 - distFromCenter));

    data.push({ x, y, proximity });
  }

  for (let i = 0; i < count / 5; i++) {
    const x = 50 + (Math.random() * 2 - 1) * 15;
    const y = (Math.random() * 2 - 1) * 30;
    const proximity = Math.max(0.5, Math.min(0.8, 0.6 + Math.random() * 0.2));

    data.push({ x, y, proximity });
  }

  return data;
};

const ResultsPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    site_focus: {
      pl: "Skupienie witryny",
      en: "Site Focus"
    },
    site_radius: {
      pl: "Promień oddziaływania",
      en: "Site Radius"
    },
    top_focused_pages: {
      pl: "Top 10 Najbardziej Skupionych Stron",
      en: "Top 10 Most Focused Pages"
    },
    top_divergent_pages: {
      pl: "Top 10 Najbardziej Rozbieżnych Stron",
      en: "Top 10 Most Divergent Pages"
    },
    page: {
      pl: "Strona",
      en: "Page"
    },
    proximity_to_centroid: {
      pl: "Bliskość do centroidu",
      en: "Proximity to Centroid"
    },
    page_types_distribution: {
      pl: "Rozkład typów stron",
      en: "Page Types Distribution"
    },
    distance_distribution: {
      pl: "Rozkład odległości stron od centrum witryny",
      en: "Distribution of Page Distances from Site Center"
    },
    distance: {
      pl: "Odległość",
      en: "Distance"
    },
    count: {
      pl: "Liczba stron",
      en: "Count"
    },
    distribution_divergent: {
      pl: "Rozkład najbardziej rozbieżnych stron",
      en: "Distribution of Most Divergent Pages"
    },
    distribution_focused: {
      pl: "Rozkład najbardziej skupionych stron",
      en: "Distribution of Most Focused Pages"
    },
    analysis_summary: {
      pl: "Podsumowanie analizy",
      en: "Analysis Summary"
    },
    analysis_description: {
      pl: `Powyższa analiza pokazuje skupienie tematyczne domeny senuto.com. Witryna osiąga wynik skupienia na poziomie 78/100, co wskazuje na dobrą spójność tematyczną. Promień oddziaływania witryny wynosi 92%, co sugeruje szeroki zasięg tematyczny przy zachowaniu odpowiedniego poziomu skupienia.

      Najlepiej zoptymalizowane pod kątem skupienia są strony główna (senuto.com) oraz kluczowe podstrony produktowe. Największe odchylenia od głównego tematu witryny widoczne są w artykułach blogowych oraz stronach pomocniczych.

      Rozkład typów stron wskazuje na dominację treści blogowych (35%) oraz stron produktowych (25%), co jest typowe dla witryny SaaS. Wykresy rozkładu odległości pokazują, że większość stron utrzymuje odpowiednią bliskość do głównego centrum tematycznego, co świadczy o dobrej optymalizacji contentu.

      Zalecamy dalsze skupienie na rozwoju treści ściśle związanych z głównym tematem witryny, przy jednoczesnym zachowaniu różnorodności tematycznej na blogu, która przyciąga ruch z długiego ogona wyszukiwań.`,

      en: `The above analysis shows the topical focus of senuto.com domain. The site achieves a focus score of 78/100, indicating good thematic coherence. The site radius is 92%, suggesting a broad thematic reach while maintaining an appropriate level of focus.

      The main page (senuto.com) and key product subpages are best optimized for focus. The greatest deviations from the main site topic are visible in blog articles and auxiliary pages.

      The distribution of page types indicates the dominance of blog content (35%) and product pages (25%), which is typical for a SaaS website. The distance distribution charts show that most pages maintain appropriate proximity to the main thematic center, which indicates good content optimization.

      We recommend continuing to focus on developing content closely related to the main topic of the site, while maintaining thematic diversity on the blog, which attracts traffic from long-tail searches.`
    },
    domain_info: {
      pl: "Informacje o domenie",
      en: "Domain Information"
    },
    domain: {
      pl: "Domena",
      en: "Domain"
    },
    creation_date: {
      pl: "Data utworzenia",
      en: "Creation Date"
    },
    refresh_date: {
      pl: "Data odświeżenia",
      en: "Refresh Date"
    },
    analyzed_urls: {
      pl: "Przeanalizowane URL",
      en: "Analyzed URLs"
    },
    tab_overview: {
      pl: "Przegląd",
      en: "Overview"
    },
    tab_url_analysis: {
      pl: "Analiza URL",
      en: "URL Analysis"
    },
    tab_cannibalization: {
      pl: "Kanibalizacja/Duplikacja",
      en: "Cannibalization/Duplication"
    },
    tab_clusters: {
      pl: "Klastry",
      en: "Clusters"
    },
    url_structure_analysis: {
      pl: "Analiza struktury URL",
      en: "URL Structure Analysis"
    },
    sections: {
      pl: "Sekcje",
      en: "Sections"
    },
    subsections: {
      pl: "Podsekcje",
      en: "Subsections"
    },
    pages: {
      pl: "Strony",
      en: "Pages"
    },
    urls_to_centroid: {
      pl: "URLe do centroidu",
      en: "URLs to Centroid"
    },
    url: {
      pl: "URL",
      en: "URL"
    },
    proximity: {
      pl: "Bliskość",
      en: "Proximity"
    },
    url_1: {
      pl: "URL 1",
      en: "URL 1"
    },
    url_2: {
      pl: "URL 2",
      en: "URL 2"
    },
    similarity_score: {
      pl: "Wynik podobieństwa",
      en: "Similarity Score"
    },
    cluster_1: {
      pl: "Klaster 1",
      en: "Cluster 1"
    },
    cluster_2: {
      pl: "Klaster 2",
      en: "Cluster 2"
    },
    urls_count: {
      pl: "Liczba URLi",
      en: "URLs Count"
    },
    original_value: {
      pl: "Wartość oryginalna",
      en: "Original Value"
    }
  };

  const getLocalTranslation = (key: keyof typeof translations) => {
    return translations[key][language as 'pl' | 'en'] || translations[key].en;
  };

  const focusedPagesData = [
    { page: 'senuto.com', score: 0.98 },
    { page: 'senuto.com/features', score: 0.95 },
    { page: 'senuto.com/pricing', score: 0.92 },
    { page: 'senuto.com/api', score: 0.90 },
    { page: 'senuto.com/blog', score: 0.88 },
    { page: 'senuto.com/academy', score: 0.85 },
    { page: 'senuto.com/contact', score: 0.82 },
    { page: 'senuto.com/login', score: 0.79 },
    { page: 'senuto.com/register', score: 0.76 },
    { page: 'senuto.com/help', score: 0.73 }
  ];

  const divergentPagesData = [
    { page: 'senuto.com/blog/seo-trends', score: 0.42 },
    { page: 'senuto.com/blog/content-analysis', score: 0.45 },
    { page: 'senuto.com/academy/basics', score: 0.48 },
    { page: 'senuto.com/academy/advanced', score: 0.52 },
    { page: 'senuto.com/case-studies', score: 0.55 },
    { page: 'senuto.com/partners', score: 0.57 },
    { page: 'senuto.com/careers', score: 0.60 },
    { page: 'senuto.com/privacy-policy', score: 0.63 },
    { page: 'senuto.com/terms-of-service', score: 0.65 },
    { page: 'senuto.com/changelog', score: 0.68 }
  ];

  const pageTypesData = [
    { name: 'Blog', y: 35, color: '#8884d8' },
    { name: 'Product', y: 25, color: '#82ca9d' },
    { name: 'Category', y: 20, color: '#ffc658' },
    { name: 'Landing Page', y: 10, color: '#ff8042' },
    { name: 'Support', y: 10, color: '#0088FE' }
  ];

  const distanceDistributionData: [number, number][] = [
    [0.0, 5],
    [0.1, 12],
    [0.2, 25],
    [0.3, 42],
    [0.4, 58],
    [0.5, 65],
    [0.6, 48],
    [0.7, 36],
    [0.8, 24],
    [0.9, 15],
    [1.0, 8]
  ];

  const divergentDistributionData: [number, number][] = [
    [0.8, 65],
    [0.79, 58],
    [0.78, 50],
    [0.77, 42],
    [0.76, 35],
    [0.75, 28],
    [0.74, 22],
    [0.73, 18],
    [0.72, 12],
    [0.71, 8],
    [0.7, 5]
  ];

  const focusedDistributionData: [number, number][] = [
    [0.5, 5],
    [0.55, 12],
    [0.6, 20],
    [0.65, 28],
    [0.7, 38],
    [0.75, 48],
    [0.8, 60],
    [0.85, 70],
    [0.9, 82],
    [0.95, 90],
    [1.0, 98]
  ];

  const domainInfo = {
    domain: 'senuto.com',
    creationDate: '2023-09-15',
    refreshDate: '2023-12-10',
    analyzedUrls: 342
  };

  const urlAnalysisData = [
    { url: 'senuto.com/blog/jak-analizowac-seo', score: 0.67 },
    { url: 'senuto.com/blog/content-marketing-strategia', score: 0.72 },
    { url: 'senuto.com/product/visibility', score: 0.89 },
    { url: 'senuto.com/api/documentation', score: 0.91 },
    { url: 'senuto.com/customer-stories/e-commerce', score: 0.78 }
  ];

  const treeMapData = [
    { id: 'main', name: 'senuto.com', value: 342, colorValue: 0.9 },
    { id: 'blog', name: 'blog', parent: 'main', value: 120, colorValue: 0.65 },
    { id: 'product', name: 'product', parent: 'main', value: 85, colorValue: 0.82 },
    { id: 'academy', name: 'academy', parent: 'main', value: 55, colorValue: 0.71 },
    { id: 'help', name: 'help', parent: 'main', value: 45, colorValue: 0.68 },
    { id: 'about', name: 'about', parent: 'main', value: 37, colorValue: 0.77 },
    { id: 'tools', name: 'tools', parent: 'main', value: 42, colorValue: 0.84 },
    { id: 'services', name: 'services', parent: 'main', value: 33, colorValue: 0.79 },
    { id: 'blog-seo', name: 'seo', parent: 'blog', value: 45, colorValue: 0.62 },
    { id: 'blog-content', name: 'content', parent: 'blog', value: 38, colorValue: 0.68 },
    { id: 'blog-analytics', name: 'analytics', parent: 'blog', value: 37, colorValue: 0.65 },
    { id: 'blog-social', name: 'social media', parent: 'blog', value: 22, colorValue: 0.59 },
    { id: 'blog-trends', name: 'trends', parent: 'blog', value: 18, colorValue: 0.61 },
    { id: 'product-visibility', name: 'visibility', parent: 'product', value: 35, colorValue: 0.87 },
    { id: 'product-audit', name: 'audit', parent: 'product', value: 30, colorValue: 0.84 },
    { id: 'product-research', name: 'research', parent: 'product', value: 20, colorValue: 0.79 },
    { id: 'academy-basics', name: 'basics', parent: 'academy', value: 30, colorValue: 0.68 },
    { id: 'academy-advanced', name: 'advanced', parent: 'academy', value: 25, colorValue: 0.74 },
    { id: 'tools-keywords', name: 'keywords', parent: 'tools', value: 22, colorValue: 0.88 },
    { id: 'tools-rank', name: 'rank tracker', parent: 'tools', value: 20, colorValue: 0.86 },
    { id: 'services-consulting', name: 'consulting', parent: 'services', value: 18, colorValue: 0.81 },
    { id: 'services-training', name: 'training', parent: 'services', value: 15, colorValue: 0.77 },
    { id: 'page-1', name: 'on-page-seo', parent: 'blog-seo', value: 12, colorValue: 0.60 },
    { id: 'page-2', name: 'link-building', parent: 'blog-seo', value: 10, colorValue: 0.63 },
    { id: 'page-3', name: 'content-strategy', parent: 'blog-content', value: 15, colorValue: 0.67 },
    { id: 'page-4', name: 'visibility-api', parent: 'product-visibility', value: 18, colorValue: 0.89 },
    { id: 'page-5', name: 'seo-basics', parent: 'academy-basics', value: 14, colorValue: 0.65 },
    { id: 'page-6', name: 'technical-seo', parent: 'blog-seo', value: 9, colorValue: 0.58 },
    { id: 'page-7', name: 'social-analytics', parent: 'blog-social', value: 11, colorValue: 0.57 },
    { id: 'page-8', name: 'keyword-research', parent: 'tools-keywords', value: 13, colorValue: 0.91 },
    { id: 'page-9', name: 'seo-consulting', parent: 'services-consulting', value: 10, colorValue: 0.83 },
    { id: 'page-10', name: 'content-audit', parent: 'product-audit', value: 16, colorValue: 0.85 },
    { id: 'page-11', name: '2023-seo-trends', parent: 'blog-trends', value: 9, colorValue: 0.59 },
    { id: 'page-12', name: 'rank-tracking-guide', parent: 'tools-rank', value: 12, colorValue: 0.87 }
  ];

  const cannibalizationData = [
    { url1: 'senuto.com/blog/on-page-seo', url2: 'senuto.com/academy/seo-basics', similarityScore: 0.87 },
    { url1: 'senuto.com/product/visibility', url2: 'senuto.com/tools/rank-tracker', similarityScore: 0.72 },
    { url1: 'senuto.com/blog/content-marketing', url2: 'senuto.com/blog/content-strategy', similarityScore: 0.93 },
    { url1: 'senuto.com/help/api-documentation', url2: 'senuto.com/product/api', similarityScore: 0.68 },
    { url1: 'senuto.com/academy/keyword-research', url2: 'senuto.com/tools/keywords', similarityScore: 0.79 }
  ];

  const clustersData = [
    { id: 'seo', label: 'SEO', value: 45, group: 1 },
    { id: 'content', label: 'Content Marketing', value: 38, group: 1 },
    { id: 'analytics', label: 'Analytics', value: 32, group: 2 },
    { id: 'technical', label: 'Technical SEO', value: 28, group: 1 },
    { id: 'social', label: 'Social Media', value: 25, group: 3 },
    { id: 'ppc', label: 'PPC', value: 22, group: 2 },
    { id: 'ux', label: 'UX', value: 20, group: 4 },
    { id: 'mobile', label: 'Mobile', value: 18, group: 4 },
    { id: 'local', label: 'Local SEO', value: 15, group: 1 },
    { id: 'voice', label: 'Voice Search', value: 12, group: 5 }
  ];

  const clusterLinks = [
    { source: 'seo', target: 'content', value: 0.8 },
    { source: 'seo', target: 'technical', value: 0.9 },
    { source: 'seo', target: 'local', value: 0.7 },
    { source: 'content', target: 'social', value: 0.6 },
    { source: 'analytics', target: 'seo', value: 0.7 },
    { source: 'analytics', target: 'ppc', value: 0.8 },
    { source: 'technical', target: 'mobile', value: 0.75 },
    { source: 'technical', target: 'ux', value: 0.65 },
    { source: 'social', target: 'content', value: 0.85 },
    { source: 'ppc', target: 'analytics', value: 0.7 },
    { source: 'ux', target: 'mobile', value: 0.9 },
    { source: 'voice', target: 'mobile', value: 0.6 },
    { source: 'voice', target: 'local', value: 0.5 },
    { source: 'mobile', target: 'local', value: 0.45 },
    { source: 'content', target: 'ux', value: 0.4 }
  ];

  const scatterCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawScatterPlot = () => {
    const canvas = scatterCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const points = generateScatterData(400);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('2D t-SNE Projection of Pages', canvas.width / 2, 30);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    const scale = Math.min(canvas.width, canvas.height) / 150;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    points.forEach(point => {
      const x = offsetX + point.x * scale;
      const y = offsetY + point.y * scale;
      const radius = 4;

      let r, g, b;

      const normProximity = (point.proximity - 0.5) / 0.4;

      if (normProximity < 0.33) {
        r = Math.floor(255 * (normProximity * 3));
        g = 220;
        b = 50;
      } else if (normProximity < 0.66) {
        r = 255;
        g = Math.floor(220 * (1 - (normProximity - 0.33) * 3));
        b = 50;
      } else {
        r = 255 - Math.floor(100 * (normProximity - 0.66) * 3);
        g = Math.floor(50 * (1 - (normProximity - 0.66) * 3));
        b = 50 + Math.floor(150 * (normProximity - 0.66) * 3);
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    const legendWidth = 150;
    const legendHeight = 40;
    const legendX = canvas.width - legendWidth - 20;
    const legendY = 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.roundRect(legendX, legendY, legendWidth, legendHeight, 5);
    ctx.fill();

    const gradient = ctx.createLinearGradient(legendX + 10, 0, legendX + legendWidth - 50, 0);
    gradient.addColorStop(0, 'rgb(50, 220, 50)');
    gradient.addColorStop(0.33, 'rgb(255, 220, 50)');
    gradient.addColorStop(0.66, 'rgb(255, 50, 50)');
    gradient.addColorStop(1, 'rgb(155, 50, 200)');

    ctx.fillStyle = gradient;
    ctx.fillRect(legendX + 10, legendY + 10, legendWidth - 60, 10);

    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Distance from center', legendX + 10, legendY + 30);
  };

  useEffect(() => {
    if (activeTab === 'clusters') {
      drawScatterPlot();
      window.addEventListener('resize', drawScatterPlot);

      return () => {
        window.removeEventListener('resize', drawScatterPlot);
      };
    }
  }, [activeTab]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    const tabParam = searchParams.get('tab');

    if (tabParam) {
      setActiveTab(tabParam);
    }

    // Get data from location state if available
    if (location.state?.apiData) {
      setApiData(location.state.apiData);
      setIsLoading(false);
    } else if (projectId) {
      // If no data in state, redirect back to processing
      navigate(`/processing?projectId=${projectId}`);
    }
  }, [location, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);

    navigate(`/results?${searchParams.toString()}`);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="p-8 text-center text-gray-400">{t('loading')}</div>;
    }

    if (!apiData) {
      return <div className="p-8 text-center text-gray-400">{t('no_data_available')}</div>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="flex flex-col items-center">
                <HighchartsGauge
                  id="site-focus-gauge"
                  value={Number((apiData.site_focus * 100).toFixed(2))}
                  title={getLocalTranslation('site_focus')}
                  suffix=""
                  min={0}
                  max={100}
                />
              </div>

              <div className="flex flex-col items-center">
                <HighchartsGauge
                  id="site-radius-gauge"
                  value={Number((apiData.site_radius * 100).toFixed(2))}
                  title={getLocalTranslation('site_radius')}
                  suffix=""
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                  {getLocalTranslation('top_focused_pages')}
                </h2>
                <div className="w-full">
                  <table className="w-full divide-y divide-gray-800">
                    <thead className="bg-black/20">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[70%]">
                          {getLocalTranslation('page')}
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider w-[30%]">
                          {getLocalTranslation('proximity_to_centroid')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black/10 divide-y divide-gray-800">
                      {apiData.top_focused_urls.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-900/30">
                          <td className="px-4 py-3 text-sm text-gray-200 truncate max-w-0">
                            <div className="truncate">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors"
                              >
                                {item.url}
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                              {item.proximity.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                  {getLocalTranslation('top_divergent_pages')}
                </h2>
                <div className="w-full">
                  <table className="w-full divide-y divide-gray-800">
                    <thead className="bg-black/20">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[70%]">
                          {getLocalTranslation('page')}
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider w-[30%]">
                          {getLocalTranslation('proximity_to_centroid')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black/10 divide-y divide-gray-800">
                      {apiData.top_divergent_urls.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-900/30">
                          <td className="px-4 py-3 text-sm text-gray-200 truncate max-w-0">
                            <div className="truncate">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors"
                              >
                                {item.url}
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium whitespace-nowrap">
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                              {item.proximity.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {getLocalTranslation('page_types_distribution')}
                </h2>
                <HighchartsDonut
                  id="page-types-chart"
                  title=""
                  data={[
                    { name: 'Core Content', y: apiData.page_type_distribution.core_content.percentage, color: '#8884d8' },
                    { name: 'Supporting Pages', y: apiData.page_type_distribution.supporting_pages.percentage, color: '#82ca9d' },
                    { name: 'Peripheral Pages', y: apiData.page_type_distribution.peripheral_pages.percentage, color: '#ffc658' }
                  ]}
                />
              </div>

              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {getLocalTranslation('distance_distribution')}
                </h2>
                <HighchartsAreaChart
                  id="distance-distribution-chart"
                  title=""
                  seriesName={getLocalTranslation('count')}
                  xAxisTitle={getLocalTranslation('distance')}
                  yAxisTitle={getLocalTranslation('count')}
                  data={Object.entries(apiData.histogram_data).map(([range, count]) => [
                    parseFloat(range.split('-')[0]),
                    count
                  ])}
                />
              </div>
            </div>
          </>
        );

      case 'url_analysis':
        return (
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {getLocalTranslation('url_structure_analysis')}
              </h2>
              <div className="h-[600px]">
                <HighchartsTreeMap
                  id="url-structure-treemap"
                  data={treeMapData}
                />
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                {getLocalTranslation('urls_to_centroid')}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-black/20">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {getLocalTranslation('url')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {getLocalTranslation('proximity')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/10 divide-y divide-gray-800">
                    {urlAnalysisData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-900/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {item.url}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span className={`px-2 py-1 rounded ${item.score > 0.7 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                            {item.score.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'cannibalization':
        return (
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                {getLocalTranslation('tab_cannibalization')}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-black/20">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {getLocalTranslation('url_1')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {getLocalTranslation('url_2')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {getLocalTranslation('similarity_score')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/10 divide-y divide-gray-800">
                    {cannibalizationData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-900/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {item.url1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {item.url2}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span className={`px-2 py-1 rounded ${item.similarityScore > 0.8 ? 'bg-red-500/20 text-red-300' :
                            item.similarityScore > 0.7 ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                            {item.similarityScore.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'clusters':
        return (
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {getLocalTranslation('tab_clusters')}
              </h2>
              <div className="relative h-[600px] border border-gray-700 rounded bg-black/20">
                <canvas
                  ref={scatterCanvasRef}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                  {getLocalTranslation('cluster_1')}
                </h2>
                <div className="p-4">
                  <ul className="space-y-2">
                    {clustersData.filter(c => c.group === 1).map((cluster, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-black/20 rounded">
                        <span className="text-white">{cluster.label}</span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                          {cluster.value} {getLocalTranslation('urls_count')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                  {getLocalTranslation('cluster_2')}
                </h2>
                <div className="p-4">
                  <ul className="space-y-2">
                    {clustersData.filter(c => c.group === 2).map((cluster, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-black/20 rounded">
                        <span className="text-white">{cluster.label}</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                          {cluster.value} {getLocalTranslation('urls_count')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-8 text-center text-gray-400">{t('feature_unavailable')}</div>;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
      <VantaBackground className="absolute inset-0 opacity-30" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <AppHeader />

        <div className="flex-1 overflow-y-auto pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('results')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('results_description')}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex space-x-1 bg-black/20 backdrop-blur-sm p-1 rounded-lg shadow-inner">
                <button
                  onClick={() => handleTabChange('overview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${activeTab === 'overview' ? 'bg-black/60 text-white' : 'text-gray-300 hover:text-white hover:bg-black/40'
                    }`}
                >
                  {getLocalTranslation('tab_overview')}
                </button>
                <button
                  onClick={() => handleTabChange('url_analysis')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${activeTab === 'url_analysis' ? 'bg-black/60 text-white' : 'text-gray-300 hover:text-white hover:bg-black/40'
                    }`}
                >
                  {getLocalTranslation('tab_url_analysis')}
                </button>
                <button
                  onClick={() => handleTabChange('cannibalization')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${activeTab === 'cannibalization' ? 'bg-black/60 text-white' : 'text-gray-300 hover:text-white hover:bg-black/40'
                    }`}
                >
                  {getLocalTranslation('tab_cannibalization')}
                </button>
                <button
                  onClick={() => handleTabChange('clusters')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${activeTab === 'clusters' ? 'bg-black/60 text-white' : 'text-gray-300 hover:text-white hover:bg-black/40'
                    }`}
                >
                  {getLocalTranslation('tab_clusters')}
                </button>
              </div>
            </div>

            <div className="pb-12">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
