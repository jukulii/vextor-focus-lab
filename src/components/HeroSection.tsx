
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
      // Initialize the effect with graph-like settings
      vantaEffect.current = window.VANTA.DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x33C3F0,      // Bright blue
        color2: 0xD946EF,     // Magenta pink
        backgroundColor: 0x000000,
        size: 6.50,           // Larger dot size
        spacing: 15.00,       // Tighter spacing for grid appearance
        showLines: true,      // Show connecting lines for graph effect
        speed: 1.8,           // Faster animation
        points: 28,           // More points for denser graph
        maxDistance: 25.00,   // Decreased maximum distance for more connections
        lineColor: 0x0EA5E9,  // Line color that matches the dots
        lineWidth: 0.8,       // Slightly thicker lines
        highlightColor: 0xF97316,  // Bright orange highlight
        highlightIntensity: 0.8    // Higher intensity highlight
      });
      
      setIsInitialized(true);
      console.log('HeroSection VANTA DOTS initialized with graph-like settings');
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
            <p className="text-xl text-white mb-8 fade-in stagger-1 max-w-2xl mx-auto text-balance">
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
