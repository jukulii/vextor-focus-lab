
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Zap, BarChart, Activity, Rocket, Target, Star } from 'lucide-react';

const FeatureSection = () => {
  const {
    t,
    language
  } = useLanguage();
  
  return (
    <section id="features" className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-[#ff6b6b]/20 text-[#ff6b6b] px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4 border border-[#ff6b6b]/30">
            <Star className="w-4 h-4 inline-block mr-2" />
            {language === 'pl' ? "Funkcje" : "Features"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {language === 'pl' ? "Skup się na temacie. Bądź wyżej w wynikach" : "Stay focused. Rank higher"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-700">
            {language === 'pl' 
              ? "Vextor AI pomaga właścicielom stron i specjalistom SEO zrozumieć koncentrację tematyczną witryny — wykorzystując te same techniki, które stosuje Google."
              : "Vextor AI helps website owners, SEOs, and content strategists understand how semantically focused their websites are — using the same techniques Google likely uses."
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] bg-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-24 h-24 bg-[#ff6b6b]/5 rounded-full"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#8da2e5] to-[#7a8fd2] rounded-lg flex items-center justify-center mb-6 relative">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {language === 'pl' ? "Analiza tematyczna całej domeny" : t('benefit_1_title')}
            </h3>
            <p className="font-normal text-gray-700">
              {language === 'pl' ? "Odkryj, jak bardzo skupiona tematycznie jest Twoja strona i jakie tematy najbardziej wpływają na Twój autorytet." : t('benefit_1_desc')}
            </p>
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-[#ff6b6b]" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] bg-white relative overflow-hidden">
            <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-[#ff6b6b]/5 rounded-full"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#8da2e5] to-[#7a8fd2] rounded-lg flex items-center justify-center mb-6 relative">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {language === 'pl' ? "Identyfikacja słabych punktów" : t('benefit_2_title')}
            </h3>
            <p className="text-gray-700">
              {language === 'pl' ? "Znajdź podstrony, które osłabiają tematyczną spójność witryny i negatywnie wpływają na widoczność w wyszukiwarkach." : t('benefit_2_desc')}
            </p>
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-[#ff6b6b]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
