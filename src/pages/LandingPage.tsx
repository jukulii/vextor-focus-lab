
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeatureSection from '@/components/FeatureSection';
import BenefitSection from '@/components/BenefitSection';
import TestimonialSection from '@/components/TestimonialSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LandingPage = () => {
  const location = useLocation();
  const initialized = useRef(false);
  
  // Handle scrolling to sections
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
    
    // Track if we've done initial navigation
    if (!initialized.current) {
      initialized.current = true;
      
      // Handle hash navigation (e.g., if coming from another page with /#section)
      if (location.hash) {
        // Add a slight delay to ensure the page has fully loaded
        setTimeout(() => {
          const element = document.getElementById(location.hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [location.pathname]);
  
  // Handle hash changes after initial load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar isDark={false} />
        <main className="flex-grow">
          <HeroSection />
          <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <HowItWorks />
            <FeatureSection />
            <BenefitSection />
            <TestimonialSection />
            <PricingSection />
            <FAQSection />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
