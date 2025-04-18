
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Menu, LogIn, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

const AppHeader = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToSection = (sectionId: string) => {
    // Navigate to landing page first if not already there
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const bgClass = scrolled 
    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-3 border-b border-gray-200 dark:border-gray-800 shadow-sm'
    : 'bg-transparent py-5';

  const navItems = [
    { href: "/app", label: t('home'), onClick: null },
    { href: "#how-it-works", label: t('how_it_works'), onClick: () => navigateToSection('how-it-works') },
    { href: "#features", label: t('features'), onClick: () => navigateToSection('features') },
    { href: "#pricing", label: t('pricing'), onClick: () => navigateToSection('pricing') },
    { href: "#faq", label: t('faq'), onClick: () => navigateToSection('faq') },
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
              item.onClick ? (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="text-gray-900 dark:text-white hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors font-medium"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className="text-gray-900 dark:text-white hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
          
          {/* Desktop actions */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-900 dark:text-white hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors"
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

            <DarkModeToggle />

            {isAuthenticated ? (
              <Button
                variant="default" 
                className="bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout') || 'Logout'}</span>
              </Button>
            ) : (
              <Button
                variant="default"
                className="bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4" />
                <span>{t('login') || 'Login'}</span>
              </Button>
            )}
            
            {/* Mobile menu */}
            <div className="md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4 bg-white dark:bg-gray-900">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('menu') || 'Menu'}</h2>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white">
                          <span className="sr-only">Close</span>
                          ×
                        </Button>
                      </DrawerClose>
                    </div>
                    
                    {navItems.map((item, index) => (
                      <DrawerClose asChild key={index}>
                        {item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className="text-gray-900 dark:text-white hover:text-[#788be4] dark:hover:text-[#788be4] font-medium py-2 block w-full text-left"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className="text-gray-900 dark:text-white hover:text-[#788be4] dark:hover:text-[#788be4] font-medium py-2 block"
                          >
                            {item.label}
                          </Link>
                        )}
                      </DrawerClose>
                    ))}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <DarkModeToggle />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-900 dark:text-white"
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
                    </div>
                    
                    {isAuthenticated ? (
                      <Button
                        variant="default"
                        className="flex items-center justify-center gap-2 w-full bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg mt-4"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('logout') || 'Logout'}</span>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="flex items-center justify-center gap-2 w-full bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg mt-4"
                        onClick={() => navigate('/login')}
                      >
                        <LogIn className="h-4 w-4" />
                        <span>{t('login') || 'Login'}</span>
                      </Button>
                    )}
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

export default AppHeader;
