
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Cog, BarChart3, PieChart, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: "Add sitemap or domain",
      icon: Globe,
      description: "Enter sitemap or domain to begin the analysis process"
    },
    {
      title: "AI analyzes content",
      icon: Cog,
      description: "Our AI analyzes your site's content and structure"
    },
    {
      title: "Review focus insights",
      icon: BarChart3,
      description: "Review detailed insights about your content focus"
    },
    {
      title: "Optimize content strategy",
      icon: PieChart,
      description: "Get actionable recommendations to improve your SEO"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block border-b-2 border-vextor-500 pb-2 mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100">
              {t('how_it_works_title')}
            </h2>
          </div>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Follow these simple steps to optimize your content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-[#1A1F2C] rounded-lg p-6 shadow-lg flex flex-col items-center text-center h-full border border-gray-800">
                <div className="w-16 h-16 bg-[#0E3866] rounded-full flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-[#38bbf8]" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-[#38bbf8]" />
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
