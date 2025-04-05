
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const {
    t,
    language
  } = useLanguage();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/c6aa9c7b-1857-434c-8a40-1fbc3582346a.png" 
                alt="Vextor Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
            <p className="max-w-md text-gray-600">
              {language === 'pl' 
                ? "Zaawansowane narzędzie do analizy stron, poprawiające koncentrację treści i wydajność SEO." 
                : "Advanced website analysis tool to improve your content focus and SEO performance."}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                {language === 'pl' ? "Produkt" : "Product"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Funkcje" : "Features"}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Cennik" : "Pricing"}
                  </a>
                </li>
                <li>
                  <Link to="/app" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Rozpocznij" : "Get Started"}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                {language === 'pl' ? "Zasoby" : "Resources"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Dokumentacja" : "Documentation"}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Blog" : "Blog"}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "FAQ" : "FAQ"}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                {language === 'pl' ? "Prawne" : "Legal"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Polityka prywatności" : "Privacy Policy"}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {language === 'pl' ? "Warunki korzystania" : "Terms of Service"}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            {language === 'pl' 
              ? "© 2025 Vextor. Wszelkie prawa zastrzeżone." 
              : "© 2025 Vextor. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
