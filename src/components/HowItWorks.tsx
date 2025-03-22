
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "1",
      title: "Enter your sitemap or domain",
      description: "Enter sitemap or domain to begin the analysis process"
    }, 
    {
      number: "2",
      title: "We crawl your pages",
      description: "Using the same techniques used by Google and LLMs and calculate key metrics"
    }, 
    {
      number: "3",
      title: "Talk to the editor to design and extend your project.",
      description: "Plus smart recommendations on what to improve"
    }, 
    {
      number: "4",
      title: "Share your project via link or sync your code to GitHub.",
      description: "And share it with your team or clients"
    }
  ];
  
  return (
    <section id="how-it-works" className="py-16 border-t border-gray-200">
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
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center mb-8 md:mb-0 text-center max-w-[250px]">
              <div className="bg-zinc-800/80 w-14 h-14 rounded-md flex items-center justify-center mb-6 relative">
                <span className="text-xl font-bold text-white">{step.number}</span>
                
                {/* Connecting line between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute w-24 md:w-[100px] lg:w-[120px] xl:w-[150px] h-[1px] bg-zinc-700 left-full top-1/2 transform -translate-y-1/2"></div>
                )}
              </div>
              
              <p className="text-zinc-50 text-sm md:text-base font-medium text-center leading-tight mb-1">
                {step.title}
              </p>
              <p className="text-zinc-400 text-xs md:text-sm mt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
