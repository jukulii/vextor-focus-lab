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
  "faq": { en: "FAQ", pl: "FAQ" },

  // Login related translations
  "login": { en: "Log In", pl: "Zaloguj się" },
  "login_subtitle": { en: "Enter your credentials to access your account", pl: "Wprowadź swoje dane, aby uzyskać dostęp do konta" },
  "email": { en: "Email", pl: "Email" },
  "password": { en: "Password", pl: "Hasło" },
  "logging_in": { en: "Logging in...", pl: "Logowanie..." },
  "login_success": { en: "Login successful", pl: "Zalogowano pomyślnie" },
  "welcome_back": { en: "Welcome back to Vextor", pl: "Witaj z powrotem w Vextor" },
  "login_failed": { en: "Login failed", pl: "Logowanie nie powiodło się" },
  "error": { en: "Error", pl: "Błąd" },
  "dont_have_account": { en: "Don't have an account?", pl: "Nie masz konta?" },
  "register": { en: "Register", pl: "Zarejestruj się" },
  "logout": { en: "Logout", pl: "Wyloguj się" },
  "go_to_app": { en: "Go to App", pl: "Przejdź do aplikacji" },

  // Registration related translations
  "register_subtitle": { en: "Create your account to get started", pl: "Utwórz konto, aby rozpocząć" },
  "display_name": { en: "Display Name", pl: "Nazwa wyświetlana" },
  "display_name_placeholder": { en: "Your name", pl: "Twoje imię" },
  "registering": { en: "Registering...", pl: "Rejestracja..." },
  "registration_success": { en: "Registration successful", pl: "Rejestracja pomyślna" },
  "check_email": { en: "Please check your email to confirm your account", pl: "Sprawdź swoją skrzynkę email, aby potwierdzić konto" },
  "registration_failed": { en: "Registration failed", pl: "Rejestracja nie powiodła się" },
  "already_have_account": { en: "Already have an account?", pl: "Masz już konto?" },

  // Hero Section
  "hero_title": {
    en: "Analyze your website topical focus",
    pl: "Analizuj tematyczne ukierunkowanie swojej strony"
  },
  "hero_subtitle": {
    en: "Unlock comprehensive insights into your website content focus and improve SEO performance",
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
  "check_for_me": { en: "Check for me", pl: "Sprawdź dla mnie" },
  "checking_sitemap": { en: "Checking sitemap...", pl: "Sprawdzanie sitemapy..." },
  "enter_sitemap_url": { en: "Enter sitemap URL (e.g. example.com/sitemap.xml)", pl: "Wprowadź adres sitemapy (np. example.com/sitemap.xml)" },
  "next": { en: "next", pl: "następny" },
  "step": { en: "Step", pl: "Krok" },
  "progress": { en: "progress", pl: "postęp" },
  "converting_content": { en: "Converting content to vectors...", pl: "Konwertowanie treści na wektory..." },
  "site_map": { en: "Site Map", pl: "Mapa strony" },
  "filters": { en: "Filters", pl: "Filtry" },
  "processing": { en: "Processing", pl: "Przetwarzanie" },
  "coming_soon": { en: "Coming soon", pl: "Wkrótce" },
  "feature_unavailable": { en: "This feature is not available yet", pl: "Ta funkcja nie jest jeszcze dostępna" },
  "in_development": { en: "We're working hard to bring this feature to you soon!", pl: "Pracujemy nad udostępnieniem tej funkcji!" },
  "url_to_centroid": { en: "URL's to centroid", pl: "URL do centroidu" },
  "url": { en: "URL", pl: "Adres URL" },
  "proximity": { en: "Proximity to Centroid", pl: "Bliskość do centroidu" },

  // Filtering and pagination translations
  "url_filters": { en: "URL Filters", pl: "Filtry URL" },
  "add_filter": { en: "Add Filter", pl: "Dodaj filtr" },
  "no_filters": { en: "No filters applied. Click \"Add Filter\" to create one.", pl: "Brak zastosowanych filtrów. Kliknij \"Dodaj filtr\", aby utworzyć filtr." },
  "contains": { en: "Contains", pl: "Zawiera" },
  "not_contains": { en: "Does not contain", pl: "Nie zawiera" },
  "starts_with": { en: "Starts with", pl: "Zaczyna się od" },
  "ends_with": { en: "Ends with", pl: "Kończy się na" },
  "regex": { en: "RegEx match", pl: "Dopasowanie RegEx" },
  "urls_matching": { en: "URLs matching", pl: "pasujących URL-i" },
  "show": { en: "Show", pl: "Pokaż" },
  "per_page": { en: "per page", pl: "na stronę" },
  "page_of_total": { en: "Page", pl: "Strona" },
  "of": { en: "of", pl: "z" },
  "select_at_least_one_sitemap": { en: "Please select at least one sitemap", pl: "Wybierz co najmniej jedną mapę strony" },
  "no_urls_to_process": { en: "There are no URLs to process", pl: "Brak adresów URL do przetworzenia" },
  "found_urls": { en: "Found %count% URLs", pl: "Znaleziono %count% adresów URL" },

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

  // Website URL form translations
  "enter_domain_url": {
    en: "Enter domain URL (e.g. example.com)",
    pl: "Wprowadź adres domeny (np. example.com)"
  },
  "please_enter_website_url": {
    en: "Please enter a website URL",
    pl: "Proszę wprowadzić adres strony"
  },
  "could_not_search_website": {
    en: "Could not search website",
    pl: "Nie udało się przeszukać strony"
  },
  "domain": {
    en: "Domain",
    pl: "Domena"
  },
  "sitemap": {
    en: "Sitemap",
    pl: "Mapa strony"
  },
  "execution_time": {
    en: "Execution time",
    pl: "Czas wykonania"
  },

  // New keys for SitemapSearch
  "project_id_missing": {
    en: "Project ID is missing. Cannot proceed.",
    pl: "Brakuje ID projektu. Nie można kontynuować."
  },
  "continue_to_processing": {
    en: "Continue to Processing",
    pl: "Kontynuuj do przetwarzania"
  },
  "processing_state": {
    en: "Processing...",
    pl: "Przetwarzanie..."
  },
  "website_domain_label": {
    en: "Website Domain",
    pl: "Domena strony"
  },
  "website_domain_placeholder": {
    en: "Enter website domain (e.g., example.com)",
    pl: "Wprowadź domenę strony (np. example.com)"
  },
  "sitemap_url_label": {
    en: "Sitemap URL",
    pl: "URL Sitemap"
  },
  "sitemap_url_placeholder": {
    en: "Enter sitemap URL (e.g., example.com/sitemap.xml)",
    pl: "Wprowadź URL sitemapy (np. example.com/sitemap.xml)"
  },
  "url_source_tab": {
    en: "URL Source",
    pl: "Źródło URL"
  },

  // Protected routes and authorization messages
  "protected_route_message": {
    en: "You need to be logged in to access this page",
    pl: "Musisz być zalogowany, aby uzyskać dostęp do tej strony"
  },
  "redirecting_to_login": {
    en: "Redirecting to login page...",
    pl: "Przekierowywanie do strony logowania..."
  },
  "already_logged_in": {
    en: "You are already logged in",
    pl: "Jesteś już zalogowany"
  },
  "redirecting_to_app": {
    en: "Redirecting to application...",
    pl: "Przekierowywanie do aplikacji..."
  },
  "session_expired": {
    en: "Session expired or invalid. Please log in again.",
    pl: "Sesja wygasła lub jest nieprawidłowa. Proszę zalogować się ponownie."
  },
  "unauthorized_access": {
    en: "Unauthorized access",
    pl: "Nieautoryzowany dostęp"
  },
  "unauthorized": { en: "Unauthorized", pl: "Brak autoryzacji" },

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

  // Auth related translations
  "auth.pleaseLogin": { en: "Please log in to access this page", pl: "Zaloguj się, aby uzyskać dostęp do tej strony" },
  "auth.sessionExpired": { en: "Your session has expired. Please log in again", pl: "Twoja sesja wygasła. Zaloguj się ponownie" },
  "Info": { en: "Info", pl: "Informacja" },
  "Error": { en: "Error", pl: "Błąd" },
  "please_enter_url": {
    en: "Please enter URL",
    pl: "Proszę wprowadzić adres URL"
  },
  "enter_domain": {
    en: "Enter domain name",
    pl: "Wprowadź nazwę domeny"
  },
  "enter_sitemap": {
    en: "Enter sitemap URL",
    pl: "Wprowadź adres sitemapy"
  },
  "project_not_created": {
    en: "Project could not be created",
    pl: "Nie udało się utworzyć projektu"
  },
  "could_not_save_sitemaps": {
    en: "Could not save sitemaps",
    pl: "Nie udało się zapisać sitemapów"
  },
  "please_select_at_least_one_sitemap": {
    en: "Please select at least one sitemap to continue.",
    pl: "Proszę wybrać co najmniej jedną sitemapę, aby kontynuować."
  },

  // Key for progress status text
  "progress_status_text": {
    en: "Step %current%/%total%, progress %value% %unit%, next in %time% sec",
    pl: "Krok %current%/%total%, postęp %value% %unit%, następny za %time% sek"
  },

  // New translations for sitemap results
  "sitemap_url_header": {
    en: "Sitemap URL",
    pl: "URL Sitemap"
  },
  "select_header": {
    en: "Select",
    pl: "Wybierz"
  },

  // Keys from AppHeader
  "menu": { en: "Menu", pl: "Menu" },

  // Keys from HighchartsTreeMap
  "pages_count": { en: "Pages Count", pl: "Liczba stron" },

  // Keys from AnalysisResults
  "date": { en: "Date", pl: "Data" },
  "title": { en: "Title", pl: "Tytuł" },
  "exploration_details": { en: "Exploration Details", pl: "Szczegóły eksploracji" },
  "url_analysis_description": { en: "Detailed analysis of individual URLs and their relation to the site's overall focus.", pl: "Szczegółowa analiza poszczególnych adresów URL i ich związku z ogólnym ukierunkowaniem witryny." },
  "progress_status_text_sitemap": { en: "Step %step%/5, Progress %progress%%, ETA %timeRemaining%s", pl: "Krok %step%/5, Postęp %progress%%, ETA %timeRemaining%s" },
  "select_all": { en: "Select All", pl: "Zaznacz wszystko" },

  "fetch_urls_for_selected_sitemaps": {
    en: "Fetch URLs for selected sitemaps",
    pl: "Pobierz adresy URL dla wybranych sitemap"
  },

  "process_filtered_urls": {
    en: "Process %count% Filtered URLs",
    pl: "Przetwórz %count% wyfiltrowanych URL-i"
  }
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
