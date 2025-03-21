
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const { t } = useLanguage();

  const pricingPlans = [
    {
      name: t('price_free_title'),
      price: '0',
      description: t('price_free_desc'),
      features: [
        'Basic website analysis',
        'Up to 100 pages',
        'Limited reports',
        'Email support'
      ],
      buttonText: t('get_started'),
      to: '/app',
      highlighted: false
    },
    {
      name: t('price_pro_title'),
      price: '49',
      description: t('price_pro_desc'),
      features: [
        'Full website analysis',
        'Up to 1,000 pages',
        'Complete reports & insights',
        'Content recommendations',
        'Priority support'
      ],
      buttonText: t('get_started'),
      to: '/app',
      highlighted: true
    },
    {
      name: t('price_enterprise_title'),
      price: null,
      description: t('price_enterprise_desc'),
      features: [
        'Unlimited website analysis',
        'Custom integrations',
        'API access',
        'Dedicated account manager',
        'Custom reporting'
      ],
      buttonText: t('contact_us'),
      to: '#contact',
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('pricing_title')}
          </h2>
          <div className="w-24 h-1 bg-vextor-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                rounded-xl p-8 transition-all 
                ${plan.highlighted 
                  ? 'bg-white border-2 border-vextor-500 shadow-lg scale-105 z-10' 
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                }
              `}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              
              <div className="mt-4 mb-6">
                {plan.price ? (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="ml-1 text-gray-500">{t('monthly')}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-900 mt-4">
                    {t('contact_us')}
                  </div>
                )}
                <p className="text-gray-600 mt-2 text-sm">
                  {plan.description}
                </p>
              </div>
              
              <ul className="mt-6 mb-10 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className={`mt-0.5 rounded-full p-1 ${plan.highlighted ? 'bg-vextor-100' : 'bg-gray-100'}`}>
                      <CheckIcon className={`h-3 w-3 ${plan.highlighted ? 'text-vextor-600' : 'text-gray-600'}`} />
                    </div>
                    <span className="ml-3 text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to={plan.to}>
                <Button 
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-vextor-600 hover:bg-vextor-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
