
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for changes in dark mode
    const observer = new MutationObserver(() => {
      const isDarkUpdated = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDarkUpdated);
      
      // Cleanup and reinitialize effect when dark mode changes
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
        initVantaEffect();
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const initVantaEffect = () => {
    // Make sure Vanta is available
    if (!window.VANTA) {
      console.warn('Vanta.js not loaded');
      return;
    }
    
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
        color: isDarkMode ? 0x3f51ff : 0x3f51ff,
        color2: isDarkMode ? 0x6f92ff : 0x6f92ff,
        backgroundColor: isDarkMode ? 0x111827 : 0xffffff, // Dark gray in dark mode, white in light mode
        backgroundAlpha: 1,
        size: 3.00,
        spacing: 20.00,
        showLines: true,
        pixelDensity: 1
      });
    }
  };

  // Initialize Vanta effect
  useEffect(() => {
    // Allow a small delay for DOM to be fully ready
    const timer = setTimeout(() => {
      initVantaEffect();
    }, 300);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [isDarkMode]);

  return (
    <div 
      ref={vantaRef}
      className={`fixed inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100vh',
        zIndex: 0
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
