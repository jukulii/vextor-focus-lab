import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, MousePointerClick, LineChart, Lightbulb, ArrowRight, Globe, Cog, BarChart3, PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    description: "Our AI analyzes your site's content and structure"
  }, {
    title: t('step_3'),
    icon: BarChart3,
    description: "Review detailed insights about your content focus"
  }, {
    title: t('step_4'),
    icon: PieChart,
    description: "Get actionable recommendations to improve your SEO"
  }];
  return <section id="how-it-works" className="py-16">
      <Separator className="h-[2px] bg-gray-800/30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
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
              <div className="border border-gray-800/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full bg-transparent">
                <div className="w-16 h-16 bg-gradient-to-br from-vextor-500 to-blue-500 rounded-full flex items-center justify-center mt-1 mb-4">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-zinc-50">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-vextor-500 animate-pulse-subtle" />
                </div>}
            </div>)}
        </div>
      </div>
    </section>;
};
export default HowItWorks;
