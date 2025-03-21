
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, MousePointerClick, LineChart, Lightbulb, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('step_1'),
      icon: SearchIcon,
      description: "Enter sitemap or domain to begin the analysis process"
    },
    {
      title: t('step_2'),
      icon: MousePointerClick,
      description: "Our AI analyzes your site's content and structure"
    },
    {
      title: t('step_3'),
      icon: LineChart,
      description: "Review detailed insights about your content focus"
    },
    {
      title: t('step_4'),
      icon: Lightbulb,
      description: "Get actionable recommendations to improve your SEO"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block border-2 border-gray-800 rounded-full px-8 py-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('how_it_works_title')}
            </h2>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="bg-white border-2 border-gray-800 rounded-xl p-6 w-full md:w-52 h-40 flex flex-col justify-center items-center text-center">
                <step.icon className="h-8 w-8 mb-3 text-vextor-600" />
                <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center mx-2">
                  <ArrowRight className="h-6 w-6 text-gray-800" />
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
