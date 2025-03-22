
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const {
    t
  } = useLanguage();
  
  // Keep only the Pro plan
  const pricingPlan = {
    name: "Pay-as-You-Go",
    price: '49',
    description: t('price_pro_desc'),
    features: ['Charge based on what you actually use', 'Up to 1,000 pages', 'Complete reports & insights', 'Content recommendations', 'Priority support'],
    buttonText: t('get_started'),
    to: '/app',
  };
  
  return <section id="pricing" className="py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Pricing</span>
          <h2 className="text-3xl md:text-4xl mb-4 font-bold text-zinc-50">
            Simple, transparent pricing
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-zinc-400">
            Pay-as-You-Go
          </p>
        </div>
        
        <div className="flex justify-center">
          <div 
            className="
              rounded-xl p-8 transition-all duration-300 
              bg-gradient-to-br from-vextor-900 to-blue-900 border-2 border-purple-500 shadow-xl
              max-w-md w-full
            "
          >
            <div className="flex items-center justify-center mb-2">
              <h3 className="text-xl font-bold text-zinc-50 text-center">
                {pricingPlan.name}
              </h3>
            </div>
            
            <div className="mt-4 mb-6 text-center">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-purple-300">
                  ${pricingPlan.price}
                </span>
                <span className="ml-1 text-zinc-400">{t('monthly')}</span>
              </div>
              <p className="text-zinc-400 mt-2 text-sm">
                {pricingPlan.description}
              </p>
            </div>
            
            <ul className="mt-6 mb-10 space-y-3">
              {pricingPlan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-0.5 rounded-full p-1 bg-purple-500/20">
                    <CheckIcon className="h-3 w-3 text-purple-400" />
                  </div>
                  <span className="ml-3 text-zinc-400 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to={pricingPlan.to}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/30">
                {pricingPlan.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};

export default PricingSection;
