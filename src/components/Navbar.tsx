
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isDark?: boolean;
}

const Navbar = ({ isDark = false }: NavbarProps) => {
  const {
    t,
    language,
    setLanguage
  } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const hoverColor = isDark ? 'hover:text-vextor-400' : 'hover:text-vextor-600';
  const bgClass = scrolled 
    ? isDark 
      ? 'bg-black/90 backdrop-blur-md shadow-md py-3' 
      : 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
    : 'bg-transparent py-5';
  const mobileMenuBg = isDark ? 'bg-gray-900' : 'bg-white';
  const mobileBorderColor = isDark ? 'border-gray-800' : 'border-gray-100';

  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/5634c72d-5100-496b-ade4-9da06c56eda0.png" alt="Vextor Logo" className="h-20 w-auto object-contain mix-blend-multiply" />
              <div className={`${isDark ? 'text-white' : 'text-vextor-600'} font-bold text-2xl tracking-tight`}>
                Vextor
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" onClick={scrollToTop} className={`${textColor} ${hoverColor} transition-colors font-medium`}>
              {t('home')}
            </a>
            <a href="#how-it-works" className={`${textColor} ${hoverColor} transition-colors font-medium`}>
              {t('how_it_works')}
            </a>
            <a href="#features" className={`${textColor} ${hoverColor} transition-colors font-medium`}>
              {t('features')}
            </a>
            <a href="#pricing" className={`${textColor} ${hoverColor} transition-colors font-medium`}>
              {t('pricing')}
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`${textColor} ${hoverColor} transition-colors`}>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className={language === 'en' ? 'bg-secondary' : ''} onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem className={language === 'pl' ? 'bg-secondary' : ''} onClick={() => setLanguage('pl')}>
                  Polski
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/app">
              <Button variant="default" className="bg-vextor-600 hover:bg-vextor-700 transition-colors button-glow shadow-md hover:shadow-lg">
                {t('get_started')}
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className={`md:hidden ${textColor}`} onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && <div className={`md:hidden ${mobileMenuBg} mt-3 p-4 rounded-lg shadow-lg border ${mobileBorderColor} animate-fade-in`}>
            <div className="flex flex-col space-y-4">
              <a href="#" onClick={scrollToTop} className={`${textColor} ${hoverColor} font-medium py-2`}>
                {t('home')}
              </a>
              <a href="#how-it-works" className={`${textColor} ${hoverColor} font-medium py-2`} onClick={() => setMobileMenuOpen(false)}>
                {t('how_it_works')}
              </a>
              <a href="#features" className={`${textColor} ${hoverColor} font-medium py-2`} onClick={() => setMobileMenuOpen(false)}>
                {t('features')}
              </a>
              <a href="#pricing" className={`${textColor} ${hoverColor} font-medium py-2`} onClick={() => setMobileMenuOpen(false)}>
                {t('pricing')}
              </a>
            </div>
          </div>}
      </div>
    </nav>;
};

export default Navbar;
