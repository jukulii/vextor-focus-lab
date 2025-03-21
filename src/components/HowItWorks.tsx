
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, MousePointerClick, LineChart, Lightbulb, ArrowDown, Globe, Cog, BarChart3, PieChart } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: "Add sitemap or domain",
      icon: Globe,
      description: "Enter sitemap or domain to begin the analysis process"
    },
    {
      title: t('step_2'),
      icon: Cog,
      description: "Our AI analyzes your site's content and structure"
    },
    {
      title: t('step_3'),
      icon: BarChart3,
      description: "Review detailed insights about your content focus"
    },
    {
      title: t('step_4'),
      icon: PieChart,
      description: "Get actionable recommendations to improve your SEO"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block border-b-2 border-vextor-500 pb-2 mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('how_it_works_title')}
            </h2>
          </div>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Follow these simple steps to optimize your content
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-3 max-w-lg mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="w-full">
              <div className="bg-white hover:bg-gray-50 border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 w-full flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-vextor-100 to-blue-100 rounded-full flex items-center justify-center mt-1 mb-4">
                  <step.icon className="h-7 w-7 text-vextor-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="py-2 flex justify-center">
                  <ArrowDown className="h-6 w-6 text-vextor-500 animate-pulse-subtle" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
