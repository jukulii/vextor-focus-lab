import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
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
import { LogIn, LogOut } from 'lucide-react';

const AppHeader = () => {
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/5634c72d-5100-496b-ade4-9da06c56eda0.png"
              alt="Vextor Logo"
              className="h-10 w-auto object-contain mix-blend-multiply"
            />
            <span className="text-vextor-700 dark:text-vextor-400 font-bold text-xl">
              Vextor
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 dark:text-gray-300 hover:text-vextor-600 dark:hover:text-vextor-400 transition-colors"
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
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
