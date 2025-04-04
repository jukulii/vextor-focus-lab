
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const {
    t
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
              Advanced website analysis tool to improve your content focus and SEO performance.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/app" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {t('privacy_policy')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-vextor-600 transition-colors">
                    {t('terms_of_service')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            © 2025 Vextor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
