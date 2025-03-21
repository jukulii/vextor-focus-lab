
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 fade-in">
            {t('hero_title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 fade-in stagger-1 max-w-2xl mx-auto text-balance">
            {t('hero_subtitle')}
          </p>
          <div className="space-x-4 fade-in stagger-2">
            <Link to="/app">
              <Button 
                size="lg" 
                className="bg-vextor-600 hover:bg-vextor-700 transition-colors button-glow px-8 py-6 text-lg"
              >
                {t('get_started')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-screen -z-10 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-vextor-200 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;
