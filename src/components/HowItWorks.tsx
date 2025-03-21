
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, MousePointerClick, LineChart, Lightbulb, ArrowRight, Globe, Cog, BarChart3, PieChart } from 'lucide-react';

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
    <section id="how-it-works" className="py-16 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block border-b-2 border-vextor-500 pb-2 mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t('how_it_works_title')}
            </h2>
          </div>
          <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
            Follow these simple steps to optimize your content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-900 hover:bg-gray-800 border-2 border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-vextor-900 to-blue-900 rounded-full flex items-center justify-center mt-1 mb-4">
                  <step.icon className="h-7 w-7 text-vextor-400" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-vextor-500 animate-pulse-subtle" />
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
