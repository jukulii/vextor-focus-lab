
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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Handle scroll events and viewport resizing
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
    if (vantaEffect.current && vantaRef.current) {
      // Calculate a normalized scroll position (0 to 1) based on document height
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // Use viewportHeight to ensure full coverage while scrolling
      const scrollRange = documentHeight - viewportHeight;
      const scrollProgress = scrollY / scrollRange;
      
      // Apply parallax effect with varying intensity based on scroll position
      const translateY = scrollY * 0.4;
      
      // Apply smooth transform
      vantaRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      
      // Optionally adjust other properties based on scroll progress
      if (vantaEffect.current.options) {
        // Subtle color shift based on scroll position (optional)
        const hue1 = 240 + (scrollProgress * 30); // Shift from blue toward purple
        const hue2 = 210 + (scrollProgress * 30); // Shift from dark blue
        
        // Adjust spacing to create a "zoom" effect while scrolling
        const baseSpacing = 20;
        const spacingVariation = scrollProgress * 5;
        
        // Update Vanta effect properties
        vantaEffect.current.setOptions({
          spacing: baseSpacing + spacingVariation,
        });
      }
    }
  }, [scrollY, viewportHeight]);

  return (
    <div 
      ref={vantaRef}
      className={`fixed inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100vh', // Use viewport height for consistent coverage
        zIndex: 0,
        transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)' // Smoother easing
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
