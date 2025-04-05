
import { Link } from 'react-router-dom';
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
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

const AppHeader = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
            <Link to="/app" className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors font-medium">
              {t('home') || 'Home'}
            </Link>
            <Link to="/sitemaps" className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors font-medium">
              {t('sitemaps') || 'Sitemaps'}
            </Link>
            <Link to="/results" className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors font-medium">
              {t('results') || 'Results'}
            </Link>
          </div>
          
          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] transition-colors"
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

            {isAuthenticated ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout') || 'Logout'}</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg"
              >
                <LogIn className="h-4 w-4" />
                <span>{t('login') || 'Login'}</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-4 bg-white dark:bg-gray-900">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">{t('menu') || 'Menu'}</h2>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                        <span className="sr-only">Close</span>
                        ×
                      </Button>
                    </DrawerClose>
                  </div>
                  
                  <DrawerClose asChild>
                    <Link to="/app" className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] font-medium py-2 block">
                      {t('home') || 'Home'}
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link to="/sitemaps" className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] font-medium py-2 block">
                      {t('sitemaps') || 'Sitemaps'}
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link to="/results" className="text-gray-700 dark:text-gray-300 hover:text-[#788be4] dark:hover:text-[#788be4] font-medium py-2 block">
                      {t('results') || 'Results'}
                    </Link>
                  </DrawerClose>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <DarkModeToggle />
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-700 dark:text-gray-300"
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
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg mt-4"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout') || 'Logout'}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="flex items-center justify-center gap-2 w-full bg-[#788be4] hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg mt-4"
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
    </header>
  );
};

export default AppHeader;
