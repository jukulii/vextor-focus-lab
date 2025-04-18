
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('vextor-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vextor-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vextor-theme', 'dark');
    }
    
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Toggle
      pressed={isDarkMode}
      onPressedChange={toggleDarkMode}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
    >
      {isDarkMode ? 
        <Moon className="h-5 w-5 text-blue-300" /> : 
        <Sun className="h-5 w-5 text-amber-500" />
      }
    </Toggle>
  );
};

export default DarkModeToggle;
