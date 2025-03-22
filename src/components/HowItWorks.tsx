
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, MousePointerClick, LineChart, Lightbulb, ArrowRight, Globe, Cog, BarChart3, PieChart } from 'lucide-react';

const HowItWorks = () => {
  const {
    t
  } = useLanguage();
  
  const steps = [{
    title: "Add sitemap or domain",
    icon: Globe,
    description: "Enter sitemap or domain to begin the analysis process"
  }, {
    title: t('step_2'),
    icon: Cog,
    description: "Using the same techniques used by Google and LLMs"
  }, {
    title: "Get your Site Focus & Radius scores",
    icon: BarChart3,
    description: "Plus smart recommendations on what to improve"
  }, {
    title: t('step_4'),
    icon: PieChart,
    description: "And share it with your team or clients"
  }];
  
  return <section id="how-it-works" className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block border-b-2 border-vextor-500 pb-2 mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
              {t('how_it_works_title')}
            </h2>
          </div>
          <p className="text-lg mt-4 max-w-2xl mx-auto text-zinc-400">
            Follow these simple steps to optimize your content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => <div key={index} className="relative">
              <div className="border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full bg-transparent min-h-[200px]">
                <div className="w-12 h-12 bg-gradient-to-br from-vextor-500 to-blue-500 rounded-full flex items-center justify-center mb-3">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-base font-bold text-zinc-50">{step.title}</h3>
                <div className="mt-auto">
                  <p className="text-sm text-zinc-400">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-vextor-500 animate-pulse-subtle" />
                </div>}
            </div>)}
        </div>
      </div>
    </section>;
};

export default HowItWorks;
