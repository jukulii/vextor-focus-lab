
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
        spacing: 5.00,
        chaos: 6.00,
        showDots: true,
        showLines: true,
        showDistance: true,
        trunk: 4,
        forceAnimate: true,
        graphData: [4, 8, 12, 8, 4, 8, 12, 16], // Enhanced data points for the graph
        graphMode: true,
        graphScale: 0.8,
        graphSpeed: 1.5,
        graphDensity: 0.8
      });
      
      setIsInitialized(true);
      
      // Enhance graph visualization in containers
      setTimeout(() => {
        const graphContainers = document.querySelectorAll('.vanta-graph-container');
        graphContainers.forEach(container => {
          if (container instanceof HTMLElement) {
            container.dataset.vantaGraphEnabled = 'true';
            container.dataset.vantaGraphScale = '1.2';
            container.dataset.vantaGraphSpeed = '2';
          }
        });
        
        console.log('VANTA TRUNK initialized with graph visualization enabled');
      }, 500);
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
