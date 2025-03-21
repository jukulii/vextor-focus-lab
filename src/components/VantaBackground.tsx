
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
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          showLines: true,
          pixelDensity: 1
        });
      }
    }, 300);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  // Update effect position based on scroll
  useEffect(() => {
    if (vantaEffect.current) {
      // Create a smooth parallax effect by adjusting the position
      const translateY = scrollY * 0.3; // Increased multiplier for more prominent movement
      
      if (vantaRef.current) {
        // Apply the transform with a slight delay for a smoother feeling
        vantaRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    }
  }, [scrollY]);

  return (
    <div 
      ref={vantaRef}
      className={`fixed inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        zIndex: 0,
        transition: 'transform 0.3s ease-out' // Smoother transition
      }}
    >
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default VantaBackground;
