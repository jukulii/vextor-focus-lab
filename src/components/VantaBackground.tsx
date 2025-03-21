
import { useEffect, useRef, useState } from 'react';

interface VantaBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

declare global {
  interface Window {
    VANTA: {
      DOTS: (config: any) => any;
    };
  }
}

const VantaBackground = ({ children, className = '' }: VantaBackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [vantaInitialized, setVantaInitialized] = useState(false);

  useEffect(() => {
    // Give time for the DOM to fully render before initializing Vanta
    const timer = setTimeout(() => {
      if (!vantaRef.current) return;
      
      // Check if VANTA is available globally and not already initialized
      if (window.VANTA && typeof window.VANTA.DOTS === 'function' && !vantaInitialized) {
        console.log('Initializing VANTA.DOTS in VantaBackground component');
        
        try {
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
            size: 6.00,           // Larger dot size
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
          
          setVantaInitialized(true);
          console.log('VANTA DOTS successfully initialized in VantaBackground');
        } catch (error) {
          console.error('Error initializing VANTA effect:', error);
        }
      } else if (!window.VANTA || typeof window.VANTA.DOTS !== 'function') {
        console.error('VANTA.DOTS is not available. Make sure Vanta.js is properly loaded.');
      }
    }, 500); // Longer delay to ensure DOM and scripts are fully loaded
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        console.log('Cleaning up VANTA effect in VantaBackground');
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [vantaInitialized]);

  return (
    <div ref={vantaRef} className={`${className} w-full h-full`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
