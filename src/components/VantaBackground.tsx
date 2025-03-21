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
  const [documentHeight, setDocumentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Handle scroll events and viewport resizing
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      updateDocumentHeight();
    };
    
    const updateDocumentHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      setDocumentHeight(height);
    };

    // Initial document height calculation
    updateDocumentHeight();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Set up a mutation observer to detect DOM changes that might affect document height
    const observer = new MutationObserver(updateDocumentHeight);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
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
          minHeight: documentHeight || 1000, // Use document height or fallback
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
  }, [documentHeight]);

  // Update effect position based on scroll
  useEffect(() => {
    if (vantaEffect.current && vantaRef.current && documentHeight > 0) {
      // Calculate scroll progress relative to full document (0 to 1)
      const scrollRange = documentHeight - viewportHeight;
      const scrollProgress = scrollY / scrollRange;
      
      // Instead of moving the background up with scroll (which makes it disappear),
      // we'll ensure it follows along with minimal parallax offset
      const parallaxFactor = 0.1; // Very slight parallax to create depth without losing visibility
      const translateY = scrollY * parallaxFactor;
      
      // Apply transform to keep the effect visible throughout scroll
      vantaRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      
      // Adjust Vanta effect properties based on scroll position
      if (vantaEffect.current.options) {
        // Dynamic spacing changes to create subtle zoom effect
        const baseSpacing = 20;
        const maxSpacingChange = 10;
        const newSpacing = baseSpacing + (scrollProgress * maxSpacingChange);
        
        // Subtle color transitions throughout the scroll
        const startHue = 240; // Blue
        const endHue = 280;   // Purple
        const hueChange = startHue + (scrollProgress * (endHue - startHue));
        
        // Update Vanta effect properties
        vantaEffect.current.setOptions({
          spacing: newSpacing,
        });
      }
    }
  }, [scrollY, documentHeight, viewportHeight]);

  return (
    <div 
      ref={vantaRef}
      className={`fixed inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%', // Use 100% instead of 100vh to ensure full coverage
        zIndex: 0,
        transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
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
