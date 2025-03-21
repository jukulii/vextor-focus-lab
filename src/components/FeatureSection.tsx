
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Zap, BarChart, Activity, Rocket, Target } from 'lucide-react';

const FeatureSection = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay focused. Rank higher
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('new_era_subtitle')}
          </p>
          <div className="w-24 h-1 bg-vextor-500 mx-auto mt-6"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mt-16 hidden">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-vextor-100 rounded-lg flex items-center justify-center mb-6">
              <Rocket className="h-6 w-6 text-vextor-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('benefit_1_title')}
            </h3>
            <p className="text-gray-600">
              {t('benefit_1_desc')}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('benefit_2_title')}
            </h3>
            <p className="text-gray-600">
              {t('benefit_2_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
