
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

const AppHeader = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <header className="bg-gray-200/80 backdrop-blur-sm border-b border-gray-300">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-vextor-700 font-bold text-xl">
            Vextor
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
