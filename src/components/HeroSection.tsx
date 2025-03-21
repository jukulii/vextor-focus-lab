
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const HeroSection = () => {
  const { t } = useLanguage();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!vantaRef.current) return;
    
    // Make sure VANTA is available
    if (typeof window.VANTA !== 'undefined' && !isInitialized) {
      // Initialize the effect with enhanced settings
      vantaEffect.current = window.VANTA.DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff0077,      // Bright pink
        color2: 0x8800ff,     // Purple
        backgroundColor: 0x000000,
        size: 4.50,           // Increased dot size
        spacing: 20.00,       // Decreased spacing for more dots
        showLines: true,
        speed: 1.5,           // Slightly faster animation
        points: 18,           // More points for denser effect
        maxDistance: 25.00,   // Maximum distance between points
        highlightColor: 0xff3366,  // Highlight color for interactive dots
        highlightIntensity: 0.5    // Intensity of the highlight
      });
      
      setIsInitialized(true);
      console.log('HeroSection VANTA DOTS initialized with enhanced settings');
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [isInitialized]);
  
  return (
    <section ref={vantaRef} className="pt-36 pb-16 md:pt-48 md:pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-3xl mx-auto z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 fade-in leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-gray-500 mb-8 fade-in stagger-1 max-w-2xl mx-auto text-balance">
              {t('hero_subtitle')}
            </p>
            <div className="space-x-4 fade-in stagger-2">
              <Link to="/app">
                <Button 
                  size="lg" 
                  className="bg-vextor-600 hover:bg-vextor-700 transition-all duration-300 button-glow px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                >
                  Analyze
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
