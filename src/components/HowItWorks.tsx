
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
    <section id="how-it-works" className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-block border-2 border-gray-800 rounded-full px-8 py-3 mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('how_it_works_title')}
            </h2>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          {steps.map((step, index) => (
            <div key={index} className="w-full max-w-lg flex flex-col items-center">
              <div className="bg-white border-2 border-gray-800 rounded-xl p-5 w-full flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mt-1 mb-3">
                  <step.icon className="h-6 w-6 text-vextor-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="py-1">
                  <ArrowDown className="h-6 w-6 text-gray-800" />
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
