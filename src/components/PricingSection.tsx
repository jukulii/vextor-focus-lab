
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { CheckIcon, Sparkles } from 'lucide-react';
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

  return (
    <section id="pricing" className="py-20 border-t border-gray-200 relative overflow-hidden">
      {/* Background elements for visual interest */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8da2e5]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#8da2e5]/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative">
          <div className="inline-block animate-pulse-subtle">
            <span className="bg-[#8da2e5]/20 text-[#8da2e5] px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4 border border-[#8da2e5]/30">
              <Sparkles className="w-4 h-4 inline-block mr-2" />
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl mb-4 font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-700">
            Flexible, Usage-Based Pricing
          </p>
          
          {/* Added highlight accent */}
          <div className="absolute w-20 h-1 bg-[#8da2e5] left-1/2 -translate-x-1/2 bottom-0 rounded-full"></div>
        </div>
        
        <div className="flex justify-center">
          {/* Added subtle animation and enhanced styling */}
          <div className="
              rounded-xl p-8 transition-all duration-300 
              bg-gradient-to-br from-[#8da2e5] to-[#7a8fd2] border border-[#8da2e5]/30 shadow-2xl
              max-w-md w-full hover:shadow-[#8da2e5]/10 hover:scale-[1.02]
              relative overflow-hidden
            ">
            {/* Decorative elements */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-white/10 rounded-full"></div>
            
            {/* Badge with glow effect */}
            <div className="flex justify-center mb-4">
              <p className="text-zinc-200 mt-1 mb-2 text-sm bg-[#8da2e5]/30 px-4 py-1.5 rounded-full font-medium text-center inline-flex items-center shadow-lg shadow-[#8da2e5]/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Free trial version for 1 000 URL's
              </p>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <h3 className="font-bold text-zinc-50 text-center text-3xl">
                {pricingPlan.name}
              </h3>
            </div>
            
            <div className="mt-4 mb-8 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="bg-white/20 text-white font-medium text-lg px-3 py-1 rounded-md backdrop-blur-sm">
                  Starts from
                </span>
                <span className="text-zinc-50 text-4xl font-bold">
                  ${selectedTier.price}
                </span>
                <span className="text-zinc-300 ml-2 text-lg">/month</span>
              </div>
              
              <div className="mt-4">
                <Select defaultValue={selectedTier.urls} onValueChange={handlePriceChange}>
                  <SelectTrigger className="w-full bg-[#8da2e5]/50 border-[#8da2e5]/50 focus:ring-[#8da2e5]/50 text-white">
                    <SelectValue placeholder="Select URLs per month" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#7a8fd2] border-[#8da2e5]/50">
                    {pricingTiers.map((tier) => (
                      <SelectItem 
                        key={tier.urls} 
                        value={tier.urls} 
                        className="text-white hover:bg-[#6a7fc2] focus:bg-[#6a7fc2] cursor-pointer"
                      >
                        {tier.urls} URLs (${tier.pricePerUrl} per URL)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ul className="mt-6 mb-10 space-y-4">
              {pricingPlan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-0.5 rounded-full p-1.5 bg-white/20 animate-pulse-subtle">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-zinc-100 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to={pricingPlan.to}>
              <Button className="w-full bg-white hover:bg-zinc-100 text-[#7a8fd2] shadow-lg shadow-[#8da2e5]/30 py-6 text-lg font-medium transition-all duration-300">
                {pricingPlan.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
