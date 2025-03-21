import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Zap, BarChart, Activity, Rocket, Target } from 'lucide-react';
const FeatureSection = () => {
  const {
    t
  } = useLanguage();
  return <section id="features" className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-vextor-100 text-vextor-700 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-50">
            Stay focused. Rank higher
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-zinc-400">
            Vextor helps you evaluate and improve your website's content relevance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] bg-transparent">
            <div className="w-14 h-14 bg-gradient-to-br from-vextor-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-zinc-50">
              {t('benefit_1_title')}
            </h3>
            <p className="font-normal text-zinc-400">
              {t('benefit_1_desc')}
            </p>
          </div>
          
          <div className="rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] bg-transparent">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-zinc-50">
              {t('benefit_2_title')}
            </h3>
            <p className="text-zinc-400">
              {t('benefit_2_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default FeatureSection;