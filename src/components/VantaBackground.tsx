
import { useEffect, useRef, useState } from 'react';

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!vantaRef.current) return;
    
    // Make sure VANTA is available
    if (typeof window.VANTA !== 'undefined' && !isInitialized) {
      // Initialize the effect with settings to match the image
      vantaEffect.current = window.VANTA.TRUNK({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff4d8e, // Pink/purple color for the lines
        backgroundColor: 0x1a1a1a, // Dark background
        spacing: 3.50, // Tighter line spacing
        chaos: 2.00, // Less chaos for more circular pattern
        showDots: false, // No dots for cleaner look
        showLines: true,
        showDistance: false, // No distance display
        trunk: 10, // Increase trunk size for more circular pattern
        forceAnimate: true,
        trunkThickness: 3.5, // Thinner lines
        ringSize: 1.0, // Creates more circular rings
        trunkSizeVariation: 0.3, // Less variation in trunk size
        concentricRings: true, // Enable concentric ring pattern
        shape: "circle", // Force circular shape
        symmetry: 8, // High symmetry for even distribution
        noiseSpeed: 0.5
      });
      
      setIsInitialized(true);
      
      // Add custom styling for a fuller effect
      const vantaCanvas = vantaRef.current.querySelector('canvas');
      if (vantaCanvas instanceof HTMLElement) {
        vantaCanvas.style.opacity = '0.9';
      }
      
      console.log('VANTA TRUNK initialized with circular pattern');
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [isInitialized]);

  return (
    <div ref={vantaRef} className={`relative ${className}`} style={{ backgroundColor: '#1a1a1a' }}>
      {children}
    </div>
  );
};

export default VantaBackground;
