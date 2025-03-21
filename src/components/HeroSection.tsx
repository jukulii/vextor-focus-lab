
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="pt-36 pb-16 md:pt-48 md:pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-3xl mx-auto z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 fade-in leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-gray-500 mb-8 fade-in stagger-1 max-w-2xl mx-auto text-balance">
              {t('hero_subtitle')}
            </p>
            <div className="space-x-4 fade-in stagger-2">
              <Link to="/app">
                <Button 
                  size="lg" 
                  className="bg-vextor-600 hover:bg-vextor-700 transition-all duration-300 button-glow px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                >
                  Analyze
                  <Rocket className="ml-2 h-5 w-5" />
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
