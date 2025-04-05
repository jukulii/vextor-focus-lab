
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUpRight, UserCheck, Search, Trophy, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', before: 30, after: 45 },
  { name: 'Feb', before: 35, after: 60 },
  { name: 'Mar', before: 40, after: 70 },
  { name: 'Apr', before: 32, after: 75 },
  { name: 'May', before: 45, after: 90 },
  { name: 'Jun', before: 50, after: 100 }
];

const BenefitSection = () => {
  const { t, language } = useLanguage();
  
  const benefits = [
    {
      icon: ArrowUpRight,
      title: language === 'pl' ? "Grupuj i wizualizuj strukturę strony według tematów semantycznych" : "Cluster and visualize site structure by semantic topics",
      iconColor: 'text-[#ff6b6b]',
      bgColor: 'bg-[#ff6b6b]/10'
    }, 
    {
      icon: UserCheck,
      title: language === 'pl' ? "Zidentyfikuj nieistotne lub mało wartościowe treści" : "Identify irrelevant or weak content",
      iconColor: 'text-[#ff6b6b]',
      bgColor: 'bg-[#ff6b6b]/10'
    }, 
    {
      icon: Search,
      title: "Eliminate content that drags your rankings down",
      iconColor: 'text-[#ff6b6b]',
      bgColor: 'bg-[#ff6b6b]/10'
    }, 
    {
      icon: Trophy,
      title: "Measure Site Focus & Site Radius",
      iconColor: 'text-[#ff6b6b]',
      bgColor: 'bg-[#ff6b6b]/10'
    }
  ];

  return (
    <section className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-[#ff6b6b]/20 text-[#ff6b6b] px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4 border border-[#ff6b6b]/30">
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            Benefits
          </span>
          <h2 className="text-3xl md:text-4xl mb-4 font-bold text-gray-900">
            {language === 'pl' ? 'Zrezygnuj z "na zdrowy rozum". Zaufaj danym.' : 'Improve your SEO performance'}
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-700">
            {language === 'pl' ? 'Optymalizuj treści i osiągaj wyższe pozycje' : 'Optimize your content and achieve higher rankings'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 ${benefit.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
