
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PricingSection = () => {
  const { t } = useLanguage();
  
  // Define pricing tiers
  const pricingTiers = [
    { urls: "5000", price: "49", pricePerUrl: "0.00980" },
    { urls: "10000", price: "89", pricePerUrl: "0.00890" },
    { urls: "25000", price: "199", pricePerUrl: "0.00796" },
    { urls: "50000", price: "349", pricePerUrl: "0.00698" },
    { urls: "100000", price: "599", pricePerUrl: "0.00599" },
  ];
  
  const [selectedTier, setSelectedTier] = useState(pricingTiers[0]);

  const handlePriceChange = (value: string) => {
    const tier = pricingTiers.find(tier => tier.urls === value);
    if (tier) {
      setSelectedTier(tier);
    }
  };

  // Keep only the Pro plan
  const pricingPlan = {
    name: "Scale as You Grow",
    description: t('price_pro_desc'),
    features: ['Charge based on what you actually use', 'Complete reports & insights', 'Content recommendations', 'Priority support'],
    buttonText: t('get_started'),
    to: '/login' // Changed from '/app' to '/login'
  };

  return <section id="pricing" className="py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Pricing</span>
          <h2 className="text-3xl md:text-4xl mb-4 font-bold text-zinc-50">
            Simple, transparent pricing
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-zinc-400">
            Flexible, Usage-Based Pricing
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="
              rounded-xl p-8 transition-all duration-300 
              bg-gradient-to-br from-purple-900 to-blue-950 border border-purple-500/30 shadow-2xl
              max-w-md w-full hover:shadow-purple-500/10 hover:scale-[1.02]
            ">
            <p className="text-zinc-200 mt-1 mb-6 text-sm bg-purple-600/30 px-3 py-1.5 rounded-md font-medium text-center">
              Free trial version for 1 000 URL's
            </p>
            
            <div className="flex items-center justify-center mb-6">
              <h3 className="font-bold text-zinc-50 text-center text-3xl">
                {pricingPlan.name}
              </h3>
            </div>
            
            <div className="mt-4 mb-8 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="bg-purple-600 text-white font-medium text-lg px-3 py-1 rounded-md">
                  Starts from
                </span>
                <span className="text-zinc-50 text-4xl font-bold">
                  ${selectedTier.price}
                </span>
                <span className="text-zinc-400 ml-2 text-lg">/month</span>
              </div>
              
              <div className="mt-4">
                <Select defaultValue={selectedTier.urls} onValueChange={handlePriceChange}>
                  <SelectTrigger className="w-full bg-blue-900/50 border-purple-700/50 focus:ring-purple-500/50 text-white">
                    <SelectValue placeholder="Select URLs per month" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-purple-700/50">
                    {pricingTiers.map((tier) => (
                      <SelectItem 
                        key={tier.urls} 
                        value={tier.urls} 
                        className="text-white hover:bg-blue-800 focus:bg-blue-800 cursor-pointer"
                      >
                        {tier.urls} URLs (${tier.pricePerUrl} per URL)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ul className="mt-6 mb-10 space-y-4">
              {pricingPlan.features.map((feature, i) => <li key={i} className="flex items-start">
                  <div className="mt-0.5 rounded-full p-1.5 bg-purple-500/20">
                    <CheckIcon className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="ml-3 text-zinc-300 text-sm">{feature}</span>
                </li>)}
            </ul>
            
            <Link to={pricingPlan.to}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/30 py-6 text-lg font-medium">
                {pricingPlan.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default PricingSection;
