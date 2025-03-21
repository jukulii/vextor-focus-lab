
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Zap, BarChart, Activity, Rocket, Target } from 'lucide-react';

const FeatureSection = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-[#0E3866] text-[#38bbf8] px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            Stay focused. Rank higher
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Vextor helps you evaluate and improve your website's content relevance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#1A1F2C] rounded-lg p-8 shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-[#0E3866] rounded-full flex items-center justify-center mb-6">
              <Rocket className="h-6 w-6 text-[#38bbf8]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('benefit_1_title')}
            </h3>
            <p className="text-gray-400">
              {t('benefit_1_desc')}
            </p>
          </div>
          
          <div className="bg-[#1A1F2C] rounded-lg p-8 shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-[#0E3866] rounded-full flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-[#38bbf8]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('benefit_2_title')}
            </h3>
            <p className="text-gray-400">
              {t('benefit_2_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
