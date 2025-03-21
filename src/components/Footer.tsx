
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
const Footer = () => {
  const {
    t
  } = useLanguage();
  return <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="text-vextor-500 font-bold text-2xl mb-4">Vextor</div>
            <p className="max-w-md text-zinc-400">
              Advanced website analysis tool to improve your content focus and SEO performance.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/app" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    {t('privacy_policy')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-vextor-500 transition-colors">
                    {t('terms_of_service')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
