
import { useEffect, useRef } from 'react';

interface VantaBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const VantaBackground = ({ children, className = '' }: VantaBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Dot properties
    const dots: {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }[] = [];

    // Create dots
    const createDots = () => {
      const dotCount = Math.floor(window.innerWidth * window.innerHeight / 10000);
      dots.length = 0; // Clear existing dots
      
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.5 + 0.5})`,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    };

    createDots();
    window.addEventListener('resize', createDots);

    // Draw dots and connections
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw dots
      dots.forEach((dot, i) => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        
        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < dots.length; j++) {
          const otherDot = dots[j];
          const dx = dot.x - otherDot.x;
          const dy = dot.y - otherDot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${(100 - distance) / 500})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', createDots);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`${className} w-full h-full`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
