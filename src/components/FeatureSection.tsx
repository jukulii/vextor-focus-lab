
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Zap, BarChart, Activity, Rocket, Target } from 'lucide-react';

const FeatureSection = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-16 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-vextor-900 text-vextor-300 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay focused. Rank higher
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Vextor helps you evaluate and improve your website's content relevance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-900 rounded-xl p-8 shadow-md border border-gray-800 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-vextor-900 to-blue-900 rounded-lg flex items-center justify-center mb-6">
              <Rocket className="h-6 w-6 text-vextor-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('benefit_1_title')}
            </h3>
            <p className="text-gray-300">
              {t('benefit_1_desc')}
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-8 shadow-md border border-gray-800 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('benefit_2_title')}
            </h3>
            <p className="text-gray-300">
              {t('benefit_2_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
