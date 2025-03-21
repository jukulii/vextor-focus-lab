
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeatureSection from '@/components/FeatureSection';
import BenefitSection from '@/components/BenefitSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const LandingPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <FeatureSection />
        <BenefitSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
