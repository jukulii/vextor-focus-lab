import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import HighchartsGauge from '@/components/HighchartsGauge';
import HighchartsDonut from '@/components/HighchartsDonut';
import HighchartsAreaChart from '@/components/HighchartsAreaChart';
import VantaBackground from '@/components/VantaBackground';
import HighchartsTreeMap from '@/components/HighchartsTreeMap';

// Funkcja generująca dane dla scatterplota
const generateScatterData = (count = 400) => {
  const data = [];
  // Generowanie danych punktów
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 2 - 1) * 60;
    const y = (Math.random() * 2 - 1) * 60;

    // Obliczanie dystansu od centrum (0,0)
    const distFromCenter = Math.sqrt(x * x + y * y) / 85;
    // Wartość bliskości większa dla punktów bliżej centrum
    const proximity = Math.max(0.5, Math.min(0.9, 1 - distFromCenter));

    data.push({ x, y, proximity });
  }

  // Dodaj dodatkowy klaster w prawej części
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

  // Aktywny tab
  const [activeTab, setActiveTab] = useState('overview');

  // Lokalne tłumaczenia (zachowane tylko istotne części)
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
    }
  };

  // Funkcja pomocnicza do tłumaczenia
  const getLocalTranslation = (key: keyof typeof translations) => {
    return translations[key][language as 'pl' | 'en'] || translations[key].en;
  };

  // Przykładowe dane dla tabel z adresami z senuto.com
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

  // Dane dla wykresu pierścieniowego z typami stron
  const pageTypesData = [
    { name: 'Blog', y: 35, color: '#8884d8' },
    { name: 'Product', y: 25, color: '#82ca9d' },
    { name: 'Category', y: 20, color: '#ffc658' },
    { name: 'Landing Page', y: 10, color: '#ff8042' },
    { name: 'Support', y: 10, color: '#0088FE' }
  ];

  // Dane dla wykresu obszarowego (area chart) - rozkład odległości stron
  const distanceDistributionData = [
    [0.0, 5],   // 5 stron w odległości 0.0
    [0.1, 12],  // 12 stron w odległości 0.1
    [0.2, 25],  // itd.
    [0.3, 42],
    [0.4, 58],
    [0.5, 65],
    [0.6, 48],
    [0.7, 36],
    [0.8, 24],
    [0.9, 15],
    [1.0, 8]
  ];

  // Dane dla wykresu obszarowego - rozkład najbardziej rozbieżnych stron (distance od 0.8 i maleje)
  // TREND SPADKOWY - więcej stron jest w większej odległości (0.8) i coraz mniej w mniejszej odległości (0.7)
  const divergentDistributionData = [
    [0.8, 65],  // dużo stron na początku (przy wysokiej odległości 0.8)
    [0.79, 58],
    [0.78, 50],
    [0.77, 42],
    [0.76, 35],
    [0.75, 28],
    [0.74, 22],
    [0.73, 18],
    [0.72, 12],
    [0.71, 8],
    [0.7, 5]    // mało stron na końcu (przy niższej odległości 0.7)
  ];

  // Dane dla wykresu obszarowego - rozkład najbardziej skupionych stron (distance od 0.5 i rośnie)
  // TREND ROSNĄCY - mniej stron jest w mniejszej odległości (0.5) i coraz więcej w większej odległości (1.0)
  const focusedDistributionData = [
    [0.5, 5],   // mało stron na początku (przy małej odległości 0.5)
    [0.55, 12],
    [0.6, 20],
    [0.65, 28],
    [0.7, 38],
    [0.75, 48],
    [0.8, 60],
    [0.85, 70],
    [0.9, 82],
    [0.95, 90],
    [1.0, 98]   // dużo stron na końcu (przy wysokiej odległości 1.0)
  ];

  // Dane dotyczące domeny
  const domainInfo = {
    domain: 'senuto.com',
    creationDate: '2023-09-15',
    refreshDate: '2023-12-10',
    analyzedUrls: 342
  };

  // Dodajmy nowy zestaw danych dla analizy URL
  const urlAnalysisData = [
    { url: 'senuto.com/blog/jak-analizowac-seo', score: 0.67 },
    { url: 'senuto.com/blog/content-marketing-strategia', score: 0.72 },
    { url: 'senuto.com/product/visibility', score: 0.89 },
    { url: 'senuto.com/api/documentation', score: 0.91 },
    { url: 'senuto.com/customer-stories/e-commerce', score: 0.78 }
  ];

  // Dane dla treemap z poziomami (struktura URL) - wzbogacone o więcej wymiarów
  const treeMapData = [
    // Główne sekcje - poziom 1
    {
      id: 'main',
      name: 'senuto.com',
      value: 342,
      colorValue: 0.9
    },
    {
      id: 'blog',
      name: 'blog',
      parent: 'main',
      value: 120,
      colorValue: 0.65
    },
    {
      id: 'product',
      name: 'product',
      parent: 'main',
      value: 85,
      colorValue: 0.82
    },
    {
      id: 'academy',
      name: 'academy',
      parent: 'main',
      value: 55,
      colorValue: 0.71
    },
    {
      id: 'help',
      name: 'help',
      parent: 'main',
      value: 45,
      colorValue: 0.68
    },
    {
      id: 'about',
      name: 'about',
      parent: 'main',
      value: 37,
      colorValue: 0.77
    },
    // Dodatkowe sekcje główne
    {
      id: 'tools',
      name: 'tools',
      parent: 'main',
      value: 42,
      colorValue: 0.84
    },
    {
      id: 'services',
      name: 'services',
      parent: 'main',
      value: 33,
      colorValue: 0.79
    },

    // Blog podsekcje - poziom 2
    {
      id: 'blog-seo',
      name: 'seo',
      parent: 'blog',
      value: 45,
      colorValue: 0.62
    },
    {
      id: 'blog-content',
      name: 'content',
      parent: 'blog',
      value: 38,
      colorValue: 0.68
    },
    {
      id: 'blog-analytics',
      name: 'analytics',
      parent: 'blog',
      value: 37,
      colorValue: 0.65
    },
    // Dodatkowe podsekcje dla bloga
    {
      id: 'blog-social',
      name: 'social media',
      parent: 'blog',
      value: 22,
      colorValue: 0.59
    },
    {
      id: 'blog-trends',
      name: 'trends',
      parent: 'blog',
      value: 18,
      colorValue: 0.61
    },

    // Product podsekcje
    {
      id: 'product-visibility',
      name: 'visibility',
      parent: 'product',
      value: 35,
      colorValue: 0.87
    },
    {
      id: 'product-audit',
      name: 'audit',
      parent: 'product',
      value: 30,
      colorValue: 0.84
    },
    {
      id: 'product-research',
      name: 'research',
      parent: 'product',
      value: 20,
      colorValue: 0.79
    },

    // Academy podsekcje
    {
      id: 'academy-basics',
      name: 'basics',
      parent: 'academy',
      value: 30,
      colorValue: 0.68
    },
    {
      id: 'academy-advanced',
      name: 'advanced',
      parent: 'academy',
      value: 25,
      colorValue: 0.74
    },

    // Nowe podsekcje dla Tools
    {
      id: 'tools-keywords',
      name: 'keywords',
      parent: 'tools',
      value: 22,
      colorValue: 0.88
    },
    {
      id: 'tools-rank',
      name: 'rank tracker',
      parent: 'tools',
      value: 20,
      colorValue: 0.86
    },

    // Nowe podsekcje dla Services
    {
      id: 'services-consulting',
      name: 'consulting',
      parent: 'services',
      value: 18,
      colorValue: 0.81
    },
    {
      id: 'services-training',
      name: 'training',
      parent: 'services',
      value: 15,
      colorValue: 0.77
    },

    // Przykładowe strony najniższego poziomu (level 3)
    {
      id: 'page-1',
      name: 'on-page-seo',
      parent: 'blog-seo',
      value: 12,
      colorValue: 0.60
    },
    {
      id: 'page-2',
      name: 'link-building',
      parent: 'blog-seo',
      value: 10,
      colorValue: 0.63
    },
    {
      id: 'page-3',
      name: 'content-strategy',
      parent: 'blog-content',
      value: 15,
      colorValue: 0.67
    },
    {
      id: 'page-4',
      name: 'visibility-api',
      parent: 'product-visibility',
      value: 18,
      colorValue: 0.89
    },
    {
      id: 'page-5',
      name: 'seo-basics',
      parent: 'academy-basics',
      value: 14,
      colorValue: 0.65
    },
    // Dodatkowe strony poziomu 3
    {
      id: 'page-6',
      name: 'technical-seo',
      parent: 'blog-seo',
      value: 9,
      colorValue: 0.58
    },
    {
      id: 'page-7',
      name: 'social-analytics',
      parent: 'blog-social',
      value: 11,
      colorValue: 0.57
    },
    {
      id: 'page-8',
      name: 'keyword-research',
      parent: 'tools-keywords',
      value: 13,
      colorValue: 0.91
    },
    {
      id: 'page-9',
      name: 'seo-consulting',
      parent: 'services-consulting',
      value: 10,
      colorValue: 0.83
    },
    {
      id: 'page-10',
      name: 'content-audit',
      parent: 'product-audit',
      value: 16,
      colorValue: 0.85
    },
    {
      id: 'page-11',
      name: '2023-seo-trends',
      parent: 'blog-trends',
      value: 9,
      colorValue: 0.59
    },
    {
      id: 'page-12',
      name: 'rank-tracking-guide',
      parent: 'tools-rank',
      value: 12,
      colorValue: 0.87
    }
  ];

  // Dodaj nowy zestaw danych dla kanibalizacji treści
  const cannibalizationData = [
    { url1: 'senuto.com/blog/on-page-seo', url2: 'senuto.com/academy/seo-basics', similarityScore: 0.87 },
    { url1: 'senuto.com/product/visibility', url2: 'senuto.com/tools/rank-tracker', similarityScore: 0.72 },
    { url1: 'senuto.com/blog/content-marketing', url2: 'senuto.com/blog/content-strategy', similarityScore: 0.93 },
    { url1: 'senuto.com/help/api-documentation', url2: 'senuto.com/product/api', similarityScore: 0.68 },
    { url1: 'senuto.com/academy/keyword-research', url2: 'senuto.com/tools/keywords', similarityScore: 0.79 }
  ];

  // Dodaj nowy zestaw danych dla klastrów (dodaj to do sekcji danych)
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

  // Dodaj dane o powiązaniach między klastrami
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

  // Referencja do canvas
  const scatterCanvasRef = useRef<HTMLCanvasElement>(null);

  // Funkcja rysująca scatterplot
  const drawScatterPlot = () => {
    const canvas = scatterCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dostosuj rozmiar canvasa do kontenera
    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Wygeneruj dane
    const points = generateScatterData(400);

    // Wyczyść canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dodaj tytuł
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('2D t-SNE Projection of Pages', canvas.width / 2, 30);

    // Tło
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Linie osi
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Oś pozioma
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Oś pionowa
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Rysowanie punktów
    const scale = Math.min(canvas.width, canvas.height) / 150;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    points.forEach(point => {
      const x = offsetX + point.x * scale;
      const y = offsetY + point.y * scale;
      const radius = 4;

      // Nowe mapowanie kolorów - od zielonego (0.5) przez żółty, pomarańczowy do fioletowego (0.9)
      let r, g, b;

      // Normalizuj proximity do zakresu 0-1 (od oryginalnego 0.5-0.9)
      const normProximity = (point.proximity - 0.5) / 0.4;

      if (normProximity < 0.33) {
        // Od zielonego do żółtego
        r = Math.floor(255 * (normProximity * 3));
        g = 220;
        b = 50;
      } else if (normProximity < 0.66) {
        // Od żółtego do pomarańczowego/czerwonego
        r = 255;
        g = Math.floor(220 * (1 - (normProximity - 0.33) * 3));
        b = 50;
      } else {
        // Od pomarańczowego/czerwonego do fioletowego
        r = 255 - Math.floor(100 * (normProximity - 0.66) * 3);
        g = Math.floor(50 * (1 - (normProximity - 0.66) * 3));
        b = 50 + Math.floor(150 * (normProximity - 0.66) * 3);
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Również zaktualizuj legendę, aby odzwierciedlała nową paletę kolorów
    const legendWidth = 150;
    const legendHeight = 40;
    const legendX = canvas.width - legendWidth - 20;
    const legendY = 20;

    // Tło legendy
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.roundRect(legendX, legendY, legendWidth, legendHeight, 5);
    ctx.fill();

    // Gradient dla legendy - zaktualizowany, aby pasował do nowej palety
    const gradient = ctx.createLinearGradient(legendX + 10, 0, legendX + legendWidth - 50, 0);
    gradient.addColorStop(0, 'rgb(50, 220, 50)');       // zielony
    gradient.addColorStop(0.33, 'rgb(255, 220, 50)');   // żółty
    gradient.addColorStop(0.66, 'rgb(255, 50, 50)');    // czerwony
    gradient.addColorStop(1, 'rgb(155, 50, 200)');      // fioletowy

    ctx.fillStyle = gradient;
    ctx.fillRect(legendX + 10, legendY + 10, legendWidth - 60, 10);

    // Tekst legendy
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Distance from center', legendX + 10, legendY + 30);
  };

  // Efekt do rysowania wykresu przy zmianie zakładki
  useEffect(() => {
    if (activeTab === 'clusters') {
      drawScatterPlot();
      window.addEventListener('resize', drawScatterPlot);

      return () => {
        window.removeEventListener('resize', drawScatterPlot);
      };
    }
  }, [activeTab]);

  // Sprawdź, czy mamy tab określony w URL przy ładowaniu strony
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');

    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Obsługa zmiany taba
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);

    navigate(`/results?${searchParams.toString()}`);
  };

  // Renderowanie zawartości na podstawie aktywnego taba
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Highcharts Gauge Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="flex flex-col items-center">
                <HighchartsGauge
                  id="site-focus-gauge"
                  value={78}
                  title={getLocalTranslation('site_focus')}
                  suffix=""
                  min={0}
                  max={100}
                />
              </div>

              <div className="flex flex-col items-center">
                <HighchartsGauge
                  id="site-radius-gauge"
                  value={92}
                  title={getLocalTranslation('site_radius')}
                  suffix="%"
                  min={0}
                  max={100}
                />
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Top Focused Pages Table */}
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                  {getLocalTranslation('top_focused_pages')}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-black/20">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {getLocalTranslation('page')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {getLocalTranslation('proximity_to_centroid')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black/10 divide-y divide-gray-800">
                      {focusedPagesData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                            {item.page}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-200">
                            <span className="px-2 py-1 rounded bg-green-900/60">{item.score.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Divergent Pages Table */}
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                  {getLocalTranslation('top_divergent_pages')}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-black/20">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {getLocalTranslation('page')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {getLocalTranslation('proximity_to_centroid')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black/10 divide-y divide-gray-800">
                      {divergentPagesData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                            {item.page}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-200">
                            <span className="px-2 py-1 rounded bg-red-900/60">{item.score.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Donut Chart Section */}
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6 mb-12 max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold text-white text-center mb-6">
                {getLocalTranslation('page_types_distribution')}
              </h2>
              <HighchartsDonut
                id="page-types-donut"
                title=""
                data={pageTypesData}
              />
            </div>

            {/* Area Chart Section - Main Distribution */}
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6 mb-12">
              <h2 className="text-xl font-semibold text-white text-center mb-6">
                {getLocalTranslation('distance_distribution')}
              </h2>
              <HighchartsAreaChart
                id="distance-distribution-chart"
                title=""
                xAxisTitle={getLocalTranslation('distance')}
                yAxisTitle={getLocalTranslation('count')}
                data={distanceDistributionData}
                color="#8884d8"
                fillOpacity={0.6}
              />
            </div>

            {/* Additional Area Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Divergent Pages Distribution */}
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white text-center mb-6">
                  {getLocalTranslation('distribution_divergent')}
                </h2>
                <HighchartsAreaChart
                  id="divergent-distribution-chart"
                  title=""
                  xAxisTitle={getLocalTranslation('distance')}
                  yAxisTitle={getLocalTranslation('count')}
                  data={divergentDistributionData}
                  color="#e74c3c"  // czerwonawy kolor dla rozbieżnych stron
                  fillOpacity={0.6}
                  minX={0.7}
                  maxX={0.8}
                  invertXAxis={true}  // odwrócenie osi X, aby wartości malały od lewej do prawej
                />
              </div>

              {/* Focused Pages Distribution */}
              <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white text-center mb-6">
                  {getLocalTranslation('distribution_focused')}
                </h2>
                <HighchartsAreaChart
                  id="focused-distribution-chart"
                  title=""
                  xAxisTitle={getLocalTranslation('distance')}
                  yAxisTitle={getLocalTranslation('count')}
                  data={focusedDistributionData}
                  color="#2ecc71"  // zielonkawy kolor dla skupionych stron
                  fillOpacity={0.6}
                  minX={0.5}
                  maxX={1.0}
                />
              </div>
            </div>

            {/* Analysis Summary Box */}
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {getLocalTranslation('analysis_summary')}
              </h2>
              <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                {getLocalTranslation('analysis_description')}
              </div>
            </div>
          </>
        );
      case 'url-analysis':
        return (
          <>
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg mb-12 overflow-hidden">
              <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
                {getLocalTranslation('tab_url_analysis')}
              </h2>
              <div className="p-6">
                {/* URL Analysis Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-black/20">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          URL
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {getLocalTranslation('proximity_to_centroid')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black/10 divide-y divide-gray-800">
                      {urlAnalysisData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                            {item.url}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-200">
                            <span
                              className={`px-2 py-1 rounded ${item.score > 0.8
                                ? 'bg-green-900/60'
                                : item.score > 0.6
                                  ? 'bg-yellow-900/60'
                                  : 'bg-red-900/60'
                                }`}
                            >
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

            {/* TreeMap Section */}
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg p-6 mb-12">
              <h2 className="text-xl font-semibold text-white text-center mb-6">
                {getLocalTranslation('url_structure_analysis')}
              </h2>
              <div className="mt-6">
                <HighchartsTreeMap
                  id="url-structure-treemap"
                  data={treeMapData}
                />
              </div>
            </div>
          </>
        );
      case 'cannibalization':
        return (
          <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg mb-12 overflow-hidden">
            <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
              {getLocalTranslation('tab_cannibalization')}
            </h2>
            <div className="p-6">
              {/* Cannibalization Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-black/20">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        URL 1
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        URL 2
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Similarity Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/10 divide-y divide-gray-800">
                    {cannibalizationData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-200">
                          {item.url1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-200">
                          {item.url2}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-200">
                          <span
                            className={`px-2 py-1 rounded ${item.similarityScore > 0.85
                              ? 'bg-red-900/60'
                              : item.similarityScore > 0.7
                                ? 'bg-yellow-900/60'
                                : 'bg-green-900/60'
                              }`}
                          >
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
          <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg shadow-lg mb-12 overflow-hidden">
            <h2 className="text-xl font-semibold text-white p-4 bg-black/30 border-b border-gray-800">
              {getLocalTranslation('tab_clusters')}
            </h2>
            <div className="p-4">
              <div
                className="w-full bg-black/20 rounded-lg"
                style={{ height: "600px", position: "relative" }}
              >
                <canvas
                  ref={scatterCanvasRef}
                  className="w-full h-full"
                ></canvas>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      <VantaBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow p-6">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12 text-white">
              {t('check_domain_focus')}
            </h1>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto mb-8 bg-black/30 backdrop-blur-lg rounded-lg border border-gray-800">
              <button
                className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors whitespace-nowrap ${activeTab === 'overview'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
                  }`}
                onClick={() => handleTabChange('overview')}
              >
                {getLocalTranslation('tab_overview')}
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors whitespace-nowrap ${activeTab === 'url-analysis'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
                  }`}
                onClick={() => handleTabChange('url-analysis')}
              >
                {getLocalTranslation('tab_url_analysis')}
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors whitespace-nowrap ${activeTab === 'cannibalization'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
                  }`}
                onClick={() => handleTabChange('cannibalization')}
              >
                {getLocalTranslation('tab_cannibalization')}
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors whitespace-nowrap ${activeTab === 'clusters'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
                  }`}
                onClick={() => handleTabChange('clusters')}
              >
                {getLocalTranslation('tab_clusters')}
              </button>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultsPage;
