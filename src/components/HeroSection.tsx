
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const HeroSection = () => {
  const { t, language } = useLanguage();
  
  return (
    <section className="pt-48 pb-24 md:pt-64 md:pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-3xl mx-auto z-10">
            <div className="mb-6 inline-block">
              <span className="bg-[#ff6b6b]/20 text-[#ff6b6b] px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center border border-[#ff6b6b]/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Empower Your Content Strategy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 fade-in leading-tight">
              Analyze your website topical focus
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 fade-in stagger-1 max-w-2xl mx-auto text-balance">
              {language === 'pl' ? 'Zoptymalizuj treść. Zbuduj autorytet. Wygraj wyścig o widoczność.' : t('hero_subtitle')}
            </p>
            <div className="space-x-4 fade-in stagger-2">
              <Link to="/app">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b]/10 px-8 py-6 text-lg transition-all duration-300"
                >
                  Try For Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
