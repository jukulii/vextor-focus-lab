import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, Menu, X, LogIn, LogOut, User } from 'lucide-react';
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
import DarkModeToggle from '@/components/DarkModeToggle';

interface NavbarProps {
  isDark?: boolean;
}

const Navbar = ({ isDark = false }: NavbarProps) => {
  const {
    t,
    language,
    setLanguage
  } = useLanguage();
  const { isAuthenticated, session, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (location.pathname === '/') {
      // If already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on another page (like login), navigate to home
      navigate('/');
    }
  };

  const handleSectionClick = (sectionId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (location.pathname === '/') {
      // If already on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home with hash
      navigate(`/#${sectionId}`);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const textColor = isDark ? 'text-white' : 'text-gray-700 dark:text-white';
  const hoverColor = isDark ? 'hover:text-[#788be4]' : 'hover:text-[#788be4]';
  const bgClass = scrolled
    ? isDark
      ? 'bg-black/90 backdrop-blur-md shadow-md py-3 dark:bg-gray-900/90'
      : 'bg-white/90 backdrop-blur-md shadow-sm py-3 dark:bg-gray-900/90'
    : 'bg-transparent py-5';
  const mobileMenuBg = isDark ? 'bg-gray-900' : 'bg-white dark:bg-gray-900';
  const mobileBorderColor = isDark ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800';

  const navItems = [
    { href: "/", label: t('home'), onClick: handleHomeClick },
    { href: "#how-it-works", label: t('how_it_works'), onClick: handleSectionClick('how-it-works') },
    { href: "#features", label: t('features'), onClick: handleSectionClick('features') },
    { href: "#pricing", label: t('pricing'), onClick: handleSectionClick('pricing') },
    { href: "#faq", label: t('faq'), onClick: handleSectionClick('faq') },
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
            <DarkModeToggle />

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

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`${textColor} ${hoverColor} transition-colors flex items-center gap-2`}>
                    <User className="h-4 w-4" />
                    {session?.user?.user_metadata?.display_name || session?.user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/app')} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard">
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    {t('go_to_app') || "Go to App"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    {t('logout') || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                className="bg-[#788be4] hover:bg-[#6678d0] dark:bg-[#788be4] dark:hover:bg-[#6678d0] transition-colors button-glow shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={handleLoginClick}
              >
                <LogIn className="h-4 w-4" />
                {t('login') || "Log In"}
              </Button>
            )}

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
                      <div className="flex items-center gap-2">
                        <DarkModeToggle />
                        <DrawerClose asChild>
                          <Button variant="ghost" size="icon" className={textColor}>
                            <X className="h-5 w-5" />
                          </Button>
                        </DrawerClose>
                      </div>
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

                    {isAuthenticated && (
                      <DrawerClose asChild>
                        <button
                          onClick={handleLogout}
                          className={`${textColor} ${hoverColor} font-medium py-2 block text-left w-full flex items-center gap-2`}
                        >
                          <LogOut className="h-4 w-4" />
                          {t('logout') || "Logout"}
                        </button>
                      </DrawerClose>
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

export default Navbar;
