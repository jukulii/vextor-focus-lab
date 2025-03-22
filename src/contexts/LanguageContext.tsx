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
  "analyse": { en: "Analyze", pl: "Analizuj" },

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
  "benefit_4_title": { en: "Future-proof your SEO for the era of LLMs and semantic indexing", pl: "Przygotuj SEO na erę LLM i indeksowania semantycznego" },
  "benefit_4_desc": {
    en: "Keep visitors on your site longer with relevant, coherent content",
    pl: "Zatrzymaj odwiedzających na swojej stronie dłużej dzięki odpowiednim, spójnym treściom"
  },
  "benefit_5_title": { en: "Eliminate content that drags your rankings down", pl: "Eliminuj treści obniżające pozycje" },
  "benefit_5_desc": {
    en: "Discover missing topics that could enhance your site's authority",
    pl: "Odkryj brakujące tematy, które mogą zwiększyć autorytet Twojej witryny"
  },
  "benefit_6_title": { en: "Understand how Google evaluates your site", pl: "Zrozum, jak Google ocenia Twoją stronę" },
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
  "found_sitemaps": {
    en: "We found %count% sitemaps.",
    pl: "Znaleźliśmy %count% stron adresów sitemap."
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
  "summary": { en: "Summary", pl: "Podsumowanie" },
  "filter": { en: "Filter", pl: "Filtruj" },

  // New translations for results page
  "results": { en: "Analysis Results", pl: "Wyniki analizy" },
  "results_description": { en: "Comprehensive analysis of your website's content focus", pl: "Kompleksowa analiza ukierunkowania treści Twojej strony" },
  "focused_pages": { en: "Most Focused Pages", pl: "Najbardziej skoncentrowane strony" },
  "divergent_pages": { en: "Most Divergent Pages", pl: "Najbardziej odbiegające strony" },

  // New translations for canonicalization
  "canonicalization_description": {
    en: "Identification of duplicate or similar content across the site, helping to prevent content cannibalization.",
    pl: "Identyfikacja zduplikowanych lub podobnych treści w witrynie, zapobiegająca kanibalizacji treści."
  },
  "urls_to_centroid": {
    en: "URL's to centroid",
    pl: "URL do centroidu"
  },
  "similarity_score": {
    en: "Similarity score",
    pl: "Wynik podobieństwa"
  },
  "url_1": {
    en: "URL 1",
    pl: "URL 1"
  },
  "url_2": {
    en: "URL 2",
    pl: "URL 2"
  },

  // New translations for clusters/classes tab
  "cluster_description": {
    en: "Visual representation of content clusters and their relationships based on semantic similarity.",
    pl: "Wizualna reprezentacja klastrów treści i ich relacji na podstawie podobieństwa semantycznego."
  },
  "cluster_1": {
    en: "Cluster 1",
    pl: "Klaster 1"
  },
  "cluster_2": {
    en: "Cluster 2",
    pl: "Klaster 2"
  },
  "cluster_3": {
    en: "Cluster 3",
    pl: "Klaster 3"
  },
  "urls_count": {
    en: "URLs",
    pl: "Adresy URL"
  },
  "content_pattern": {
    en: "Primary content pattern",
    pl: "Główny wzorzec treści"
  },

  // Login page
  "login": { en: "Login", pl: "Logowanie" },
  "login_subtitle": { en: "Enter your credentials to access your account", pl: "Wprowadź dane logowania, aby uzyskać dostęp do konta" },
  "email": { en: "Email", pl: "Email" },
  "password": { en: "Password", pl: "Hasło" },
  "logging_in": { en: "Logging in...", pl: "Logowanie..." },
  "login_success": { en: "Login successful", pl: "Logowanie udane" },
  "welcome_back": { en: "Welcome back to Vextor", pl: "Witaj ponownie w Vextor" },
  "login_failed": { en: "Login failed", pl: "Logowanie nieudane" },
  "error": { en: "Error", pl: "Błąd" },
  "dont_have_account": { en: "Don't have an account?", pl: "Nie masz konta?" },
  "register": { en: "Register", pl: "Zarejestruj się" },
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
