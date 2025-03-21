
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'pl';

type Translations = {
  [key: string]: {
    en: string;
    pl: string;
  };
};

// English and Polish translations
const translations: Translations = {
  // Navigation
  "home": { en: "Home", pl: "Strona główna" },
  "features": { en: "Features", pl: "Funkcje" },
  "how_it_works": { en: "How it works", pl: "Jak to działa" },
  "pricing": { en: "Pricing", pl: "Cennik" },
  
  // Hero Section
  "hero_title": { 
    en: "Analyze your website's topical focus",
    pl: "Analizuj tematyczne ukierunkowanie swojej strony"
  },
  "hero_subtitle": { 
    en: "Unlock comprehensive insights into your website's content focus and improve SEO performance",
    pl: "Odblokuj kompleksowy wgląd w tematykę treści swojej strony i popraw wydajność SEO"
  },
  "get_started": { en: "Get Started", pl: "Rozpocznij" },
  "analyze": { en: "Analyze", pl: "Analizuj" },
  
  // How it works section
  "how_it_works_title": { en: "How It Works", pl: "Jak to działa" },
  "step_1": { en: "Input website URL", pl: "Wprowadź adres URL" },
  "step_2": { en: "AI analyzes content", pl: "AI analizuje treść" },
  "step_3": { en: "Review focus insights", pl: "Przejrzyj wyniki" },
  "step_4": { en: "Optimize content strategy", pl: "Optymalizuj strategię" },
  
  // New Era Section
  "new_era_title": { en: "A New Era for SEO Content Focus", pl: "Nowa era dla contentu SEO" },
  "new_era_subtitle": { 
    en: "Advanced analytics to help you understand and improve your website's thematic coherence",
    pl: "Zaawansowana analityka, która pomoże Ci zrozumieć i ulepszyć tematyczną spójność strony"
  },
  "benefit_1_title": { en: "AI-Powered Analysis", pl: "Analiza oparta na AI" },
  "benefit_1_desc": { 
    en: "Leverage machine learning algorithms to identify your content's topical clusters",
    pl: "Wykorzystaj algorytmy uczenia maszynowego do identyfikacji tematycznych klastrów treści"
  },
  "benefit_2_title": { en: "Actionable Insights", pl: "Praktyczne wskazówki" },
  "benefit_2_desc": { 
    en: "Get clear recommendations to improve your content's thematic relevance",
    pl: "Otrzymaj jasne rekomendacje, aby poprawić tematyczną trafność treści"
  },
  
  // Key Benefits Section
  "key_benefits_title": { en: "Key Benefits", pl: "Główne korzyści" },
  "benefit_3_title": { en: "Enhanced SEO Rankings", pl: "Lepsze pozycje w SEO" },
  "benefit_3_desc": { 
    en: "Improve your search rankings with topically focused content",
    pl: "Popraw swoje pozycje w wyszukiwarkach dzięki tematycznie ukierunkowanym treściom"
  },
  "benefit_4_title": { en: "Better User Engagement", pl: "Lepsze zaangażowanie użytkowników" },
  "benefit_4_desc": { 
    en: "Keep visitors on your site longer with relevant, coherent content",
    pl: "Zatrzymaj odwiedzających na swojej stronie dłużej dzięki odpowiednim, spójnym treściom"
  },
  "benefit_5_title": { en: "Content Gap Identification", pl: "Identyfikacja luk w treści" },
  "benefit_5_desc": { 
    en: "Discover missing topics that could enhance your site's authority",
    pl: "Odkryj brakujące tematy, które mogą zwiększyć autorytet Twojej witryny"
  },
  "benefit_6_title": { en: "Competitive Edge", pl: "Przewaga konkurencyjna" },
  "benefit_6_desc": { 
    en: "Understand how your content focus compares to competitors",
    pl: "Zrozum, jak ukierunkowanie Twoich treści wypada na tle konkurencji"
  },
  
  // Pricing Section
  "pricing_title": { en: "Simple, Transparent Pricing", pl: "Proste, przejrzyste ceny" },
  "price_free_title": { en: "Free", pl: "Za darmo" },
  "price_free_desc": { 
    en: "Basic website analysis with limited reports",
    pl: "Podstawowa analiza strony z ograniczonymi raportami"
  },
  "price_pro_title": { en: "Professional", pl: "Profesjonalny" },
  "price_pro_desc": { 
    en: "Complete content analysis with detailed insights and recommendations",
    pl: "Pełna analiza treści ze szczegółowymi wskazówkami i zaleceniami"
  },
  "price_enterprise_title": { en: "Enterprise", pl: "Dla firm" },
  "price_enterprise_desc": { 
    en: "Custom solutions for large websites with dedicated support",
    pl: "Niestandardowe rozwiązania dla dużych stron z dedykowanym wsparciem"
  },
  "monthly": { en: "/month", pl: "/miesiąc" },
  "contact_us": { en: "Contact Us", pl: "Skontaktuj się z nami" },
  
  // Footer
  "copyright": { en: "© 2023 Vextor. All rights reserved.", pl: "© 2023 Vextor. Wszelkie prawa zastrzeżone." },
  "privacy_policy": { en: "Privacy Policy", pl: "Polityka prywatności" },
  "terms_of_service": { en: "Terms of Service", pl: "Warunki korzystania" },
  
  // App Page
  "check_domain_focus": { en: "Check Your Domain's Focus", pl: "Sprawdź Focus Swojej domeny" },
  "site_url": { en: "Website URL", pl: "Adres URL strony" },
  "check_domain": { en: "Check Domain", pl: "Sprawdź domenę" },
  "check_for_me": { en: "Check for me", pl: "Wyszukaj sitemapę za mnie" },
  "checking_sitemap": { en: "Checking sitemap...", pl: "Trwa wyszukiwanie sitemapy..." },
  "enter_sitemap_url": { en: "Enter sitemap URL", pl: "Wprowadź adres sitemapy" },
  "next": { en: "Next", pl: "Dalej" },
  "step": { en: "Step", pl: "Krok" },
  "progress": { en: "progress, estimated time to complete", pl: "postęp, szacowany czas zakończenia" },
  "converting_content": { en: "Currently converting your content to embeddings...", pl: "Aktualnie zamieniamy Twoją treść na embeddingi..." },
  "site_map": { en: "Site Map", pl: "Mapa strony" },
  "filters": { en: "Filters", pl: "Filtry" },
  "processing": { en: "Processing", pl: "Przetwarzanie" },
  "url_to_centroid": { en: "URL's to centroid", pl: "URL do centroidu" },
  "url": { en: "URL", pl: "Adres URL" },
  "proximity": { en: "Proximity to Centroid", pl: "Bliskość do centroidu" },
  "found_urls": { 
    en: "We found %count% URLs that contain a total of 2000 URL addresses.", 
    pl: "Znaleźliśmy %count% stron, które zawierają łącznie 2000 adresów URL." 
  },
  "filtering_note": {
    en: "You can limit the report to URLs containing a specific term or generate a report with all URL addresses.",
    pl: "Możesz ograniczyć raport filtrem lub wygenerować raport ze wszystkimi adresami URL."
  },
  "after_filtering": {
    en: "After filtering, %count% URL addresses (10%) were processed",
    pl: "Po filtracji do przetworzenia zostało %count% adresów URL (10%)"
  },
  "overview": { en: "Overview", pl: "Overview" },
  "url_analysis": { en: "URL Analysis", pl: "Analiza URL" },
  "canonicalization": { en: "Canonicalization", pl: "Kanonikalizacja/Hublinkacja" },
  "classes": { en: "Classes", pl: "Klasy" },
  "exploration": { en: "Exploration", pl: "Eksploracja" },
  "site_focus": { en: "Site Focus", pl: "SiteFocus" },
  "page_focus": { en: "Page Focus", pl: "PageFocus" },
  "content_url": { en: "Content URL", pl: "Content URL" },
  "top_focused_pages": { en: "Top 10 Most Focused Pages", pl: "Top 10 Most Focused Pages" },
  "top_divergent_pages": { en: "Top 10 Most Divergent Pages", pl: "Top 10 Most Divergent Pages" },
  "content_types": { en: "Content Types", pl: "Typy stron" },
  "summary": { en: "Summary", pl: "Podsumowanie" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Try to get language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'pl' ? 'pl' : 'en') as Language;
  });

  // Save language choice to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation '${key}' not found!`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
