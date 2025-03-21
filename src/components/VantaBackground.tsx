
import { useEffect, useRef } from 'react';

interface VantaBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

declare global {
  interface Window {
    VANTA: {
      TRUNK: (config: any) => any;
    };
  }
}

const VantaBackground = ({ children, className = '' }: VantaBackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;
    
    // Make sure VANTA is available
    if (typeof window.VANTA !== 'undefined') {
      // Initialize the effect
      vantaEffect.current = window.VANTA.TRUNK({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4e9b8c,
        backgroundColor: 0xffffff,
        spacing: 4.00,
        chaos: 5.00,
        showDots: true,
        showLines: true,
        showDistance: true, // Enable showing distance
        trunk: 3,
        forceAnimate: true
      });
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className={`relative ${className}`}>
      {children}
    </div>
  );
};

export default VantaBackground;
