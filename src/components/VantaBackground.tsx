
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!vantaRef.current) return;
    
    // Make sure VANTA is available
    if (typeof window.VANTA !== 'undefined' && !isInitialized) {
      // Initialize the effect
      vantaEffect.current = window.VANTA.DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff0077,
        color2: 0x8800ff,
        backgroundColor: 0x000000,
        size: 3.00,
        spacing: 30.00,
        showLines: false
      });
      
      setIsInitialized(true);
      console.log('VANTA DOTS initialized');
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [isInitialized]);

  return (
    <div ref={vantaRef} className={`relative ${className}`}>
      {children}
    </div>
  );
};

export default VantaBackground;
