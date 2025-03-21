import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Users, Search, Award, ArrowUpRight, UserCheck, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useRef, useState } from 'react';
const mockData = [{
  name: 'Jan',
  before: 30,
  after: 45
}, {
  name: 'Feb',
  before: 35,
  after: 60
}, {
  name: 'Mar',
  before: 40,
  after: 70
}, {
  name: 'Apr',
  before: 32,
  after: 75
}, {
  name: 'May',
  before: 45,
  after: 90
}, {
  name: 'Jun',
  before: 50,
  after: 100
}];
const BenefitSection = () => {
  const {
    t
  } = useLanguage();
  const benefits = [{
    icon: ArrowUpRight,
    title: t('benefit_3_title'),
    description: t('benefit_3_desc'),
    iconColor: 'text-graph-green',
    bgColor: 'bg-green-900'
  }, {
    icon: UserCheck,
    title: t('benefit_4_title'),
    description: t('benefit_4_desc'),
    iconColor: 'text-graph-blue',
    bgColor: 'bg-blue-900'
  }, {
    icon: Search,
    title: "Eliminate content that drags your rankings down",
    description: t('benefit_5_desc'),
    iconColor: 'text-graph-orange',
    bgColor: 'bg-orange-900'
  }, {
    icon: Trophy,
    title: "Understand how Google evaluates your site",
    description: t('benefit_6_desc'),
    iconColor: 'text-graph-purple',
    bgColor: 'bg-purple-900'
  }];
  return <>
      <section className="py-16 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="bg-blue-900 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Improve your SEO performance
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Optimize your content and achieve higher rankings
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gray-900 rounded-xl p-8 shadow-md border border-gray-800 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-4">
                SEO Performance Improvement
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData} margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20
                }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                    fill: '#a3a3a3'
                  }} />
                    <YAxis axisLine={false} tickLine={false} tick={{
                    fill: '#a3a3a3'
                  }} />
                    <Tooltip contentStyle={{
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} labelStyle={{
                    color: '#fff'
                  }} itemStyle={{
                    color: '#fff'
                  }} />
                    <Bar dataKey="before" fill="#4b5563" name="Before Vextor" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="after" fill="#0ea2e9" name="After Vextor" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => <div key={index} className="bg-gray-900 rounded-xl p-6 shadow-md border border-gray-800 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                  <div className={`w-12 h-12 ${benefit.bgColor} rounded-full flex items-center justify-center mb-4`}>
                    <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {benefit.description}
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </section>
      
      
    </>;
};
const VantaDotsGraph = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (!vantaRef.current) return;

    // Make sure VANTA is available
    if (typeof window.VANTA !== 'undefined' && !isInitialized) {
      // Initialize the effect with different settings than the main background
      vantaEffect.current = window.VANTA.DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 400.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x0ea2e9,
        // Blue primary color
        color2: 0x6366f1,
        // Purple accent
        backgroundColor: 0x111111,
        size: 4.00,
        spacing: 20.00,
        showLines: true,
        speed: 1.5
      });
      setIsInitialized(true);
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [isInitialized]);
  return;
};
export default BenefitSection;