
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Users, Search, Award, ArrowUpRight, UserCheck, Trophy } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockData = [
  { name: 'Jan', before: 30, after: 45 },
  { name: 'Feb', before: 35, after: 60 },
  { name: 'Mar', before: 40, after: 70 },
  { name: 'Apr', before: 32, after: 75 },
  { name: 'May', before: 45, after: 90 },
  { name: 'Jun', before: 50, after: 100 },
];

const BenefitSection = () => {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: ArrowUpRight,
      title: t('benefit_3_title'),
      description: t('benefit_3_desc'),
      iconColor: 'text-graph-green',
      bgColor: 'bg-green-100',
    },
    {
      icon: UserCheck,
      title: t('benefit_4_title'),
      description: t('benefit_4_desc'),
      iconColor: 'text-graph-blue',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Search,
      title: t('benefit_5_title'),
      description: t('benefit_5_desc'),
      iconColor: 'text-graph-orange',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Trophy,
      title: t('benefit_6_title'),
      description: t('benefit_6_desc'),
      iconColor: 'text-graph-purple',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('key_benefits_title')}
          </h2>
          <div className="w-24 h-1 bg-vextor-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              SEO Performance Improvement
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="before" fill="#94a3b8" name="Before Vextor" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" fill="#0ea2e9" name="After Vextor" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
