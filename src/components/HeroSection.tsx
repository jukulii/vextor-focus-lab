
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="text-center md:text-left md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 fade-in leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 fade-in stagger-1 max-w-2xl mx-auto md:mx-0 text-balance">
              {t('hero_subtitle')}
            </p>
            <div className="space-x-4 fade-in stagger-2">
              <Link to="/app">
                <Button 
                  size="lg" 
                  className="bg-vextor-600 hover:bg-vextor-700 transition-all duration-300 button-glow px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                >
                  {t('analyse')}
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 md:mt-0 md:w-1/2 relative z-0 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-vextor-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
              <div className="relative bg-white/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="bg-gradient-to-br from-vextor-50 to-blue-50 rounded-xl p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2.5 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-2.5 bg-vextor-300 rounded-full w-2/3"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
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
