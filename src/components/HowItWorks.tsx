
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, MousePointerClick, LineChart, Lightbulb } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('step_1'),
      icon: SearchIcon,
      description: "Enter your website URL to begin the analysis process"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('how_it_works_title')}
          </h2>
          <div className="w-24 h-1 bg-vextor-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className={`step ${index === 0 ? 'active' : ''}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
          
          {/* Progress line between steps */}
          <div className="hidden md:block absolute top-5 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-0.5 bg-gray-200 z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
