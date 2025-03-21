
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
    // Wait for component to mount and DOM to be ready
    if (!vantaRef.current) return;
    
    // Make sure VANTA is available and not already initialized
    if (typeof window.VANTA !== 'undefined' && !vantaInitialized) {
      console.log('Initializing VANTA.DOTS in VantaBackground component');
      
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
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        console.log('Cleaning up VANTA effect in VantaBackground');
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [vantaInitialized]);

  return (
    <div ref={vantaRef} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default VantaBackground;
