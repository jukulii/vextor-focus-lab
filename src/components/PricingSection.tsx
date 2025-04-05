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
  const { t, language } = useLanguage();
  
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
    name: language === 'pl' ? "Elastyczny plan wzrostu" : "Scale as You Grow",
    description: t('price_pro_desc'),
    features: language === 'pl' 
      ? ['Opłata tylko za wykorzystane URL-e', 'Szczegółowe raporty i analizy', 'Rekomendacje treści', 'Priorytetowe wsparcie']
      : ['Charge based on what you actually use', 'Complete reports & insights', 'Content recommendations', 'Priority support'],
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
            <span className="bg-[#ff6b6b]/20 text-[#ff6b6b] px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4 border border-[#ff6b6b]/30">
              <Sparkles className="w-4 h-4 inline-block mr-2" />
              {language === 'pl' ? "Cennik" : "Pricing"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl mb-4 font-bold text-gray-900">
            {language === 'pl' ? "Prosty, transparentny cennik" : "Simple, transparent pricing"}
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-700">
            {language === 'pl' ? "Elastyczny cennik oparty na rzeczywistym użyciu" : "Flexible, Usage-Based Pricing"}
          </p>
          <div className="w-16 h-1 bg-[#8da2e5] mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="flex justify-center">
          {/* Added contrast colors and enhanced styling */}
          <div className="
              rounded-xl p-8 transition-all duration-300 
              bg-gradient-to-br from-[#5d6cd0] to-[#4c5ebb] border border-[#4c5ebb]/50 shadow-2xl
              max-w-md w-full hover:shadow-[#8da2e5]/20 hover:scale-[1.02]
              relative overflow-hidden
            ">
            {/* Decorative elements with high contrast */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-white/20 rounded-full"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-white/20 rounded-full"></div>
            
            {/* Badge with contrast glow effect */}
            <div className="flex justify-center mb-4">
              <p className="text-white mt-1 mb-2 text-sm bg-[#ff6b6b]/80 px-4 py-1.5 rounded-full font-medium text-center inline-flex items-center shadow-lg shadow-[#ff6b6b]/20">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'pl' ? "Wersja próbna dla 1 000 URL-i za darmo" : "Free trial version for 1 000 URL's"}
              </p>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <h3 className="font-bold text-white text-center text-3xl">
                {pricingPlan.name}
              </h3>
            </div>
            
            <div className="mt-4 mb-8 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="bg-[#ff6b6b]/90 text-white font-medium text-lg px-3 py-1 rounded-md backdrop-blur-sm">
                  {language === 'pl' ? "Od" : "Starts from"}
                </span>
                <span className="text-white text-4xl font-bold">
                  ${selectedTier.price}
                </span>
                <span className="text-white/80 ml-2 text-lg">{language === 'pl' ? "/miesiąc" : "/month"}</span>
              </div>
              
              <div className="mt-4">
                <Select defaultValue={selectedTier.urls} onValueChange={handlePriceChange}>
                  <SelectTrigger className="w-full bg-white/20 border-white/30 focus:ring-white/50 text-white">
                    <SelectValue placeholder={language === 'pl' ? "Liczba URL na miesiąc" : "Select URLs per month"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#4c5ebb] border-white/30">
                    {pricingTiers.map((tier) => (
                      <SelectItem 
                        key={tier.urls} 
                        value={tier.urls} 
                        className="text-white hover:bg-[#3a4aa8] focus:bg-[#3a4aa8] cursor-pointer"
                      >
                        {tier.urls} {language === 'pl' ? `URL (${tier.pricePerUrl}$ za URL)` : `URLs (${tier.pricePerUrl} per URL)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ul className="mt-6 mb-10 space-y-4">
              {pricingPlan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-0.5 rounded-full p-1.5 bg-[#ff6b6b] animate-pulse-subtle">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-white text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to={pricingPlan.to}>
              <Button variant="highlight" className="w-full py-6 text-lg font-medium transition-all duration-300 border-2 border-white/20 hover:border-white/40">
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
