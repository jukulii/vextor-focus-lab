
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    // Make sure Vanta is available
    if (!window.VANTA) {
      console.warn('Vanta.js not loaded');
      return;
    }
    
    // Allow a small delay for DOM to be fully ready
    const timer = setTimeout(() => {
      if (vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x3f51ff,
          color2: 0x0d47a1,
          backgroundColor: 0x0a0a0a,
          size: 3.00,
          spacing: 20.00,
          showLines: true
        });
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef}
      className={`${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
