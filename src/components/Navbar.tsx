
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <div className="text-vextor-600 font-bold text-2xl tracking-tight">
                Vextor
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-vextor-600 transition-colors font-medium"
            >
              {t('home')}
            </Link>
            <a 
              href="#features" 
              className="text-gray-700 hover:text-vextor-600 transition-colors font-medium"
            >
              {t('features')}
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-700 hover:text-vextor-600 transition-colors font-medium"
            >
              {t('how_it_works')}
            </a>
            <a 
              href="#pricing" 
              className="text-gray-700 hover:text-vextor-600 transition-colors font-medium"
            >
              {t('pricing')}
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-700 hover:text-vextor-600 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className={language === 'en' ? 'bg-secondary' : ''}
                  onClick={() => setLanguage('en')}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={language === 'pl' ? 'bg-secondary' : ''}
                  onClick={() => setLanguage('pl')}
                >
                  Polski
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/app">
              <Button 
                variant="default" 
                className="bg-vextor-600 hover:bg-vextor-700 transition-colors button-glow"
              >
                {t('get_started')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
