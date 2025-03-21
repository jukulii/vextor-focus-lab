
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeatureSection from '@/components/FeatureSection';
import BenefitSection from '@/components/BenefitSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import VantaBackground from '@/components/VantaBackground';
import { useEffect } from 'react';

const LandingPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Handle hash links for smooth scrolling
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    // Run once on mount to handle initial hash
    handleHashChange();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <VantaBackground className="min-h-screen w-full">
        <Navbar isDark={true} />
        <main className="flex-grow">
          <HeroSection />
          <HowItWorks />
          <FeatureSection />
          <BenefitSection />
          <PricingSection />
        </main>
        <Footer />
      </VantaBackground>
    </div>
  );
};

export default LandingPage;
