
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const hoverColor = isDark ? 'hover:text-[#788be4]' : 'hover:text-[#788be4]';
  const bgClass = scrolled 
    ? isDark 
      ? 'bg-black/90 backdrop-blur-md shadow-md py-3' 
      : 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
    : 'bg-transparent py-5';
  const mobileMenuBg = isDark ? 'bg-gray-900' : 'bg-white';
  const mobileBorderColor = isDark ? 'border-gray-800' : 'border-gray-100';

  const navItems = [
    { href: "#", label: t('home'), onClick: scrollToTop },
    { href: "#how-it-works", label: t('how_it_works') },
    { href: "#features", label: t('features') },
    { href: "#pricing", label: t('pricing') },
    { href: "#faq", label: t('faq') }, // Added FAQ link to navigation
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c6aa9c7b-1857-434c-8a40-1fbc3582346a.png" 
                alt="Vextor Logo" 
                className="h-16 w-auto object-contain sm:h-20" 
              />
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                onClick={item.onClick}
                className={`${textColor} ${hoverColor} transition-colors font-medium`}
              >
                {item.label}
              </a>
            ))}
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
              <Button variant="default" className="bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg">
                {t('get_started')}
              </Button>
            </Link>
            
            {/* Mobile menu with Drawer */}
            <div className="md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className={textColor}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className={`${mobileMenuBg} p-4`}>
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className={`text-lg font-bold ${textColor}`}>Menu</h2>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className={textColor}>
                          <X className="h-5 w-5" />
                        </Button>
                      </DrawerClose>
                    </div>
                    
                    {navItems.map((item, index) => (
                      <DrawerClose asChild key={index}>
                        <a 
                          href={item.href} 
                          onClick={item.onClick}
                          className={`${textColor} ${hoverColor} font-medium py-2 block`}
                        >
                          {item.label}
                        </a>
                      </DrawerClose>
                    ))}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
